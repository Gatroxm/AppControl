const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let subDir = 'others';

        if (file.fieldname === 'examFile') {
            subDir = 'exams';
        } else if (file.fieldname === 'recipeImage') {
            subDir = 'recipes';
        }

        const fullPath = path.join(uploadDir, subDir);
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
        }

        cb(null, fullPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    },
});

// File filter function
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'examFile') {
        // Allowed file types for medical exams
        const allowedTypes = [
            'application/pdf',
            'image/jpeg',
            'image/png',
            'image/gif',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Tipo de archivo no permitido para exámenes médicos'), false);
        }
    } else if (file.fieldname === 'recipeImage') {
        // Allowed file types for recipe images
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten imágenes para las recetas'), false);
        }
    } else {
        cb(new Error('Campo de archivo no válido'), false);
    }
};

// Create multer instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
    },
});

// Handle multer errors
const handleMulterError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'El archivo es demasiado grande. Tamaño máximo: 5MB',
            });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                success: false,
                message: 'Campo de archivo no esperado',
            });
        }
    }

    if (error.message.includes('Tipo de archivo no permitido')) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }

    next(error);
};

module.exports = {
    upload,
    handleMulterError,
};