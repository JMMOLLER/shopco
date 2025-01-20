import { REDIS_SOCKET_HOST, REDIS_SOCKET_PORT } from "astro:env/server";
import { REDIS_USER, REDIS_PASSWORD } from "astro:env/server";
import { createClient } from "redis";

export class RedisConnection {
  private static instance: RedisConnection;
  private client;

  private constructor() {
    console.log('Connecting to Redis');
    this.client = createClient({
      username: REDIS_USER,
      password: REDIS_PASSWORD,
      socket: {
        host: REDIS_SOCKET_HOST,
        port: REDIS_SOCKET_PORT
      }
    });

    this.client.on("error", (error) => {
      console.error("Redis Client Error", error);
    });

    this.connect().then(() => {
      console.log("Connection suscessful!");
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
