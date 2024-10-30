import { isValid, parseISO } from "date-fns";
import { z } from "zod";

export const noteSchema = z.object({
  id: z.number(),
  title: z.string().max(100),
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const stringToNote = z
  .string()
  .transform((str, ctx): z.infer<typeof noteSchema> => {
    try {
      const parsed = JSON.parse(str) as Record<string, unknown>;
      if (
        Object.prototype.hasOwnProperty.call(parsed, "createdAt") &&
        typeof parsed["createdAt"] === "string"
      ) {
        const parsedCreatedAt = parseISO(parsed["createdAt"]);
        if (!isValid(parsedCreatedAt)) {
          ctx.addIssue({
            code: z.ZodIssueCode.invalid_date,
            path: ["createdAt"],
            message: "Invalid date",
          });
          return z.NEVER;
        }

        parsed["createdAt"] = parsedCreatedAt;
      }

      if (
        Object.prototype.hasOwnProperty.call(parsed, "updatedAt") &&
        typeof parsed["updatedAt"] === "string"
      ) {
        const parsedUpdatedAt = parseISO(parsed["updatedAt"]);
        if (!isValid(parsedUpdatedAt)) {
          ctx.addIssue({
            code: z.ZodIssueCode.invalid_date,
            path: ["updatedAt"],
            message: "Invalid date",
          });
          return z.NEVER;
        }

        parsed["updatedAt"] = parsedUpdatedAt;
      }

      return noteSchema.parse(parsed);
    } catch (err) {
      console.error(err);
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid JSON string",
      });
      return z.NEVER;
    }
  });
