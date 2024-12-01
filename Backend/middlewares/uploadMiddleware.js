import multer from 'multer';
import path from 'path';

// Configure storage for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, 'uploads/videos'); // Directory for video uploads
    } else if (
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      cb(null, 'uploads/articles'); // Directory for article uploads
    } else {
      cb(new Error('Invalid file type'), false);
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter to accept only specific file types
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith('video/') || // Allow video files
    file.mimetype === 'application/pdf' || // Allow PDF files
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // Allow DOCX files
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only .pdf, .docx, and video files are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
