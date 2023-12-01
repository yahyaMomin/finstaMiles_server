import express from "express";
import { createReply, getReplies, deleteReply, likeReply } from "../controller/replies_CTRL.js";

const router = express.Router();

// post Routes
router.post("/createReply", createReply);

// get Routes
router.get("/getReplies/:commentId", getReplies);

// delete routes
router.delete("/deleteReply/:replyId", deleteReply);

// patch routes
router.patch("/likeReply", likeReply);

export default router;
