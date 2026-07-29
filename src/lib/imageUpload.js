import imageCompression from "browser-image-compression";
import { supabase } from "./supabase";

/**
 * Upload a service image (always images, compressed before upload).
 */
export const uploadImage = async (file, bucketName = "service-images") => {
  try {
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    const compressedFile = await imageCompression(file, options);

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

    const { error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, compressedFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucketName).getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

/**
 * Upload an order file (image or any document) to the order-files bucket.
 * Images are compressed first. Returns the public URL string.
 */
export const uploadOrderFile = async (file) => {
  try {
    let fileToUpload = file;

    // Compress images before upload
    if (file.type.startsWith("image/")) {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      fileToUpload = await imageCompression(file, options);
    }

    // Preserve original extension from the original file object
    const originalName = file.name || "upload";
    const ext = originalName.includes(".")
      ? originalName.split(".").pop()
      : "bin";
    const safeName = originalName
      .replace(/[^a-z0-9.\-_]/gi, "_")
      .substring(0, 60);
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${safeName}`;

    const { error } = await supabase.storage
      .from("order-files")
      .upload(fileName, fileToUpload, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || "application/octet-stream",
      });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("order-files").getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error("Error uploading order file:", error);
    throw error;
  }
};
