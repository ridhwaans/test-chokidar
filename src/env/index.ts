import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DIR1_PATH: z.string().optional(),
    DIR2_PATH: z.string().optional(),
    DIR3_PATH: z.string().optional(),
  },
  });