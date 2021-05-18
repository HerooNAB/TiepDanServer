const mongoose = require("mongoose");
require("dotenv").config();

const address = process.env.DB;
const atlas = process.env.Atlas;

mongoose.connect(
  atlas,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  },
  () => console.log("Database connected " + atlas)
);
