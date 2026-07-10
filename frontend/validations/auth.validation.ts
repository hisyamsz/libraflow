import { z } from "zod";

export const loginSchemaForm = z.object({
  identifier: z.string().min(3, "NIS / Email wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

export type LoginForm = z.infer<typeof loginSchemaForm>;
