const multer = require("multer");
const path = require("path");

// MULTER CONFIG
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/heic" ||
      file.mimetype == "image/heif" ||
      file.mimetype == "image/*"
    ) {
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${
        path.extname(file.originalname) == ""
          ? ".png"
          : path.extname(file.originalname)
      }`;
      cb(null, uniqueName);
    } else {
      cb("Only .png, .jpg and .jpeg , heic , heif format allowed!");
    }
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000 * 15, //15mb
  },
});

module.exports = upload;
