import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Configure Cloudinary if credentials are available
const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && 
                               process.env.CLOUDINARY_API_KEY && 
                               process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });
    console.log("Cloudinary configured successfully");
} else {
    console.log("Cloudinary not configured - using local storage");
}

const uploadOnCloudinary = async (localFilePath) => {
    try {
        console.log("Processing file upload:", localFilePath);
        if (!localFilePath) return null;

        // If Cloudinary is configured, upload to Cloudinary
        if (isCloudinaryConfigured) {
            const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type: "auto",
                folder: "expensify-avatars"
            });

            console.log("Cloudinary upload successful:", response.secure_url);
            
            // Remove local file after successful upload
            if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
            }
            
            return response.secure_url;
        } else {
            // Fallback: return the local file path as URL
            // Move file to a permanent location
            const fileName = path.basename(localFilePath);
            const permanentPath = path.join(process.cwd(), 'public', 'uploads', fileName);
            
            // Ensure uploads directory exists
            const uploadsDir = path.dirname(permanentPath);
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
            }
            
            // Move file to permanent location
            fs.renameSync(localFilePath, permanentPath);
            
            // Return relative URL
            const relativeUrl = `/uploads/${fileName}`;
            console.log("Local upload successful:", relativeUrl);
            return relativeUrl;
        }
    } catch (error) {
        console.error("Upload error:", error);
        
        // Remove local file if it exists
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        
        throw error;
    }
};

export {uploadOnCloudinary};