import express from "express";
import multer from "multer";
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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets/posts");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// post routes
router.post("/createPost", upload.single("image"), createPost);
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
