/**
 * Simple request logging middleware
 */
export function requestLogger(req, res, next) {
  const start = Date.now();
  
  // Log request
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] --> ${req.method} ${req.originalUrl}`);

  // Capture response finish
  res.on("finish", () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? "\x1b[31m" : "\x1b[32m"; // red or green
    const reset = "\x1b[0m";
    console.log(`[${timestamp}] <-- ${req.method} ${req.originalUrl} ${statusColor}${res.statusCode}${reset} ${duration}ms`);
  });

  next();
}

export default requestLogger;
