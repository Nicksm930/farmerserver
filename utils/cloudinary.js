import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';// File System
const CLOUD_NAME="dvfmphizq"
const CLOUD_API_KEY="738533975168823"
const CLOUD_API_SECRET="Z3AEeGOcxGThuEO33Di1tPQr2mk"

//Imp: unlink in filesystem
//cloudinary configuration
cloudinary.config({ 
    cloud_name: CLOUD_NAME, 
    api_key: CLOUD_API_KEY, 
    api_secret: CLOUD_API_SECRET // Click 'View Credentials' below to copy your API secret
});

//function to upload file which will take file path as argument..once successfully uploaded on cloud wwe will unlink it from server

const uploadOnCloudinary=async (localFilePath)=>{
    try {
        if(!localFilePath) return null

       const response=await cloudinary.uploader.upload(localFilePath,{
            resource_type:'auto'
        })
        //File uploaded successfully
        // console.log("Successfully upload the file on cloudinary",response,response.url);
        fs.unlinkSync(localFilePath)
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath) //remove the locally saved temp file as the upload operation got failed
        console.log("File Upload Failed to Cloudinary",error);
        return null
    }
}

export {uploadOnCloudinary}
