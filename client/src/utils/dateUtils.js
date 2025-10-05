// Format date for display
export const formatDate = (date) => {
    if (!date) return '';

    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };

    return new Date(date).toLocaleDateString('es-ES', options);
};

// Format datetime for display
export const formatDateTime = (date) => {
    if (!date) return '';

    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };

    return new Date(date).toLocaleDateString('es-ES', options);
};

// Format date for input fields (YYYY-MM-DD)
export const formatDateForInput = (date) => {
    if (!date) return '';

    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

// Format datetime for input fields (YYYY-MM-DDTHH:MM)
export const formatDateTimeForInput = (date) => {
    if (!date) return '';

    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Get relative time (e.g., "hace 2 horas")
export const getRelativeTime = (date) => {
    if (!date) return '';

    const now = new Date();
    const targetDate = new Date(date);
    const diffInSeconds = Math.floor((now - targetDate) / 1000);

    if (diffInSeconds < 60) {
        return 'hace unos segundos';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `hace ${diffInMinutes} minuto${diffInMinutes === 1 ? '' : 's'}`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `hace ${diffInHours} hora${diffInHours === 1 ? '' : 's'}`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
        return `hace ${diffInDays} día${diffInDays === 1 ? '' : 's'}`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return `hace ${diffInMonths} mes${diffInMonths === 1 ? '' : 'es'}`;
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return `hace ${diffInYears} año${diffInYears === 1 ? '' : 's'}`;
};