import React, { useState, useEffect } from 'react';
import glucometryService from '../../services/glucometryService';
import { useAuth } from '../../context/AuthContext';
import Alert from '../common/Alert';
import LoadingSpinner from '../common/LoadingSpinner';

const GlucometryRecords = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
    });

    const { user } = useAuth();

    useEffect(() => {
        loadRecords();
    }, []);

    const loadRecords = async () => {
        try {
            setLoading(true);
            console.log('Loading glucometry records...');
            const response = await glucometryService.getRecords();
            console.log('Glucometry response:', response);

            if (response.success && response.data && response.data.records) {
                setRecords(response.data.records);
                console.log('Records loaded:', response.data.records.length);
            } else {
                console.log('No records found or error in response');
                setError('Error al cargar registros');
                setRecords([]);
            }
        } catch (err) {
            console.error('Error loading records:', err);
            setError('Error al cargar registros');
            setRecords([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredRecords = records.filter(record => {
        if (filter === 'all') return true;

        const reading = record.reading;
        switch (filter) {
            case 'low': return reading < 70;
            case 'normal': return reading >= 70 && reading <= 140;
            case 'high': return reading > 140;
            default: return true;
        }
    }).filter(record => {
        if (!dateRange.startDate || !dateRange.endDate) return true;
        const recordDate = new Date(record.date);
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        return recordDate >= startDate && recordDate <= endDate;
    });

    const getGlucoseStatus = (level) => {
        if (level < 70) return { text: 'Bajo', class: 'text-blue-600 bg-blue-100' };
        if (level <= 140) return { text: 'Normal', class: 'text-green-600 bg-green-100' };
        return { text: 'Alto', class: 'text-red-600 bg-red-100' };
    };

    const getMealTypeIcon = (mealTime) => {
        const icons = {
            'Ayunas': '🌅',
            'Antes del desayuno': '🌅',
            'Después del desayuno': '🥐',
            'Antes del almuerzo': '☀️',
            'Después del almuerzo': '�️',
            'Antes de la cena': '🌆',
            'Después de la cena': '�',
            'Antes de dormir': '🛌',
            'Otro': '⏰'
        };
        return icons[mealTime] || '⏰';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const calculateAverage = () => {
        if (filteredRecords.length === 0) return 0;
        const sum = filteredRecords.reduce((acc, record) => acc + record.reading, 0);
        return (sum / filteredRecords.length).toFixed(1);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Historial de Glucosa</h1>
                <div className="text-right">
                    <p className="text-sm text-gray-600">Total de registros</p>
                    <p className="text-2xl font-bold text-blue-600">{filteredRecords.length}</p>
                </div>
            </div>

            {error && <Alert type="error" message={error} />}

            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 text-sm font-medium">📊</span>
                            </div>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Promedio</p>
                            <p className="text-lg font-semibold text-gray-900">{calculateAverage()} mg/dL</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                <span className="text-red-600 text-sm font-medium">⬆️</span>
                            </div>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Niveles Altos</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {filteredRecords.filter(r => r.reading > 140).length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-green-600 text-sm font-medium">✅</span>
                            </div>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Normales</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {filteredRecords.filter(r => r.reading >= 70 && r.reading <= 140).length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 text-sm font-medium">⬇️</span>
                            </div>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Niveles Bajos</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {filteredRecords.filter(r => r.reading < 70).length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Filtrar por nivel
                        </label>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">Todos los niveles</option>
                            <option value="low">Bajos (&lt;70)</option>
                            <option value="normal">Normales (70-140)</option>
                            <option value="high">Altos (&gt;140)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha inicio
                        </label>
                        <input
                            type="date"
                            value={dateRange.startDate}
                            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha fin
                        </label>
                        <input
                            type="date"
                            value={dateRange.endDate}
                            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Lista de registros */}
            <div className="space-y-4">
                {filteredRecords.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay registros</h3>
                        <p className="text-gray-500">No se encontraron registros con los filtros aplicados</p>
                    </div>
                ) : (
                    filteredRecords.map((record) => {
                        const status = getGlucoseStatus(record.reading);
                        return (
                            <div key={record._id} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center space-x-4">
                                        <div className="text-2xl">
                                            {getMealTypeIcon(record.mealTime)}
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-2xl font-bold text-gray-900">
                                                    {record.reading}
                                                </span>
                                                <span className="text-sm text-gray-500">mg/dL</span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.class}`}>
                                                    {status.text}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 capitalize">
                                                {record.mealTime || 'Sin especificar'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">
                                            {formatDate(record.date)}
                                        </p>
                                        <p className="text-xs text-gray-500 capitalize">
                                            {record.measurementTime}
                                        </p>
                                    </div>
                                </div>

                                {record.notes && (
                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Notas:</span> {record.notes}
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default GlucometryRecords;