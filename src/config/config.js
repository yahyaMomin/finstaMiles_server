import { config as cong } from "dotenv";

cong();
const config = {
   port: process.env.PORT,
   mongoUrl: process.env.MONGO_URL,
   secretToken: process.env.ACCESS_SECRET_TOKEN,
   nodeENV: process.env.NODE_ENV,
   apiSecret: process.env.API_SECRET,
   apiKey: process.env.API_KEY,
   cloudName: process.env.CLOUD_NAME,
};

export { config };
