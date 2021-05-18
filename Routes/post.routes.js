const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const RequireLogin = require("../middleware/requireLogin");
const Post = require("../models/Post.model");
require("dotenv").config();
var { cloudinary } = require("../utils/cloudinary.js");
var multer = require("multer");
var fs = require("fs");

const storage = multer.diskStorage({});

router.post("/createpost", RequireLogin, (req, res) => {
  const { name, phone, address, content } = req.body;
  if (!name || !phone || !address || !content) {
    return res.status(422).json({ error: "Hãy điền đầy đủ thông tin" });
  }
  const post = new Post({
    name,
    phone,
    address,
    content,
    postedBy: req.user,
  });
  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/allpost", RequireLogin, (req, res) => {
  Post.find()
    .populate("postedBy", "_id ")
    .sort("-createdAt")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/mypost", RequireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("PostedBy", "_id name")
    .then((mypost) => {
      res.json({ mypost });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/checkpost/:postId", RequireLogin, async (req, res) => {
  try {
    const newPost = await Post.findOneAndUpdate(
      { _id: req.params.postId },
      {
        isChecked: req.body.isChecked,
        reply: req.body.reply,
      }
    );
    // console.log(newPost);
    return res.status(200).send({ message: "Update successfully" });
  } catch (err) {
    if (err) {
      return res.status(500).send({ message: err.message });
    }
  }
});

router.get("/getPostById/:postId", RequireLogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .then((getPostById) => {
      res.json({ getPostById });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.delete("/deletepost/:postId", RequireLogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err });
      }
      post
        .remove()
        .then(res.json("Xóa bài thành công!"))
        .catch((err) => {
          console.log(err);
        });
    });
});

module.exports = router;
