import { z } from "zod";

export const workerRegisterSchema = z.object({
  fullname: z
    .string()
    .min(1, "Full name is required"),

  username: z
    .string()
    .min(1, "Username is required")
    .min(4, "Username must be at least 4 characters")
    .regex(/^[a-zA-Z_]+$/, "Username can only contain letters and underscore"),

   email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, "Email must be a valid Gmail address (@gmail.com)"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
     .regex(/[@#$&]/, "One special character (@, #, $, or &)"),
    //.regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, "Password must contain at least one special character (!@#$%^&* etc.)"),
  
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d+$/, "Phone number must contain only digits")
    .regex(/^\d{10,15}$/, "Phone number must be between 10 and 15 digits"),
    //.regex(/^01\d{9,13}$/, "Phone number must start with 01 and be 11 to 15 digits total"),
    // .regex(/^01\d{7,11}11$/, "Phone number must start with 01 and end with 11"),

    workertype: z
    .string()
    .min(1, "Worker type is required"),

    gender: z
    .string()
    .min(1, "Gender is required")
    .regex(/^(male|female|other)$/i, "Gender must be Male, Female, or Other"),
});

export type WorkerRegisterForm = z.infer<typeof workerRegisterSchema>;