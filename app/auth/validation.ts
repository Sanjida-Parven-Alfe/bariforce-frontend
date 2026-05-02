import { z } from "zod";

export const workerSchema = z.object({
  fullname: z.string().min(1, "Full name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .regex(
      /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
      "Email must be a valid Gmail address (@gmail.com)",
    ),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  //.regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, "Password must contain at least one special character (!@#$%^&* etc.)"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d+$/, "Phone number must contain only digits")
    .regex(/^\d{11}$/, "Phone must be exactly 11 digits"),
  workertype: z.string().min(1, "Worker type is required"),
});

export type WorkerFormData = z.infer<typeof workerSchema>;

export const adminSchema = z.object({
  fullname: z.string().min(3, "Full name must be at least 3 characters"),
  email: z
    .string()
    .min(1, "Official Email is required")
    .email("Invalid email address"),
  accessCode: z
    .string()
    .regex(/^\d{4,5}$/, "Access code must be 4 or 5 digits"),
  adminLevel: z.enum(["Super Admin", "Moderator"], {
    errorMap: () => ({ message: "Please select a valid admin level" }),
  }),
  experience: z
    .number({
      required_error: "Experience year is required",
      invalid_type_error: "Experience must be a number",
    })
    .min(1, "Must have at least 1 year of experience"),
});

export type AdminFormData = z.infer<typeof adminSchema>;
