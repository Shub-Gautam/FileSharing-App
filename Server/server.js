const express = require("express");
const path = require("path");

const app = express();

const PORT = 8080 || process.env.PORT;

const connectDB = require("./config/db");
connectDB();

app.use(express.static("public"));

//Template engine
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.use("/api/files", require("./routes/files"));
app.use("/files/download", require("./routes/download"));

app.use("/files", require("./routes/show"));

app.listen(PORT, () => {
  console.log(`Listning on port ${PORT}`);
});
