import { cloudinary } from "./cloudinary.js";

// Upload file buffer to Cloudinary
export const handleCloudinaryUpload = (buffer, folderName) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folderName,
        resource_type: "auto", // auto handles image, video, pdf, etc.
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return reject(new Error("File could not be uploaded."));
        }
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

// Delete file from Cloudinary
export const handleCloudinaryDelete = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image", // change to "video" if handling videos
    });
    return result;
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
    throw new Error("File could not be deleted.");
  }
};
