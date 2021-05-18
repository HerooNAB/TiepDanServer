const Post = require("../models/Post.model");
const socket = require("socket.io");
const RequireLogin = require("../middleware/requireLogin");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const socketIO = (server) => {
  const io = socket(server);
  io.on("connection", (socket) => {
    console.log(`${socket.id} connected`);

    socket.on("disconnect", () => {
      console.log(`${socket.id} disconnected`);
    });

    socket.on("refresh", async () => {
      console.log("alo alo refresh"),
        socket.broadcast.emit("refresh-done"),
        socket.emit("refresh-done");
    });

    socket.on("delete-post", async (postId) => {
      console.log(postId);
      Post.findOne({ _id: postId })
        .populate("postedBy", "_id")
        .exec((err, post) => {
          if (err || !post) {
            return res.status(422).json({ error: err });
          }
          post
            .remove()
            .then(
              // res.json("Xóa bài thành công!"),
              //send message to everyone except sender
              socket.broadcast.emit("delete-post-done"),
              //just send message to sender!
              socket.emit("delete-post-done")
            )
            .catch((err) => {
              console.log(err);
            });
        });
    });

    socket.on("create-post", async (newpost) => {
      const token = await jwt.verify(newpost.token, process.env.JWT_KEY);

      const { name, phone, address, content } = newpost;
      if (!name || !phone || !address || !content) {
        return res.status(422).json({ error: "Hãy điền đầy đủ thông tin" });
      }
      const post = new Post({
        name,
        phone,
        address,
        content,
        postedBy: token._id,
      });
      post
        .save()
        .then((result) => {
          //send message to everyone except sender
          socket.broadcast.emit("new-post-done", post);
          //just send message to sender!
          socket.emit("new-post-done", post);
        })
        .catch((err) => {
          console.log(err);
        });
    });

    socket.on("reply-post", async (replyPost) => {
      const { id, reply, isChecked } = replyPost;
      // if (!id || !reply || !isChecked) {
      //   return res.status(422).json({ error: "Hãy điền đầy đủ thông tin" });
      // }
      console.log(id + reply + isChecked);

      await Post.findOneAndUpdate(
        { _id: id },
        {
          isChecked: isChecked,
          reply: reply,
        },
        { new: true }
      )
        .then((result) => {
          //send message to everyone except sender
          socket.broadcast.emit("reply-post-done");
          //just send message to sender!
          socket.emit("reply-post-done");
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
};

module.exports = socketIO;
