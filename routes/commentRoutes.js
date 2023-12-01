import express from "express";

import { createComment, deleteComment, getComments, likeUnlikeComment } from "../controller/comment_CTRL.js";

const router = express.Router();

// post Routes

router.post("/createComment", createComment);

// delete routes
router.delete("/deleteComment/:commentId", deleteComment);

// patch Routes
router.patch("/likeComment", likeUnlikeComment);

// get Routes
router.get("/comments/:postId", getComments);

export default router;
