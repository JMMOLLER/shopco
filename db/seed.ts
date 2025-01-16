import products from "./constants/products.json" assert { type: "json" };
import Product from "@models/Product"
import db from ".";

export default async function seed() {
  console.log("Seeding database...");
  await db.insert(Product).values(products);

  console.log("Base de datos sembrada correctamente.");
}

seed().catch((error) => {
  console.error("Error al sembrar la base de datos:", error);
});
