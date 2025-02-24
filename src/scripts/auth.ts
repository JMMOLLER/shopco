import ToastMessage from "@libs/ToastMessage";

document.addEventListener("DOMContentLoaded", async () => {
  const toast = await ToastMessage.getInstance();
  const params = new URLSearchParams(window.location.search);
  const error = params.get("error");
  if (!error) return

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
});
