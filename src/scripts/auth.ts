import ToastMessage from "@libs/ToastMessage";

document.addEventListener("DOMContentLoaded", async () => {
  processAuthParams();
  setupBtnClickHandler();
});

/**
 * @summary Procesa los parámetros de la URL para mostrar mensajes de error
 */
async function processAuthParams() {
  const toast = await ToastMessage.getInstance();
  const params = new URLSearchParams(window.location.search);
  const error = params.get("error");
  if (!error) return;

  switch (error) {
    case "User not found":
      toast.warning("Account with this email does not exist.");
      break;
    case "Invalid password":
      toast.warning("Invalid password.");
      break;
    case "Email already in use":
      toast.warning("Email already in use.");
      break;
    default:
      toast.error("An error occurred. Please try again.");
      break;
  }
}

/**
 * @summary Agrega un manejador de eventos al botón de submit del formulario
 */
function setupBtnClickHandler() {
  try {
    const form = document.querySelector("form")!;
    const button = form.querySelector("button")!;
    button.addEventListener("click", async (e) => {
      if (!form.checkValidity()) return;
      const el = e.currentTarget as HTMLButtonElement;
      el.ariaBusy = "true";
    });
  } catch (error) {
    console.error(error);
  }
}
