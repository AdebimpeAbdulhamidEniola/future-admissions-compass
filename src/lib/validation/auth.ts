import { z } from "zod";

const NIGERIAN_PHONE =
  /^(?:\+?234(?:70|80|81|90|91|71)\d{8}|0(?:70|80|81|90|91|71)\d{8})$/;

export const loginSchema = z.object({
  email: z.string().min(1, "Enter your email address").email("That doesn't look like an email address"),
  password: z.string().min(6, "Your password is at least 6 characters"),
});

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(3, "Enter your full name")
    .refine((v) => v.trim().split(/\s+/).length >= 2, "Enter both your first and last name"),
  email: z.string().min(1, "Enter your email address").email("That doesn't look like an email address"),
  phone: z
    .string()
    .min(1, "Enter your phone number")
    .transform((v) => v.replace(/[\s-]/g, ""))
    .refine((v) => NIGERIAN_PHONE.test(v), "Use a Nigerian number, e.g. 08031234567"),
  password: z.string().min(6, "Use at least 6 characters"),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
