import express from "express";

import {
   createComment,
   deleteComment,
   getComments,
   likeUnlikeComment,
} from "../controller/comment.controller.js";

const router = express.Router();

// post Routes

router.post("/comments/comment/:postId", createComment);

// delete routes
router.delete("/comments/:commentId", deleteComment);

// patch Routes
router.patch("/comments/like/:commentId", likeUnlikeComment);

// get Routes
router.get("/comments/:postId", getComments);

export default router;
