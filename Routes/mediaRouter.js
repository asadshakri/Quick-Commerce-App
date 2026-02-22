const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");
const mediaController = require("../Controller/mediaController");

router.post(
  "/upload",
  auth.authenticate,
  upload.single("file"),
  mediaController.uploadMedia
);

module.exports = router;