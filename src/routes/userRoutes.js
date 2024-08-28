import express from "express";
import multer from "multer";
import {
   followUnFollow,
   updateProfile,
   getUser,
   getSearchUsers,
} from "../controller/user.controller.js";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __fileName = fileURLToPath(import.meta.url);
const __dirName = path.dirname(__fileName);

const upload = multer({
   dest: path.resolve(__dirName, "../../public/uploads/users"),
});

const getFiles = upload.single("image");

const router = express.Router();

router.get("/search/:userName", getSearchUsers);
router.get("/users/:userId", getUser);
router.put("/user/profile", getFiles, updateProfile);
router.patch("/follow/:receiptId", followUnFollow);

export default router;
