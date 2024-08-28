import cloudinary from "cloudinary";
import { config } from "./config.js";

cloudinary.config({
   cloud_name: config.cloudName,
   api_key: config.apiKey,
   api_secret: config.apiSecret,
});
export default cloudinary.v2;
