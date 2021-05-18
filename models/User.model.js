const mongoose = require("mongoose"); //kết nối DBDB
const validator = require("validator"); //Thư viện kiểm tra ràng buộc
const { ObjectId } = mongoose.Schema.Types; // lấy ID của một đối tượng trong bảng gán cho ObjectId
const UserSchema = new mongoose.Schema({
  //định nghĩa table temp chưa lưu vào DB (gom dữ liệu thành 1 bảng)
  name: {
    type: String,
    required: true, // == Not Null (1 chiều từ User --> DB)
  },
  phone: {
    type: String,
    required: true,
    unique: true, // == kiểm tra không trùng = true, trùng = false
    /*kiểm tra đúng kiểu SDT*/
    validate: {
      validator: function (number) {
        return /(03|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(number);
      },
      message: (Error) => "Không phải số điện thoại !",
    },
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String, // khởi tạo biến Token
  expiresToken: String, // Thời gian sống của Tolken
  avatar: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  /*định nghĩa token*/
  /*[] - định nghĩa kiểu mảng (trong 1 user có nhiều token)*/
  tokens: [{ token: { type: String, required: true } }],
  followers: [{ follower: { type: ObjectId, ref: "User" } }], // định nghĩa kiểu mảng như biến token. (ref: ràng buộc dữ liệu là kiểu User)
  followings: [{ following: { type: ObjectId, ref: "User" } }],
});

const User = mongoose.model("User", UserSchema); //đặt tên cho bản tạm thời

module.exports = User; // cho phép các file khác có thể sử dụng file này (public file này lên)
