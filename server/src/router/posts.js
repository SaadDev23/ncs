import express from "express";
import { getFeedPosts, getUserPosts, likePost, createPost, updatePostLikes, addComment, editComment, deleteComment } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router(); // Use express.Router() here

/** Read */
// router.get("/", verifyToken, getFeedPosts);
router.get("/", getFeedPosts);
router.get("/:username/posts", verifyToken, getUserPosts);
router.post("/postcreate", createPost);
router.put("/update-likes", updatePostLikes);
router.post("/:id/comment", verifyToken, addComment);
router.patch("/:id/comment/:commentId", verifyToken, editComment);
router.delete("/:id/comment/:commentId", verifyToken, deleteComment);

/** Update */
router.patch("/:id/like", verifyToken, likePost);

export default router;
