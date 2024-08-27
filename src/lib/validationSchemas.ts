import { z } from 'zod';
import { atLeastOneLowerCaseOneUpperCaseOneDigitRegex } from '@/lib/utils';

export const passwordSchema = z
  .string()
  .min(8, { message: 'Must be 8 or more characters long' })
  .max(16, { message: 'Must be 16 or fewer characters long' })
  .refine(
    (value) => atLeastOneLowerCaseOneUpperCaseOneDigitRegex.test(value),
    'At least one lowercase letter, one uppercase letter, one non alphanumeric character and one digit are required'
  );
