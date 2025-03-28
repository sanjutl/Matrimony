const multer = require("multer");
const path = require("path");

const complaintStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/complaints/"); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); 
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, JPG, and PNG images are allowed"), false);
  }
};

const uploadComplaintImages = multer({
  storage: complaintStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, 
}).array("complaintImages", 5); 

module.exports = uploadComplaintImages;
