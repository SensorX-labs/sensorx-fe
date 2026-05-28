import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email khong hop le'),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
