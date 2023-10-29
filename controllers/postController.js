const Post = require("../models/post");
const { body, validationResult } = require("express-validator");

exports.createPost = [
  body("title", "Empty name").trim().escape(),
  body("body", "Empty body").trim().escape(),

  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }

    const { title, body, author, date, published, imageUrl } = req.body;
    const post = new Post({
      title,
      body,
      author,
      date,
      published,
      imageUrl,
    });
    post.save((err) => {
      if (err) {
        return next(err);
      }
      res.status(200).json({ msg: "post sent" });
    });
  },
];

exports.getOnePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post) {
      return res.status(404).json({
        errors: [{ message: `Post ${req.params.post_id} was not found` }],
      });
    }

    res.json(post);
  } catch (err) {
    return next(err);
    res.status(500).send("Server error");
  }
};

exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .sort([["date", "ascending"]])
      .populate("author");

    if (!posts) {
      return res.status(404).json({ errors: [{ message: `Posts not found` }] });
    }

    res.json(posts);
  } catch (err) {
    return next(err);
    res.status(500).send("Server error");
  }
};

exports.publishPost = (req, res, next) => {
  Post.findOneAndUpdate(
    { _id: req.params.post_id },
    { published: true, date: new Date() },
    { useFindAndModify: false, new: true }
  )
    .populate("author")
    .exec((err, post) => {
      if (err) return res.status(400).json(err);
      res.json(post);
    });
};

exports.unpublishPost = (req, res, next) => {
  Post.findOneAndUpdate(
    { _id: req.params.post_id },
    { published: false },
    { useFindAndModify: false, new: true }
  )
    .populate("author")
    .exec((err, post) => {
      if (err) return res.status(400).json(err);
      res.json(post);
    });
};

exports.updatePost = async (req, res, next) => {
  try {
    const { title, body, author, date, published, imageUrl } = req.body;
    const post = await Post.findByIdAndUpdate(req.params.post_id, {
      title,
      body,
      author,
      date,
      published,
      imageUrl,
    });

    if (!post) {
      return res.status(404).json({ errors: [{ message: "Post not found" }] });
    }

    res.json({ message: `Updated post ${req.params.post_id} successfully!` });
  } catch (err) {
    return next(err);
    res.status(500).send("Server error");
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.post_id);

    if (!post) {
      return res.status(404).json({ errors: [{ message: "Post not found" }] });
    }

    res.json({
      message: `Post ${req.params.post_id} was successfully deleted.`,
    });
  } catch (err) {
    return next(err);
    res.status(500).send("Server error");
  }
};
