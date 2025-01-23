import { REDIS_USER, REDIS_PASSWORD, REDIS_NAME } from "astro:env/server";
import { REDIS_SOCKET_HOST, REDIS_SOCKET_PORT } from "astro:env/server";
import { createClient } from "redis";

export class RedisConnection {
  private static instance: RedisConnection;
  private client;

  private constructor() {
    console.info('\x1b[33m%s\x1b[0m', "[Redis] Connecting to Redis...");
    this.client = createClient({
      name: REDIS_NAME,
      username: REDIS_USER,
      password: REDIS_PASSWORD,
      socket: {
        host: REDIS_SOCKET_HOST,
        port: REDIS_SOCKET_PORT
      }
    });

    this.client.on("error", (error) => {
      console.error('\x1b[31m%s\x1b[0m', "[Redis] Client Error", error);
    });

    this.connect().then(() => {
      console.info('\x1b[32m%s\x1b[0m', "[Redis] Connection suscessful!");
    });
  }

  public static getInstance(): RedisConnection {
    if (!RedisConnection.instance) {
      RedisConnection.instance = new RedisConnection();
    }

    return RedisConnection.instance;
  }

  public getClient() {
    return this.client;
  }

  private async connect() {
    await this.client.connect();
  }
}
