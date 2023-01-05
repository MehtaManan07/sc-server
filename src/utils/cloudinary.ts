let cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dkbt7m9qk",
  api_key: "451857785443995",
  api_secret: "cNlSEKlc4CA5OkNg9Ow3_KUDK3I",
});
export const getUrl = async (filename: any) => {
  try {
    const { secure_url, public_id } = await cloudinary.uploader.upload(filename);
    return { uri: secure_url, cloudinary_id: public_id };
  } catch (error) {
    console.log({ error });
    return;
  }
};
export const deleteImage = async (id: any) => {
  await cloudinary.uploader.destroy(id);
}

