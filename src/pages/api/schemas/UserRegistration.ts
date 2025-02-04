import { z } from "astro/zod";

const UserRegistration = z.object({
  name: z.string().min(3).max(50),
  lastName: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(50)
});

export default UserRegistration;
