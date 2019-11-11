const multer = require("multer");
const fileFilter = (req, file, cb) => {
  //allow only pdfs less than 5MB
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    //set fileUploadError for access for validation later
    req.fileUploadError = "Question Paper must be a pdf file";
    cb(null, false);
  }
};
const upload = multer({ fileFilter, storage: multer.memoryStorage() });
module.exports = upload;
