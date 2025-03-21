import UserLogin from "../schemas/UserLogin";
import UserModel from "@models/Users";
import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";
import lucia from "@config/auth";
import bcrypt from "bcrypt";
import db from "@db/index";

export const POST: APIRoute = async ({ cookies, request, redirect }) => {
  try {
    // Parsear los datos del formulario
    const form = await request.formData();
    const data = Object.fromEntries(form.entries());
    const parsedData = await UserLogin.parseAsync(data);

    // Buscar al usuario por su correo electrónico
    const user = await db.select().from(UserModel).where(eq(UserModel.email, parsedData.email)).get();
    if (!user) {
      return redirect(
        `/auth/login?error=${encodeURIComponent("User not found")}`
      );
    }

    // Verificar la contraseña
    const validPassword = bcrypt.compareSync(parsedData.password, user.password);

    if (!validPassword) {
      return redirect(
        `/auth/login?error=${encodeURIComponent("Invalid password")}`
      );
    }

    // Crear una sesión para el usuario
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    // Establecer la cookie de sesión
    cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    // Redirigir al usuario a la página principal
    return redirect("/");
  } catch (error) {
    console.error(error);
    return redirect(
      `/auth/login?error=${encodeURIComponent("Internal error")}`
    );
  }
};
