import express from "express";
import { followUnFollow, updateProfile, getUser, getSearchUsers } from "../controller/user_CTRL.js";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets/users");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.put("/updateProfile", upload.single("avatar"), updateProfile);
router.get("/getUser/:userId", getUser);
router.patch("/follow/:followingId", followUnFollow);
router.get("/search/:userName", getSearchUsers);

export default router;
