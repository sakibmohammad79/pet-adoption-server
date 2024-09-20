import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
// Configuration
cloudinary.config({
  cloud_name: "dm126uxmv",
  api_key: "837489542416858",
  api_secret: "CjRNK1KL2gRpBpFVInwjlGZSAmk", // Click 'View API Keys' above to copy your API secret
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const imageUploadToCloudinary = async (file: any) => {
  const uploadResult = await cloudinary.uploader
    .upload(file.path, {
      image_id: file.originalname,
    })
    .catch((error: any) => {
      console.log(error);
    });

  return uploadResult;
};

export const imageUploader = {
  upload,
  imageUploadToCloudinary,
};
