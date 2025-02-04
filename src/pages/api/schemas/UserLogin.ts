import UserRegistration from "./UserRegistration";
import { z } from "astro/zod";

/**
 * @description Extiende el esquema `UserRegistration`, solo conserva el campo `email` y agrega un campo de `password` porque el esquema original encripta la contraseña
 */
const UserLogin = UserRegistration.pick({ email: true }).extend({
  password: z.string().min(8).max(50)
});

export default UserLogin;
