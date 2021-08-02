const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const File = require("../models/file");
const { v4: uuid4 } = require("uuid");

let storage = multer.diskStorage({
  destination: (request, file, cb) => cb(null, "uploads/"),
  filename: (request, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

let uplaod = multer({
  storage: storage,
  limit: { fileSize: 1000000 * 100 },
}).single("myfile");

router.post("/", (request, response) => {
  if (!request.file) {
    return res.json({ error: "All fields are required." });
  }
});
//  Validate request

// Store file
uplaod(request, res, async (err) => {
  if (err) {
    return res.status(500).send({ error: err.message });
  }
  // Store to Database
  const file = new File({
    filename: request.file.filename,
    uuid: uuid4,
    path: request.file.path,
    size: request.file.size,
  });

  const response = await file.save();
  return res.json({
    file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
  });
});

// Response --> link
module.exports = router;
