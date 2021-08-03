const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const File = require("../models/file");
const { v4: uuid4 } = require("uuid");
const dotenv = require("dotenv");
const sendMail = require("../services/emailService");
dotenv.config();

let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
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

router.post("/", (request, res) => {
  // Store file
  uplaod(request, res, async (err) => {
    //  Validate request
    if (!request.file) {
      return res.json({ error: "All fields are required." });
    }

    if (err) {
      return res.status(500).send({ error: err.message });
    }
    // Store to Database
    const file = new File({
      filename: request.file.filename,
      uuid: uuid4(),
      path: request.file.path,
      size: request.file.size,
    });

    const response = await file.save();
    return res.json({
      file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
    });
  });
});

router.post("/send", async (req, res) => {
  const { uuid, emailTo, emailFrom } = req.body;
  //validate Request
  if (!uuid || !emailTo || !emailFrom) {
    return res.status(422).send({ error: "All fields are required" });
  }

  // Get data from database

  const file = await File.findOne({ uuid: uuid });
  if (file.sender) {
    return res.status(422).send({ error: "Email already sent." });
  }

  file.sender = emailFrom;
  file.receiver = emailTo;

  const response = await file.save();

  //send email
  const sendMail = require("../services/emailService");
  sendMail({
    from: `File Shared <${emailFrom}>`,
    to: emailTo,
    subject: "File Sharing",
    text: `${emailFrom} shared a file with you`,
    html: require("../services/emailTemplate")({
      emailFrom: emailFrom,
      downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
      size: parseInt(file.size) + "KB",
      expires: "24 hrs",
    }),
  });

  return res.send({ success: true });
});

// Response --> link
module.exports = router;
