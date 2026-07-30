export const errorHandler = (err, req, res, next) => {
  const isProduction = process.env.NODE_ENV === 'production';
  console.error(`[Server Error]: ${err.stack || err.message}`);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    error: isProduction && statusCode === 500 ? 'An unexpected server error occurred' : err.message || 'Internal Server Error',
    ...(isProduction ? {} : { stack: err.stack }),
  });
};

