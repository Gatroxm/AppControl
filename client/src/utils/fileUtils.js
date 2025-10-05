// Format file size in human readable format
export const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';

    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
};

// Get file extension from filename
export const getFileExtension = (filename) => {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

// Check if file is an image
export const isImageFile = (filename) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const extension = getFileExtension(filename).toLowerCase();
    return imageExtensions.includes(extension);
};

// Check if file is a PDF
export const isPdfFile = (filename) => {
    const extension = getFileExtension(filename).toLowerCase();
    return extension === 'pdf';
};

// Get file type icon class
export const getFileTypeIcon = (filename) => {
    const extension = getFileExtension(filename).toLowerCase();

    const iconMap = {
        pdf: '📄',
        doc: '📝',
        docx: '📝',
        jpg: '🖼️',
        jpeg: '🖼️',
        png: '🖼️',
        gif: '🖼️',
        bmp: '🖼️',
        webp: '🖼️',
    };

    return iconMap[extension] || '📁';
};

// Validate file type for medical exams
export const isValidExamFile = (file) => {
    const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    return allowedTypes.includes(file.type);
};

// Validate file type for recipe images
export const isValidRecipeImage = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return allowedTypes.includes(file.type);
};

// Validate file size (in bytes)
export const isValidFileSize = (file, maxSizeInMB = 5) => {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return file.size <= maxSizeInBytes;
};