const multer = require("multer");
const path = require("path");
const ErrorResponse = require("../middlewares/ErrorResponse");
// Multer config
export default multer({
  storage: multer.diskStorage({}),
  // @ts-ignore
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new ErrorResponse("File type is not supported", 400), false);
      return;
    }
    cb(null, true);
  },
});
