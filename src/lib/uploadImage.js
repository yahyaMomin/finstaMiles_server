import createHttpError from "http-errors";
import sharp from "sharp";
import path from "node:path";
import cludinary from "../config/cludinary.js";
import fs from "node:fs";

const uploadFile = async (file, folder) => {
   try {
      console.log(file);

      const inputFile = file.path;

      const outputFilePath = path.join(
         path.join(file.destination, `../uploads/${folder}`),
         `${file.originalname.split(".").at(0)}.webp`
      );

      await sharp(inputFile)
         .resize(800)
         .webp({ quality: 10, lossless: true, effort: 4 })
         .toFile(outputFilePath, (err, info) => {
            if (err) {
               console.error("Error processing image:", err);
            } else {
               console.log("success");
            }
         })
         .toBuffer();

      const upload = await cludinary.uploader.upload(outputFilePath, {
         folder,
         format: "webp",
      });
      console.log(upload);

      return upload.secure_url;
   } catch (error) {
      console.log(error);
   }
};
export default uploadFile;
