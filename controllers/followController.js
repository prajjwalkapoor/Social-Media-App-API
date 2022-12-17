const User = require("../modals/User");

exports.followUser = async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return next(new Error("User not found"));
  }
  if (user.followers.includes(req.user._id)) {
    return next(new Error("You already follow this user"));
  }
  try {
    const updatedUser = await User.findById(req.user._id);
    updatedUser.following.push(user._id);
    await updatedUser.save();
    const reqUpdatedUser = await User.findById(user._id);
    reqUpdatedUser.followers.push(req.user._id);
    await reqUpdatedUser.save();
    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

exports.unfollowUser = async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return next(new Error("User not found"));
  }
  if (!user.followers.includes(req.user._id)) {
    return next(new Error("You don't follow this user"));
  }
  try {
    const updatedUser = await User.findById(req.user._id);
    updatedUser.following = updatedUser.following.filter(
      (following) => following.toString() !== user._id.toString()
    );
    await updatedUser.save();
    const reqUpdatedUser = await User.findById(user._id);
    reqUpdatedUser.followers = reqUpdatedUser.followers.filter(
      (follower) => follower.toString() !== req.user._id.toString()
    );
    await reqUpdatedUser.save();
    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
