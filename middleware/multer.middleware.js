import multer from 'multer';

//first import multer
//Set destination to store the file

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    //why originalFile name?? we can add our own name
      cb(null, file.originalname)
    }
  })

  export const upload=multer({
    storage,
  })