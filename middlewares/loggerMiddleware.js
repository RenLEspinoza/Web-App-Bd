const { registrarAcceso } = require("../utils/logger");

const loggerMiddleware = (req, res, next) => {
  // Registra la petición HTTP entrante automáticamente
  registrarAcceso(req.method, "HTTP_ACCESS", req.originalUrl);
  next();
};

module.exports = loggerMiddleware;
