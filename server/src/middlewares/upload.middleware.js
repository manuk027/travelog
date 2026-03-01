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
    { name: 'photos', maxCount: 4 },   // max 4 photos per place
    { name: 'videos', maxCount: 1 }    // max 1 video per place
]);

// For external visitor photo contributions (1 image, images only)
const imageOnlyStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => ({
        folder: 'travel-places/contributions',
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
    })
});

const uploadImage = multer({
    storage: imageOnlyStorage,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB hard limit
});

exports.uploadSinglePhoto = uploadImage.single('photo');
