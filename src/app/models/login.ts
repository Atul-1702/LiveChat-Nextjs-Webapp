import { z } from "zod";

const LoginFormModel = z.object({
  email: z.email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 8 characters."),
});

export type LoginModel = z.infer<typeof LoginFormModel>;

export default LoginFormModel;
