import productsDetails from "./constants/products-details.ts";
import ProductDetailsModel from "@models/ProductDetails.ts";
import products from "./constants/products.ts";
import ProductModel from "@models/Product.ts";
import UserModel from "@models/Users.ts";
import users from "./constants/users.ts";
import db from ".";

export default async function seed() {
  console.log("\x1b[33m%s\x1b[0m", "Seeding database...");
  // Seed products
  await db.insert(ProductModel).values(products);
  console.log("\x1b[36m%s\x1b[0m", "Products seeded correctly.");

  // Seed product details
  await db.insert(ProductDetailsModel).values(productsDetails);
  console.log("\x1b[36m%s\x1b[0m", "Product details seeded correctly.");

  // Seed users
  await db.insert(UserModel).values(users);
  console.log("\x1b[36m%s\x1b[0m", "Users seeded correctly.");

  console.log("\x1b[32m%s\x1b[0m", "Database seeded successfully.");
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
});
