import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import glucometryService from '../../services/glucometryService';
import examService from '../../services/examService';
import recipeService from '../../services/recipeService';
import LoadingSpinner from '../common/LoadingSpinner';
import Alert from '../common/Alert';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalRecords: 0,
        totalExams: 0,
        totalRecipes: 0,
        avgGlucose: 0,
        lastReading: null,
        glucoseTrend: null
    });
    const [recentRecords, setRecentRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            console.log('Loading dashboard data for user:', user?.role);

            // Cargar datos en paralelo según el rol del usuario
            const [glucoseRes, examsRes, recipesRes] = await Promise.all([
                glucometryService.getRecords().catch((err) => {
                    console.error('Error loading glucose records:', err);
                    return { success: false, data: { records: [] } };
                }),
                examService.getExams().catch((err) => {
                    console.error('Error loading exams:', err);
                    return { success: false, data: { exams: [] } };
                }),
                // Usar diferentes servicios según el rol
                (user?.role === 'admin' || user?.role === 'editor'
                    ? recipeService.getMyRecipes().catch((err) => {
                        console.error('Error loading my recipes:', err);
                        return { success: false, data: { recipes: [] } };
                    })
                    : recipeService.getRecipes().catch((err) => {
                        console.error('Error loading recipes:', err);
                        return { success: false, data: { recipes: [] } };
                    })
                )
            ]);

            console.log('Dashboard responses:', { glucoseRes, examsRes, recipesRes });

            // Procesar datos con la estructura correcta
            const glucoseRecords = glucoseRes.data?.records || glucoseRes.data || [];
            const exams = examsRes.data?.exams || examsRes.data || [];
            const recipes = recipesRes.data?.recipes || recipesRes.data || [];

            console.log('Processed data:', {
                glucoseCount: glucoseRecords.length,
                examsCount: exams.length,
                recipesCount: recipes.length
            });

            // Calcular estadísticas
            let avgGlucose = 0;
            let lastReading = null;
            let glucoseTrend = 'stable';

            if (glucoseRecords.length > 0) {
                // Asegurar que estamos usando el campo correcto (reading)
                const validRecords = glucoseRecords.filter(record => record.reading && !isNaN(record.reading));
                if (validRecords.length > 0) {
                    const sum = validRecords.reduce((acc, record) => acc + parseFloat(record.reading), 0);
                    avgGlucose = (sum / validRecords.length).toFixed(1);
                    lastReading = validRecords[0];

                    // Calcular tendencia simple
                    if (validRecords.length >= 2) {
                        const recent = parseFloat(validRecords[0].reading);
                        const previous = parseFloat(validRecords[1].reading);
                        if (recent > previous + 10) glucoseTrend = 'up';
                        else if (recent < previous - 10) glucoseTrend = 'down';
                    }
                }
            }

            setStats({
                totalRecords: glucoseRecords.length,
                totalExams: exams.length,
                totalRecipes: recipes.length,
                avgGlucose: parseFloat(avgGlucose),
                lastReading,
                glucoseTrend
            });

            setRecentRecords(glucoseRecords.slice(0, 5));

        } catch (err) {
            setError('Error al cargar datos del dashboard');
        } finally {
            setLoading(false);
        }
    };

    const getGlucoseStatus = (level) => {
        if (level < 70) return { text: 'Bajo', class: 'bg-red-100 text-red-800' };
        if (level <= 140) return { text: 'Normal', class: 'bg-green-100 text-green-800' };
        return { text: 'Alto', class: 'bg-yellow-100 text-yellow-800' };
    };

    const getTrendIcon = (trend) => {
        switch (trend) {
            case 'up': return '📈';
            case 'down': return '📉';
            default: return '➡️';
        }
    };

    const menuSections = [
        {
            title: 'Glucometría',
            description: 'Registro y seguimiento de glucosa',
            color: 'bg-green-50 border-green-200',
            items: [
                { name: 'Nuevo Registro', path: '/glucometry/form', icon: '🩸', color: 'text-green-700' },
                { name: 'Historial', path: '/glucometry/records', icon: '📊', color: 'text-green-700' }
            ]
        },
        {
            title: 'Salud',
            description: 'Exámenes médicos y perfil personal',
            color: 'bg-blue-50 border-blue-200',
            items: [
                { name: 'Mi Perfil', path: '/dashboard/profile', icon: '👤', color: 'text-blue-700' },
                { name: 'Exámenes Médicos', path: '/exams', icon: '🏥', color: 'text-blue-700' }
            ]
        },
        {
            title: 'Recetas',
            description: 'Recetas saludables para diabéticos',
            color: 'bg-orange-50 border-orange-200',
            items: [
                { name: 'Ver Recetas', path: '/recipes', icon: '🍽️', color: 'text-orange-700' },
                ...(user && (user.role === 'admin' || user.role === 'editor')
                    ? [{ name: 'Gestionar Recetas', path: '/recipes/manage', icon: '⚙️', color: 'text-orange-700' }]
                    : [])
            ]
        }
    ];

    if (user && user.role === 'admin') {
        menuSections.push({
            title: 'Administración',
            description: 'Panel de control administrativo',
            color: 'bg-purple-50 border-purple-200',
            items: [
                { name: 'Panel Admin', path: '/admin', icon: '🛡️', color: 'text-purple-700' }
            ]
        });
    }

    if (loading) {
        return (
            <div className="py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-center">
                        <LoadingSpinner />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        ¡Hola, {user?.name || 'Usuario'}! 👋
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Bienvenido a AppControl - Tu compañero en el control de diabetes
                    </p>
                </div>

                {error && <Alert type="error" message={error} />}

                {/* Estadísticas Principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Registros de Glucosa */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium">Registros de Glucosa</p>
                                <p className="text-3xl font-bold">{stats.totalRecords}</p>
                                {stats.lastReading && (
                                    <p className="text-blue-100 text-xs mt-1">
                                        Último: {stats.lastReading.reading} mg/dL
                                    </p>
                                )}
                            </div>
                            <div className="text-4xl opacity-80">🩸</div>
                        </div>
                    </div>

                    {/* Promedio de Glucosa */}
                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm font-medium">Promedio Glucosa</p>
                                <p className="text-3xl font-bold">{stats.avgGlucose}</p>
                                <div className="flex items-center mt-1">
                                    <span className="text-2xl mr-1">{getTrendIcon(stats.glucoseTrend)}</span>
                                    <p className="text-green-100 text-xs">mg/dL</p>
                                </div>
                            </div>
                            <div className="text-4xl opacity-80">📊</div>
                        </div>
                    </div>

                    {/* Exámenes Médicos */}
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm font-medium">Exámenes Médicos</p>
                                <p className="text-3xl font-bold">{stats.totalExams}</p>
                                <p className="text-purple-100 text-xs mt-1">Documentos guardados</p>
                            </div>
                            <div className="text-4xl opacity-80">🏥</div>
                        </div>
                    </div>

                    {/* Recetas Disponibles */}
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-100 text-sm font-medium">Recetas Disponibles</p>
                                <p className="text-3xl font-bold">{stats.totalRecipes}</p>
                                <p className="text-orange-100 text-xs mt-1">Recetas saludables</p>
                            </div>
                            <div className="text-4xl opacity-80">🍽️</div>
                        </div>
                    </div>
                </div>

                {/* Sección de Registros Recientes */}
                {recentRecords.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">📈 Registros Recientes</h2>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="grid gap-4">
                                {recentRecords.map((record) => {
                                    const status = getGlucoseStatus(record.reading);
                                    return (
                                        <div key={record._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                            <div className="flex items-center space-x-4">
                                                <div className="text-2xl">🩸</div>
                                                <div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-xl font-bold text-gray-900">
                                                            {record.reading}
                                                        </span>
                                                        <span className="text-sm text-gray-500">mg/dL</span>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.class}`}>
                                                            {status.text}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        {new Date(record.date || record.createdAt).toLocaleString('es-ES')}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => navigate('/glucometry/records')}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
                                                Ver más →
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-4 text-center">
                                <button
                                    onClick={() => navigate('/glucometry/records')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                >
                                    Ver Historial Completo
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Acciones Rápidas */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">⚡ Acciones Rápidas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {menuSections.map((section, index) => (
                            <div key={index} className={`border-2 rounded-xl p-6 ${section.color} hover:shadow-lg transition-shadow`}>
                                <div className="mb-4">
                                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                                        {section.title}
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        {section.description}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    {section.items.map((item, itemIndex) => (
                                        <button
                                            key={itemIndex}
                                            onClick={() => navigate(item.path)}
                                            className="w-full flex items-center justify-between p-3 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-all hover:shadow-md group"
                                        >
                                            <div className="flex items-center">
                                                <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">
                                                    {item.icon}
                                                </span>
                                                <span className={`font-medium group-hover:${item.color}`}>
                                                    {item.name}
                                                </span>
                                            </div>
                                            <span className="text-gray-400 group-hover:text-gray-600">→</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                        <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center">
                            💡 Consejos para un mejor control
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                            <ul className="space-y-2">
                                <li className="flex items-start">
                                    <span className="mr-2">✓</span>
                                    Registra tus niveles de glucosa diariamente
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">✓</span>
                                    Mantén actualizado tu perfil médico
                                </li>
                            </ul>
                            <ul className="space-y-2">
                                <li className="flex items-start">
                                    <span className="mr-2">✓</span>
                                    Sube tus exámenes médicos regularmente
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">✓</span>
                                    Explora nuestras recetas saludables
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center">
                        💡 Consejos para un mejor control
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                        <ul className="space-y-2">
                            <li className="flex items-start">
                                <span className="mr-2">✓</span>
                                Registra tus niveles de glucosa diariamente
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">✓</span>
                                Mantén actualizado tu perfil médico
                            </li>
                        </ul>
                        <ul className="space-y-2">
                            <li className="flex items-start">
                                <span className="mr-2">✓</span>
                                Sube tus exámenes médicos regularmente
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">✓</span>
                                Explora nuestras recetas saludables
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;