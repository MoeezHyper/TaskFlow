export const errorHandler = (err, req, res, next) => {
  console.error(`[Server Error]: ${err.stack || err.message}`);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    error: err.message || 'An unexpected server error occurred',
    ...(process.env.NODE_ENV === 'production' ? {} : { stack: err.stack }),
  });
};

