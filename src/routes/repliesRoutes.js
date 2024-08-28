import express from "express";
import {
   createReply,
   getReplies,
   deleteReply,
   likeReply,
} from "../controller/replies.controller.js";

const router = express.Router();

// post Routes
router.post("/replies", createReply);

// get Routes
router.get("/replies/:commentId", getReplies);

// delete routes
router.delete("/replies/:replyId", deleteReply);

// patch routes
router.patch("/replies/:replyId", likeReply);

export default router;
