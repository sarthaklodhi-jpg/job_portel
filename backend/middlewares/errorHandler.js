export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (err.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: err.message || "Invalid file upload",
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: Object.values(err.errors)[0]?.message || "Validation failed",
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Duplicate value not allowed",
    });
  }

  console.error("Unhandled error:", err);
  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
  });
};
