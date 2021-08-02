const express = require("express");

const app = express();

const PORT = 8080 || process.env.PORT;

const connectDB = require("./config/db");
connectDB();

app.use("/api/files", require("./routes/files"));

app.listen(PORT, () => {
  console.log(`Listning on port ${PORT}`);
});
