const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const uploadImage = async (filePath, options = {}) => {
    try {
        const defaultOptions = {
            folder: 'kuntakode/blogs',
            use_filename: true,
            unique_filename: true,
            resource_type: 'auto',
            quality: 'auto:good',
            fetch_format: 'auto'
        };

        const uploadOptions = { ...defaultOptions, ...options };
        const result = await cloudinary.uploader.upload(filePath, uploadOptions);
        
        return {
            success: true,
            url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes
        };
    } catch (error) {
        console.error('Cloudinary upload failed:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
};

const deleteImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return {
            success: result.result === 'ok',
            result: result.result
        };
    } catch (error) {
        console.error('Cloudinary delete failed:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
};

const getOptimizedUrl = (publicId, options = {}) => {
    const defaultOptions = {
        quality: 'auto:good',
        fetch_format: 'auto',
        width: 'auto',
        dpr: 'auto'
    };

    const urlOptions = { ...defaultOptions, ...options };
    return cloudinary.url(publicId, urlOptions);
};

module.exports = {
    cloudinary,
    uploadImage,
    deleteImage,
    getOptimizedUrl
};
