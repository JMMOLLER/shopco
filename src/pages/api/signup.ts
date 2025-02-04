import UserRegistration from "./schemas/UserRegistration";
import { count, sql } from "drizzle-orm";
import UserModel from "@models/Users";
import type { APIRoute } from "astro";
import lucia from "@config/auth";
import db from "@db/index";

export const POST: APIRoute = async ({ cookies, request, redirect }) => {
  try {
    // Parsear los datos del formulario
    const form = await request.formData();
    const data = Object.fromEntries(form.entries());
    const parsedData = UserRegistration.parse(data);

    // Verificar si el email ya está en uso
    const isAvailable = await db
      .select({ count: count() })
      .from(UserModel)
      .where(sql`email = ${parsedData.email}`)
      .get();

    if (isAvailable && isAvailable.count > 0) {
      return redirect(
        `/auth/signup?error=${encodeURIComponent("Email already in use")}`
      );
    }

    // Insertar el usuario en la base de datos
    const [user] = await db.insert(UserModel).values(parsedData).returning();

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
      `/auth/signup?error=${encodeURIComponent("Internal error")}`
    );
  }
};
