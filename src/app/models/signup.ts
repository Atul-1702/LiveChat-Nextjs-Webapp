import { email, z } from "zod";
const SignupFormModel = z
  .object({
    name: z.string().min(3, "Name is required."),
    email: z.email("Invalid email address."),
    password: z.string().min(6, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupModel = z.infer<typeof SignupFormModel>;

export default SignupFormModel;
