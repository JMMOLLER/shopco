export default function getLocalCart(): LocalCart {
  try {
    return new Map(JSON.parse(localStorage.getItem("cart") || "[]"));
  } catch (error) {
    console.error("Failed to get cart from local storage", error);
    return new Map();
  }
}

export function setLocalCart(cart: LocalCart): void {
  localStorage.setItem("cart", JSON.stringify(Array.from(cart)));
}