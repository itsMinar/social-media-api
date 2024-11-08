const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, './public/images');
  },

  // Store file in a .png/.jpeg/.jpg format instead of binary
  filename: function (_req, file, cb) {
    let fileExtension = '';
    if (file.originalname.split('.').length > 1) {
      fileExtension = file.originalname.substring(
        file.originalname.lastIndexOf('.')
      );
    }

    const filenameWithoutExtension = file.originalname
      .toLowerCase()
      .split(' ')
      .join('-')
      ?.split('.')[0];

    cb(
      null,
      filenameWithoutExtension +
        Date.now() +
        Math.ceil(Math.random() * 1e5) + // avoid rare name conflict
        fileExtension
    );
  },
});

// Middleware responsible to read form data and upload the File object to the mentioned path
const upload = multer({ storage });

module.exports = { upload };
