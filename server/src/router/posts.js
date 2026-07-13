import express from "express";
import { getFeedPosts, getUserPosts, likePost, createPost, updatePostLikes, addComment } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router(); // Use express.Router() here

/** Read */
// router.get("/", verifyToken, getFeedPosts);
router.get("/", getFeedPosts);
router.get("/:username/posts", verifyToken, getUserPosts);
router.post("/postcreate", createPost);
router.put("/update-likes", updatePostLikes);
router.post("/:id/comment", addComment);

/** Update */
router.patch("/:id/like", verifyToken, likePost);

export default router;
