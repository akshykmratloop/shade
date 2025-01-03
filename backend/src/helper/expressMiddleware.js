export const errorHandler = (err, req, res, next) => {
    logger.error(err.stack); // Logs error stack to Winston
    res.status(500).json({ error: err.message || "Internal Server Error" });
  };
  

export const notFoundHandler = (req, res, next) => {
    res.status(404).json({ message: "Route not found" });
  };
  
