const User = require("../modals/User");
const bycrypt = require("bcryptjs");
const sendToken = require("../utils/sendToken");
exports.authenticateUser = async (req, res, next) => {
  const { email, password, name } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      // encrypt the password
      const salt = await bycrypt.genSalt(10);
      const hashedPassword = await bycrypt.hash(password, salt);

      const newUser = await User.create({
        email,
        password: hashedPassword,
        name,
      });
      sendToken(newUser, 201, res);
    } else {
      // check if the password is correct
      const isMatch = await bycrypt.compare(password, user.password);
      if (!isMatch) {
        return next(new Error("Invalid credentials"));
      }
      sendToken(user, 200, res);
    }
  } catch (error) {
    next(error);
  }
};

exports.getLoggedInUser = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      noOFFollowers: user.followers.length,
      noOFFollowing: user.following.length,
      joinedAt: user.createdAt,
    },
  });
};
