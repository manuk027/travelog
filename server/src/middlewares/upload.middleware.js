const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'travel-places',
            resource_type: 'auto',
            allowed_formats: ['jpg', 'jpeg', 'png', 'mp4', 'mov', 'webp']
        };
    }
});

const upload = multer({ storage: storage });

exports.uploadPlaceMedia = upload.fields([
    { name: 'photos', maxCount: 10 },
    { name: 'videos', maxCount: 5 }
]);
