import multer from 'multer';

const allowedMimeTypes = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
];

const uploadExcel = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);

      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});

export default uploadExcel;