const express = require("express");
const router = express.Router();

const { authenticateUser, getLoggedInUser } = require("../controllers/Auth");
const { protectedRoute } = require("../middlewares/protectedRoute");

router.route("/authenticate").post(authenticateUser);
router.route("/user").get(protectedRoute, getLoggedInUser);

module.exports = router;
