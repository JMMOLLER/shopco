import { z } from "astro/zod";
import bcrypt from "bcrypt";

const UserRegistration = z.object({
  name: z.string().min(3).max(50),
  lastName: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(50).transform(async (value) => {
    return await bcrypt.hash(value, 10);
  })
});

export default UserRegistration;
