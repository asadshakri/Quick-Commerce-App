const s3 = require("../utils/s3");
const { v4: uuidv4 } = require("uuid");
const messages = require("../models/message");

const uploadMedia = async (req, res) => {
  try {
    const file = req.file;
    const { roomName } = req.body;

    if (!file || !roomName) {
      return res.status(400).json({ message: "File or room missing" });
    }

    const key = `Dchat/${uuidv4()}-${file.originalname}`;

    const upload = await s3.upload({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read"
    }).promise();

    const message = new messages({
        message: upload.Location,
        roomName: roomName,
        user: {
            userId:req.user._id,
            name:req.user.name
        },
        type: "media",
        mediaType: file.mimetype
    }); 
    await message.save();

    req.io.to(roomName).emit("new-message", {
      message: upload.Location,
      mediaType: file.mimetype,
      name: req.user.name,
      email: req.user.email,
      UserId: req.user._id,
    });

    res.status(201).json({ success: true });

  } catch (err) {
    console.error("Media upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};

module.exports = { uploadMedia };