const express = require("express");
const router = express.Router();
const { protectedRoute } = require("../middlewares/protectedRoute");

const {
  getPosts,
  createPost,
  deletePost,
  likePost,
  commentPost,
  unlikePost,
  getPost,
} = require("../controllers/postController");

// router.route("/").get(getPosts).post(protect, createPost);
// router.route("/:id").get(protectedRoute, getPost);
router
  .route("/posts")
  .get(protectedRoute, getPosts)
  .post(protectedRoute, createPost);
router
  .route("/posts/:id")
  .delete(protectedRoute, deletePost)
  .get(protectedRoute, getPost);
router.route("/posts/like/:id").post(protectedRoute, likePost);
router.route("/posts/unlike/:id").post(protectedRoute, unlikePost);
router.route("/posts/comment/:id").post(protectedRoute, commentPost);

module.exports = router;
