import express from "express";
import { followUnFollow, updateProfile, getUser, getSearchUsers } from "../controller/user_CTRL.js";

const router = express.Router();

router.put("/updateProfile", updateProfile);
router.get("/getUser/:userId", getUser);
router.patch("/follow/:followingId", followUnFollow);
router.get("/search/:userName", getSearchUsers);

export default router;
