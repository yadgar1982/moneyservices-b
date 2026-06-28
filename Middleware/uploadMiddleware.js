import multer from "multer";
import path from "path";
import fs from "fs";

// base upload folder
const baseUploadDir = path.resolve("uploads");

// ensure base uploads folder exists
if (!fs.existsSync(baseUploadDir)) {
  fs.mkdirSync(baseUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = path.join(baseUploadDir, "transactions");

    // profile images go here
    if (file.fieldname === "profile") {
      folder = path.join(baseUploadDir, "userUpload");
    }
    //  branding logos go here

    if (file.fieldname === "logo") {
      // ⭐ ADD THIS
      folder = path.join(baseUploadDir, "logoUpload");
    }

    // create folder if not exists
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },

  filename: (req, file, cb) => {
    let prefix = "file";

    if (file.fieldname === "profile") prefix = "profile";
    if (file.fieldname === "signature") prefix = "signature";
    if (file.fieldname === "image") prefix = "photo";
    if (file.fieldname === "document") prefix = "document";

    const fullname = req.body.fullname
      ? req.body.fullname.replace(/\s+/g, "_").toLowerCase()
      : "unknown";

    const timestamp = Date.now();
    const ext = path.extname(file.originalname);

    const filename = `${fullname}-${prefix}-${timestamp}${ext}`;

    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    // images
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/tiff",

    // scanned documents
    "application/pdf",
  ];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Only JPEG, PNG, and WEBP images are allowed"), false);
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
