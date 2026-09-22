import { z } from 'zod';

export const CreateGigSchema = z.object({
  title: z
    .string()
    .min(10, 'Title must be at least 10 characters long')
    .max(100, 'Title is too long'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters long'),
  category: z.string().min(1, 'Please select a category'),
  price: z.coerce.number().min(5, 'Minimum price is $5'),
  deliveryTimeDays: z.coerce.number().min(1, 'Delivery time must be at least 1 day'),
  coverImage: z.string().optional(),
});

export type CreateGigInput = z.infer<typeof CreateGigSchema>;