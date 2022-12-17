const express = require("express");
const router = express.Router();

const { protectedRoute } = require("../middlewares/protectedRoute");
const { followUser, unfollowUser } = require("../controllers/followController");

router.route("/follow/:id").post(protectedRoute, followUser);

router.route("/unfollow/:id").post(protectedRoute, unfollowUser);

module.exports = router;
