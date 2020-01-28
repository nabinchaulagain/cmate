const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const pdfFilter = (req, file, cb) => {
  //allow only pdfs less than 5MB
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    //set fileUploadError for access for validation later
    req.fileUploadError = "Question Paper must be a pdf file";
    cb(null, false);
  }
};
const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    //set fileUploadError for access for validation later
    req.fileUploadError = "Uploaded file must be a image file";
    cb(null, false);
  }
};
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "resources/images/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      crypto.randomBytes(12).toString("hex") + path.extname(file.originalname)
    );
  }
});

const upload = multer({
  fileFilter: pdfFilter,
  storage: multer.memoryStorage()
});
const imageUpload = multer({
  fileFilter: imageFileFilter,
  storage: diskStorage
});
module.exports = { upload, imageUpload };
