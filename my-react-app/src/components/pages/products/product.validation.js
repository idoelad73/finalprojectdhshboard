import { z } from 'zod';
import productOptions from '../../../data/productOptions.json';

const { categories, brands } = productOptions;

/* ---------------- IMAGE VALIDATION ---------------- */
const imageFileSchema = z
  .instanceof(File, { message: 'Image is required' })
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: 'Image must be less than 5MB'
  })
  .refine(
    (file) =>
      ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(
        file.type
      ),
    { message: 'Only JPG, PNG, WEBP images are allowed' }
  )
  .optional();

/* ---------------- CREATE PRODUCT SCHEMA ---------------- */
export const createProductValidation = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title is too long'),

  description: z
    .string()
    .min(10, 'Description must be at least 10 characters'),

    category: z.enum(categories, {
        errorMap: () => ({ message: 'Invalid category selected' })
      }),
    
      brand: z.enum(brands, {
        errorMap: () => ({ message: 'Invalid brand selected' })
      }),

  price: z
    .number({ invalid_type_error: 'Price must be a number' })
    .positive('Price must be greater than 0'),

  discountPercentage: z
    .number()
    .min(0, 'Discount cannot be negative')
    .max(90, 'Discount too high'),

  rating: z
    .number()
    .min(0, 'Rating must be between 0 and 5')
    .max(5, 'Rating must be between 0 and 5'),

  stock: z
    .number()
    .int('Stock must be an integer')
    .min(0, 'Stock cannot be negative'),

  tags: z
    .string()
    .optional()
    .transform((val) =>
      val
        ? val.split(',').map((tag) => tag.trim()).filter(Boolean)
        : []
    ),

  // 👇 FILE field (frontend only)
  images: imageFileSchema
});
