// Classify glucose reading
export const classifyGlucoseReading = (reading) => {
    if (reading < 70) {
        return {
            level: 'low',
            label: 'Bajo',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
        };
    } else if (reading >= 70 && reading <= 140) {
        return {
            level: 'normal',
            label: 'Normal',
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
        };
    } else if (reading > 140 && reading <= 180) {
        return {
            level: 'high',
            label: 'Alto',
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-200',
        };
    } else {
        return {
            level: 'very-high',
            label: 'Muy Alto',
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
        };
    }
};

// Get meal time options
export const getMealTimeOptions = () => [
    { value: 'Ayunas', label: 'Ayunas' },
    { value: 'Antes del desayuno', label: 'Antes del desayuno' },
    { value: 'Después del desayuno', label: 'Después del desayuno' },
    { value: 'Antes del almuerzo', label: 'Antes del almuerzo' },
    { value: 'Después del almuerzo', label: 'Después del almuerzo' },
    { value: 'Antes de la cena', label: 'Antes de la cena' },
    { value: 'Después de la cena', label: 'Después de la cena' },
    { value: 'Antes de dormir', label: 'Antes de dormir' },
    { value: 'Otro', label: 'Otro' },
];

// Calculate average glucose
export const calculateAverageGlucose = (records) => {
    if (!records || records.length === 0) return 0;

    const sum = records.reduce((acc, record) => acc + record.reading, 0);
    return Math.round((sum / records.length) * 100) / 100;
};

// Get glucose trend
export const getGlucoseTrend = (records) => {
    if (!records || records.length < 2) {
        return {
            trend: 'stable',
            label: 'Estable',
            icon: '➡️',
            color: 'text-gray-600',
        };
    }

    // Compare last 3 readings with previous 3
    const recent = records.slice(0, 3);
    const previous = records.slice(3, 6);

    if (recent.length === 0 || previous.length === 0) {
        return {
            trend: 'stable',
            label: 'Estable',
            icon: '➡️',
            color: 'text-gray-600',
        };
    }

    const recentAvg = calculateAverageGlucose(recent);
    const previousAvg = calculateAverageGlucose(previous);
    const difference = recentAvg - previousAvg;

    if (difference > 10) {
        return {
            trend: 'rising',
            label: 'Subiendo',
            icon: '⬆️',
            color: 'text-red-600',
        };
    } else if (difference < -10) {
        return {
            trend: 'falling',
            label: 'Bajando',
            icon: '⬇️',
            color: 'text-blue-600',
        };
    } else {
        return {
            trend: 'stable',
            label: 'Estable',
            icon: '➡️',
            color: 'text-green-600',
        };
    }
};