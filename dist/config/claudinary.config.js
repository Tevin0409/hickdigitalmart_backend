import { v2 as cloudinary } from "cloudinary";
import { CLOUD_NAME, CLOUD_API_KEY, CLOUD_SECRETE_KEY } from ".";
// Configuration
cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: CLOUD_API_KEY,
    api_secret: CLOUD_SECRETE_KEY,
});
export const uploadImages = async (imageUrls, publicIds) => {
    try {
        const uploadResults = [];
        for (let i = 0; i < imageUrls.length; i++) {
            const uploadResult = await cloudinary.uploader.upload(imageUrls[i], {
                public_id: publicIds[i],
            });
            console.log("Upload Successful:", uploadResult);
            // Generate optimized URL
            const optimizeUrl = cloudinary.url(publicIds[i], {
                fetch_format: "auto",
                quality: "auto",
            });
            console.log("Optimized URL:", optimizeUrl);
            // Generate auto-cropped URL
            const autoCropUrl = cloudinary.url(publicIds[i], {
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
