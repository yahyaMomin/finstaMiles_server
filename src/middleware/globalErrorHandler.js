import { config } from "../config/config.js";

const globalErrorHandler = (err, req, res, next) => {
   return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      stack: config.nodeENV === "development" ? err.stack : "",
   });
};
export default globalErrorHandler;
