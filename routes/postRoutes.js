import express from "express";
import {
  createPost,
  deletePost,
  getFeedPosts,
  getRandomUser,
  getUserPosts,
  likeUnlikePost,
  updatePost,
  updateDescription,
} from "../controller/post_CTRL.js";

const router = express.Router();

//

// post routes
router.post("/createPost", createPost);
router.post("/updatePost", updatePost);

// delete routes
router.delete("/deletePost/:postId", deletePost);

// get routes

router.get("/feedPosts", getFeedPosts);
router.get("/users/:userId", getRandomUser);
router.get("/posts/:userId", getUserPosts);

// patch Routes

router.patch("/likeUnlike", likeUnlikePost);
router.patch("/updateDescription", updateDescription);

export default router;
