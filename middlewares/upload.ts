const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// TypeScript interfaces
interface CloudinaryParams {
    folder: string;
    format: string;
    public_id: string;
}

interface MulterFile {
    originalname: string;
    mimetype: string;
}

// Ruxsat etilgan formatlar
const allowedFormats: string[] = ["png", "jpg", "jpeg", "gif", "webp", "svg", "avif","mp3","mkv"];

// Cloudinary bilan Multer sozlamasi
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req: any, file: MulterFile): Promise<CloudinaryParams> => {
        const fileFormat = file.mimetype.split("/")[1];
        if (!allowedFormats.includes(fileFormat)) {
            throw new Error("Noto'g'ri format!");
        }
        return {
            folder: "uploads",
            format: fileFormat,
            public_id: file.originalname.split(".")[0],
        };
    },
});

const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req: any, file: MulterFile, cb: any) => {
        const fileFormat = file.mimetype.split("/")[1];
        if (!allowedFormats.includes(fileFormat)) {
            cb(new Error("Noto'g'ri format!"), false);
            return;
        }
        cb(null, true);
    }
});

module.exports = upload;