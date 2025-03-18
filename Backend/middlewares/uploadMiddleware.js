import multer from 'multer';
import path from 'path';
import fs from 'fs';
import ErrorHandler from './errorHandler.js';

// Ensure upload directories exist
const createUploadDirs = () => {
  const dirs = ['uploads', 'uploads/videos', 'uploads/articles', 'uploads/images'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

// Initialize directories
createUploadDirs();

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
    } else if (file.mimetype.startsWith('image/')) {
      cb(null, 'uploads/images'); // Directory for image uploads
    } else {
      cb(new ErrorHandler('Invalid file type', 400), false);
    }
  },
  filename: (req, file, cb) => {
    // Create a safe filename
    const originalName = file.originalname.toLowerCase().replace(/\s+/g, '-');
    const fileName = `${Date.now()}-${originalName}`;
    cb(null, fileName);
  },
});

// File filter to accept only specific file types
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith('video/') || // Allow video files
    file.mimetype === 'application/pdf' || // Allow PDF files
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || // Allow DOCX files
    file.mimetype.startsWith('image/') // Allow image files
  ) {
    cb(null, true);
  } else {
    cb(new ErrorHandler('Only images, PDF, DOCX, and video files are allowed!', 400), false);
  }
};

// Custom file size limits
const limits = {
  fileSize: 50 * 1024 * 1024, // 50MB max file size
};

// Create multer upload instance
const upload = multer({ 
  storage, 
  fileFilter,
  limits
});

// Middleware to handle Multer errors
export const handleUploadErrors = (req, res, next) => {
  return (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new ErrorHandler('File too large. Maximum size is 100MB', 400));
      }
      return next(new ErrorHandler(`Upload error: ${err.message}`, 400));
    }
    
    if (err) {
      return next(err); // Pass on to the main error handler
    }
    
    next();
  };
};

export default upload;
