import imageCompression from 'browser-image-compression';
import { supabase } from './supabase';

export const uploadImage = async (file, bucketName = 'service-images') => {
  try {
    // Compress image
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    const compressedFile = await imageCompression(file, options);
    
    // Upload to Supabase storage
    const fileExt = compressedFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${fileName}`;
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, compressedFile, {
        cacheControl: '3600',
        upsert: false,
      });
      
    if (error) throw error;
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
      
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
