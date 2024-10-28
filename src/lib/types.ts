import type { z } from "zod";
import { noteSchema } from "./schema";

export type Note = z.infer<typeof noteSchema>;
export type OptionalNote = Note | null;

export type Params<T> = {
  params: T;
};
