const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

function connectDB() {
  // Database Connection

  mongoose.connect(process.env.MONGO_CONNECTION_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  });

  const connection = mongoose.connection;

  connection
    .once("open", () => {
      console.log("Database connected 🥳🥳🥳🥳");
    })
    .on("error", (err) => {
      console.log("Connection failed ☹️☹️☹️☹️" + err);
    });
}

module.exports = connectDB;
