const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 8080;

const connectDB = require("./config/db");
connectDB();
const corsOption = {
  origin: process.env.ALLOWED_CLIENTS.split(","),
};

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use(express.static("public"));
app.use(express.json());

//Template engine
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.use("/api/files", require("./routes/files"));
app.use("/files", require("./routes/show"));
app.use("/files/download", require("./routes/download"));

app.listen(PORT, () => {
  console.log(`Listning on port ${PORT}`);
});
