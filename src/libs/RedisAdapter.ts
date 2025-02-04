import type { Adapter, DatabaseSession, DatabaseUser, UserId } from "lucia";
import UserModel, { type UserType } from "@models/Users";
import type { RedisClientType } from "@redis/client";
import { eq } from "drizzle-orm";
import db from "@db/index";

export default class RedisAdapter implements Adapter {
  client: RedisClientType;
  userIdField: keyof UserType = "id";

  constructor(client: RedisClientType, userIdField?: keyof UserType) {
    this.client = client;
    if (userIdField) {
      this.userIdField = userIdField;
    }
  }

  async getSessionAndUser(
    sessionId: string
  ): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]> {
    const session = await this.getSession(sessionId);
    if (!session) return [null, null];
    const user = (await db
      .select()
      .from(UserModel)
      .where(eq(UserModel[this.userIdField], session.userId))
      .get()) as unknown as DatabaseUser;
    return [session, user ? user : null];
  }

  async getUserSessions(userId: UserId): Promise<DatabaseSession[]> {
    const keys = await this.client.keys(`session:*`);
    const sessions: DatabaseSession[] = [];
    for (const key of keys) {
      const sessionData = await this.client.get(key);
      if (sessionData) {
        const session = JSON.parse(sessionData) as DatabaseSession;
        if (session.userId === userId) {
          sessions.push(session);
        }
      }
    }
    return sessions;
  }

  async updateSessionExpiration(
    sessionId: string,
    expiresAt: Date
  ): Promise<void> {
    const session = await this.getSession(sessionId);
    if (session) {
      session.expiresAt = expiresAt;
      await this.setSession(session);
    }
  }

  async deleteUserSessions(userId: UserId): Promise<void> {
    const sessions = await this.getUserSessions(userId);
    for (const session of sessions) {
      await this.deleteSession(session.id);
    }
  }

  async deleteExpiredSessions(): Promise<void> {
    const keys = await this.client.keys(`session:*`);
    const now = Date.now();
    for (const key of keys) {
      const sessionData = await this.client.get(key);
      if (sessionData) {
        const session = JSON.parse(sessionData) as DatabaseSession;
        if (session.expiresAt.getTime() <= now) {
          await this.deleteSession(session.id);
        }
      }
    }
  }

  async setSession(session: DatabaseSession): Promise<void> {
    // Guardar sesión en Redis con TTL (expiración)
    await this.client.setEx(
      `session:${session.id}`,
      Math.floor((session.expiresAt.getTime() - Date.now()) / 1000),
      JSON.stringify(session)
    );
  }

  async getSession(sessionId: string): Promise<DatabaseSession | null> {
    const sessionData = await this.client.get(`session:${sessionId}`);
    if (!sessionData) return null;

    const parse = JSON.parse(sessionData) as DatabaseSession
    parse.expiresAt = new Date(parse.expiresAt);
    return parse;
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.client.del(`session:${sessionId}`);
  }
}
