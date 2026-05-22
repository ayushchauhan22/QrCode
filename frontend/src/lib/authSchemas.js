import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email').max(255),
  password: z.string().min(8, 'Password must be at least 8 characters').max(72),
})

export const signupSchema = z.object({
  fullName: z
    .string().trim().min(2, 'Name must be at least 2 characters').max(80)
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, ' and -"),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email').max(255),
  password: z
    .string().min(8, 'Password must be at least 8 characters').max(72)
    .regex(/[A-Z]/, 'Include at least one uppercase letter')
    .regex(/[a-z]/, 'Include at least one lowercase letter')
    .regex(/[0-9]/, 'Include at least one number'),
})