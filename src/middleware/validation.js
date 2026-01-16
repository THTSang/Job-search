import { z } from "zod";

// Validation schemas
export const schemas = {
  // Upload CV request (userId from form data)
  upload: z.object({
    userId: z
      .string({ required_error: "userId is required" })
      .min(1, "userId cannot be empty")
      .max(100, "userId cannot exceed 100 characters")
      .trim(),
  }),

  // Chat request
  chat: z.object({
    userId: z
      .string({ required_error: "userId is required" })
      .min(1, "userId cannot be empty")
      .max(100, "userId cannot exceed 100 characters")
      .trim(),
    sessionId: z
      .string({ required_error: "sessionId is required" })
      .uuid("sessionId must be a valid UUID"),
    message: z
      .string({ required_error: "message is required" })
      .min(1, "message cannot be empty")
      .max(5000, "message cannot exceed 5000 characters")
      .trim(),
  }),

  // Job evaluation request
  job: z.object({
    userId: z
      .string({ required_error: "userId is required" })
      .min(1, "userId cannot be empty")
      .max(100, "userId cannot exceed 100 characters")
      .trim(),
    sessionId: z
      .string({ required_error: "sessionId is required" })
      .uuid("sessionId must be a valid UUID"),
    jobDescription: z
      .string({ required_error: "jobDescription is required" })
      .min(10, "jobDescription must be at least 10 characters")
      .max(10000, "jobDescription cannot exceed 10000 characters")
      .trim(),
  }),

  // Clear session request (userId in body)
  clearSession: z.object({
    userId: z
      .string({ required_error: "userId is required" })
      .min(1, "userId cannot be empty")
      .max(100, "userId cannot exceed 100 characters")
      .trim(),
  }),

  // Query params for GET/DELETE requests
  queryUserId: z.object({
    userId: z
      .string({ required_error: "userId query parameter is required" })
      .min(1, "userId cannot be empty")
      .max(100, "userId cannot exceed 100 characters")
      .trim(),
  }),

  // Session ID param
  sessionIdParam: z.object({
    sessionId: z
      .string({ required_error: "sessionId is required" })
      .uuid("sessionId must be a valid UUID"),
  }),
};

/**
 * Format Zod errors into a readable message
 */
function formatZodError(error) {
  const messages = error.errors.map((err) => {
    const field = err.path.join(".");
    return field ? `${field}: ${err.message}` : err.message;
  });
  return messages.join(", ");
}

/**
 * Validation middleware factory
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @param {string} source - 'body', 'query', or 'params'
 */
export function validate(schema, source = "body") {
  return (req, res, next) => {
    const data = source === "body" ? req.body : source === "query" ? req.query : req.params;
    
    const result = schema.safeParse(data);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: formatZodError(result.error),
        code: "VALIDATION_ERROR",
      });
    }

    // Replace data with parsed/transformed values
    if (source === "body") {
      req.body = result.data;
    } else if (source === "query") {
      req.query = result.data;
    } else {
      req.params = result.data;
    }

    next();
  };
}

export default { schemas, validate };
