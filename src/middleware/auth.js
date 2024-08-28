import { config } from "../config/config.js";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
   try {
      const token = await req.header("Authorization");
      if (!token)
         return next(createHttpError(400, "authentication token is require"));
      const decodedToken = token.split(" ").at(-1);
      const verify = await jwt.verify(decodedToken, config.secretToken);
      req.userId = verify.sub;
      next();
   } catch (error) {
      next(
         createHttpError(500, "something went wrong while verify token" + error)
      );
   }
};
