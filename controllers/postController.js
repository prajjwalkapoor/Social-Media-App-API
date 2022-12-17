const Post = require("../modals/Posts");
const { v4: uuidv4 } = require("uuid");
exports.createPost = async (req, res, next) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return next(new Error("Title and description both required"));
  }
  try {
    const post = await Post.create({
      title,
      description,
      user: req.user._id,
    });
    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};
exports.deletePost = async (req, res, next) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return next(new Error("Post not found"));
    }
    if (post.user.toString() !== req.user._id.toString()) {
      return next(new Error("You are not authorized to delete this post"));
    }
    await post.remove();
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

exports.likePost = async (req, res, next) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return next(new Error("Post not found"));
    }
    if (post.likes.includes(req.user._id)) {
      return next(new Error("You already liked this post"));
    }
    post.likes.push(req.user._id);
    await post.save();
    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};
exports.unlikePost = async (req, res, next) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return next(new Error("Post not found"));
    }
    if (!post.likes.includes(req.user._id)) {
      return next(new Error("You don't like this post"));
    }
    post.likes = post.likes.filter(
      (like) => like.toString() !== req.user._id.toString()
    );
    await post.save();
    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

exports.commentPost = async (req, res, next) => {
  const { id } = req.params;
  const { comment } = req.body;
  if (!comment) {
    return next(new Error("Comment is required"));
  }
  try {
    const post = await Post.findById(id);
    if (!post) {
      return next(new Error("Post not found"));
    }
    const newComment = {
      _id: uuidv4(),
      comment,
      user: req.user._id,
    };
    post.comments.push(newComment);
    await post.save();
    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

exports.getPost = async (req, res, next) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    res.status(200).json({
      success: true,
      data: {
        _id: post._id,
        title: post.title,
        description: post.description,
        likes: post.likes.length,
        comments: post.comments.length,
        createdAt: post.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
