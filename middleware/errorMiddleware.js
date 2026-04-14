const notFound = (req, res, next) => {
  res.status(404);
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  next(error);
};

const errorHandler = (err, req, res, _next) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Server error",
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

export { notFound, errorHandler };
