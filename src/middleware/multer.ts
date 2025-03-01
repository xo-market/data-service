import multer from 'multer';

const storage = multer.memoryStorage();

export const uploadSingleFileMiddleware = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            cb(new Error('Only images are allowed'));
            return;
        }
        cb(null, true);
    },
}).single('file');
