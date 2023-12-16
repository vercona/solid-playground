import { initTRPC } from "@trpc/server";
import { ZodError } from "zod";

export const t = initTRPC.create({
  errorFormatter({ shape, error }) {
    const isInputValidationError =
      error.code === "BAD_REQUEST" && error.cause instanceof ZodError;
    return {
      ...shape,
      data: {
        ...shape.data,
        inputValidationError: isInputValidationError
          ? error.cause.flatten()
          : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
