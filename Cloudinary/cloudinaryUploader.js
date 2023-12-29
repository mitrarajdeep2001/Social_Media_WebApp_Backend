const cloudinary = require("cloudinary");
const DatauriParser = require("datauri/parser");
const path = require("path")

//Cloudinary file uploader function
const uploader = async (file) => {
  const dUri = new DatauriParser(); //Datauri parser instance
  const dataUri = dUri.format(path.extname(file.originalname).toString(), file.buffer); //Formatting buffer data to datauri
  const processedFile = dataUri.content
  const result = await cloudinary.v2.uploader.upload(processedFile);
  console.log('Your image has been uploded successfully to cloudinary');
  return result.url;
};
 
module.exports = uploader;
