import { REDIS_USER, REDIS_PASSWORD, REDIS_NAME } from "astro:env/server";
import { REDIS_SOCKET_HOST, REDIS_SOCKET_PORT } from "astro:env/server";
import type { RedisClientType } from "@redis/client";
import { createClient } from "redis";

export class RedisConnection {
  private static instance: RedisConnection;
  private maxRetries = 1; // Solo un reintento adicional
  private retryDelay = 3000; // 3 segundos
  private client: RedisClientType | undefined;

  private constructor() {
    this.handleInit()
  }

  private handleInit(){
    console.info('\x1b[33m%s\x1b[0m', "[Redis] Connecting to Redis...");
    this.client = createClient({
      name: REDIS_NAME,
      username: REDIS_USER,
      password: REDIS_PASSWORD,
      socket: {
        host: REDIS_SOCKET_HOST,
        port: REDIS_SOCKET_PORT,
        reconnectStrategy: (times) => {
          if (times < this.maxRetries) {
            return this.retryDelay;
          }

          this.client = undefined;
          return Error("Max retries reached");
        }
      }
    });

    this.client.on("error", (error) => {
      console.error('\x1b[31m%s\x1b[0m', "[Redis] Client Error", error);
    });

    this.connect().then(() => {
      console.info('\x1b[32m%s\x1b[0m', "[Redis] Connection suscessful!");
    }).catch((error) => {
      console.error('\x1b[31m%s\x1b[0m', "[Redis] Connection Error", error);
    })
  }

  public static getInstance(): RedisConnection {
    if (!RedisConnection.instance) {
      RedisConnection.instance = new RedisConnection();
    }

    return RedisConnection.instance;
  }

  public getClient() {
    if (!this.client) {
      console.warn('\x1b[33m%s\x1b[0m', "[Redis] Creating new client...");
      this.handleInit();
    }
    return this.client!;
  }

  private async connect() {
    await this.client!.connect();
  }
}
