const express = require("express");
const app = express();
const socketIO = require("./middleware/socketIO");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT;
const AuthRouter = require("./Routes/auth.routes.js");
const UserRouter = require("./Routes/user.routes.js");
const PostRouter = require("./Routes/post.routes.js");

const Atlas = process.env.Atlas;

const bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("tiny"));

//connect database
require("./database");

app.use(AuthRouter);

app.use(UserRouter);

app.use(PostRouter);

const server = app.listen(PORT, () => {
  console.log("Server is running in port:" + PORT);
});

socketIO(server);

module.exports = app;
