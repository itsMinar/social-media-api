const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');

// configure the cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// upload resource from cloudinary
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });

    // remove the locally saved temporary file as the file has been uploaded successfully
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); //remove the locally saved temporary file as the upload operation got failed

    return null;
  }
};

// delete resource from cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    const response = await cloudinary.uploader.destroy(publicId);
    console.log('🚀 ~ deleteFromCloudinary ~ response:', response);

    return response;
  } catch (error) {
    return null;
  }
};

// get the cloudinary id of content from url
const getCloudinaryId = (contentUrl) => {
  if (!contentUrl) return '';

  return contentUrl
    .split('/')
    .pop()
    .replace(/\.[^.]+$/, '');
};

module.exports = { uploadOnCloudinary, deleteFromCloudinary, getCloudinaryId };
