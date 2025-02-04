import type { APIRoute } from "astro";
import lucia from "@config/auth";

export const GET: APIRoute = async ({ cookies, redirect, locals }) => {
  try {
    // Obtener el ID de la sesión del usuario
    const sessionId = locals.session?.id;
    if (!sessionId) {
      return redirect("/auth/login");
    }

    // Invalidar la sesión del usuario
    await lucia.invalidateSession(sessionId);

    // Eliminar la cookie de sesión del usuario
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies.delete(
      sessionCookie.name,
      sessionCookie.attributes
    );

    // Redirigir al usuario a la página principal
    return redirect("/");
  } catch (error) {
    console.error(error);
    return redirect("/auth/login");
  }
};
