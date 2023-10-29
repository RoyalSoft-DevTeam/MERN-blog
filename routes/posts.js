const express = require("express");
const router = express.Router();
const verifyToken = require("../config/verifyToken");
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");

// GET all posts
router.get("/", postController.getAllPosts);

// GET one post
router.get("/:post_id", postController.getOnePost);

// POST post
router.post("/create", verifyToken, postController.createPost);

// POST publish post
router.post("/:post_id/publish", verifyToken, postController.publishPost);

// POST unpublish post
router.post("/:post_id/unpublish", verifyToken, postController.unpublishPost);

// PUT update post
router.put("/:post_id/update", verifyToken, postController.updatePost);

// DELETE post
router.delete("/:post_id/delete", verifyToken, postController.deletePost);

// GET all comments
router.get("/:post_id/comments", commentController.getAllPostComments);

// POST create comment
router.post("/:post_id/comments", commentController.createComment);

// PUT update comment
router.put(
  "/:post_id/comments/:comment_id/update",
  verifyToken,
  commentController.updateComment
);

// DELETE comment
router.delete(
  "/:post_id/comments/:comment_id/delete",
  verifyToken,
  commentController.deleteComment
);

module.exports = router;
