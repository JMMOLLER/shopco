import RedisAdapter from "@libs/RedisAdapter";
import { RedisConnection } from "@db/redis";
import { Lucia } from "lucia";

// Obtener el cliente de Redis
const client = RedisConnection.getInstance().getClient();

// Crear una instancia de RedisAdapter
const adapter = new RedisAdapter(client);

// Crear una instancia de Lucia
const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: import.meta.env.PROD
    }
  }
});

export default lucia;
