import express from "express";
import multer from "multer";
import path from "node:path";
import {
   createPost,
   deletePost,
   getFeedPosts,
   getRandomUser,
   getUserPosts,
   likeUnlikePost,
   updatePost,
} from "../controller/post.controller.js";
import { fileURLToPath } from "node:url";

const router = express.Router();

//
const __fileName = fileURLToPath(import.meta.url);
const __dirName = path.dirname(__fileName);

const upload = multer({
   dest: path.resolve(__dirName, "../../public/uploads"),
});

const getFiles = upload.single("post");

// post routes
router.post("/posts", getFiles, createPost);

// delete routes
router.delete("/posts/:postId", deletePost);

// get routes

router.get("/posts", getFeedPosts);
router.get("/users/:userId", getRandomUser);
router.get("/posts/:userId", getUserPosts);

// patch Routes

router.patch("/posts/like/:postId", likeUnlikePost);
router.patch("/posts/:postId", updatePost);

export default router;
