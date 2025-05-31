import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'coverPicturs/'); // specify the directory where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // specify the file name
  },
});

const coverPictures = multer({ storage: storage });

export default coverPictures;
