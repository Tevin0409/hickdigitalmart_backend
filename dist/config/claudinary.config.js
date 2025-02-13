"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImages = void 0;
const cloudinary_1 = require("cloudinary");
const _1 = require(".");
// Configuration
cloudinary_1.v2.config({
    cloud_name: _1.CLOUD_NAME,
    api_key: _1.CLOUD_API_KEY,
    api_secret: _1.CLOUD_SECRETE_KEY,
});
const uploadImages = async (imageUrls, publicIds) => {
    try {
        const uploadResults = [];
        for (let i = 0; i < imageUrls.length; i++) {
            const uploadResult = await cloudinary_1.v2.uploader.upload(imageUrls[i], {
                public_id: publicIds[i],
            });
            console.log("Upload Successful:", uploadResult);
            // Generate optimized URL
            const optimizeUrl = cloudinary_1.v2.url(publicIds[i], {
                fetch_format: "auto",
                quality: "auto",
            });
            console.log("Optimized URL:", optimizeUrl);
            // Generate auto-cropped URL
            const autoCropUrl = cloudinary_1.v2.url(publicIds[i], {
                crop: "auto",
                gravity: "auto",
                width: 500,
                height: 500,
            });
            console.log("Auto-Cropped URL:", autoCropUrl);
            uploadResults.push({
                uploadUrl: uploadResult.secure_url,
                optimizeUrl,
                autoCropUrl,
            });
        }
        return uploadResults;
    }
    catch (error) {
        console.error("Upload failed:", error);
        return [];
    }
};
exports.uploadImages = uploadImages;
