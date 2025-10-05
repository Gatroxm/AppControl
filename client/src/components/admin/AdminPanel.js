import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';
import recipeService from '../../services/recipeService';
import examService from '../../services/examService';
import glucometryService from '../../services/glucometryService';
import { useAuth } from '../../context/AuthContext';
import Alert from '../common/Alert';
import LoadingSpinner from '../common/LoadingSpinner';

const AdminPanel = () => {
    const [stats, setStats] = useState({
        users: 0,
        recipes: 0,
        exams: 0,
        glucoseRecords: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        newUsersLast30Days: 0,
        admins: 0,
        editors: 0,
        regularUsers: 0
    });
    const [users, setUsers] = useState([]);
    const [showInactiveUsers, setShowInactiveUsers] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');
    const [processingUserId, setProcessingUserId] = useState(null);

    const { user } = useAuth();

    useEffect(() => {
        if (user?.role === 'admin') {
            loadDashboardData();
        }
    }, [user]);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            console.log('🔍 Cargando datos del panel administrativo...');

            // Cargar estadísticas detalladas usando funciones administrativas
            const [usersRes, statsRes, recipesRes, examsRes, glucoseRes] = await Promise.all([
                userService.getAllUsers(),
                userService.getStats(),
                recipeService.getAllRecipes(), // Usar función administrativa para ver todas las recetas
                examService.getAllExams(),
                glucometryService.getAllRecords()
            ]);

            console.log('📊 Respuestas recibidas:', {
                users: usersRes.success ? `${usersRes.data?.users?.length || 0} usuarios` : 'Error',
                recipes: recipesRes.success ? `${recipesRes.data?.recipes?.length || 0} recetas` : 'Error',
                exams: examsRes.success ? `${examsRes.data?.exams?.length || 0} exámenes` : 'Error',
                glucose: glucoseRes.success ? `${glucoseRes.data?.records?.length || 0} registros` : 'Error'
            });

            // Estadísticas básicas
            const basicStats = {
                users: usersRes.success && usersRes.data?.users ? usersRes.data.users.length : 0,
                recipes: recipesRes.success && recipesRes.data?.recipes ? recipesRes.data.recipes.length : 0,
                exams: examsRes.success && examsRes.data?.exams ? examsRes.data.exams.length : 0,
                glucoseRecords: glucoseRes.success && glucoseRes.data?.records ? glucoseRes.data.records.length : 0
            };

            // Estadísticas detalladas de usuarios
            if (statsRes.success && statsRes.data?.stats) {
                setStats({
                    ...basicStats,
                    activeUsers: statsRes.data.stats.total,
                    inactiveUsers: basicStats.users - statsRes.data.stats.total,
                    newUsersLast30Days: statsRes.data.stats.newUsersLast30Days,
                    admins: statsRes.data.stats.admins,
                    editors: statsRes.data.stats.editors,
                    regularUsers: statsRes.data.stats.regularUsers
                });
            } else {
                setStats(basicStats);
            }

            if (usersRes.success && usersRes.data?.users) {
                setUsers(usersRes.data.users);
            } else {
                setUsers([]);
            }
        } catch (err) {
            console.error('❌ Error al cargar datos del panel:', err);
            setError('Error al cargar datos del panel: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            const response = await userService.updateUser(userId, { role: newRole });
            if (response.success) {
                setSuccess('Rol actualizado exitosamente');
                loadDashboardData();
                setError('');
            } else {
                setError('Error al actualizar rol');
            }
        } catch (err) {
            setError('Error al actualizar rol');
        }
    };

    const handleToggleUserStatus = async (userId, currentStatus) => {
        const action = currentStatus ? 'desactivar' : 'activar';
        if (!window.confirm(`¿Estás seguro de que deseas ${action} este usuario?`)) return;

        try {
            setProcessingUserId(userId);
            const response = currentStatus
                ? await userService.deactivateUser(userId)
                : await userService.reactivateUser(userId);

            if (response.success) {
                setSuccess(`Usuario ${action === 'desactivar' ? 'desactivado' : 'activado'} exitosamente`);
                loadDashboardData();
                setError('');
            } else {
                setError(`Error al ${action} usuario`);
            }
        } catch (err) {
            setError(`Error al ${action} usuario`);
        } finally {
            setProcessingUserId(null);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar permanentemente este usuario? Esta acción no se puede deshacer.')) return;

        try {
            setProcessingUserId(userId);
            const response = await userService.deleteUser(userId);
            if (response.success) {
                setSuccess('Usuario eliminado permanentemente');
                loadDashboardData();
                setError('');
            } else {
                setError('Error al eliminar usuario');
            }
        } catch (err) {
            setError('Error al eliminar usuario');
        } finally {
            setProcessingUserId(null);
        }
    };

    // Funciones comerciales
    const handleExportUsers = async () => {
        try {
            setLoading(true);
            const response = await userService.exportUsers();

            // Crear y descargar el archivo
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'usuarios.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            setSuccess('Usuarios exportados exitosamente');
            setError('');
        } catch (err) {
            setError('Error al exportar usuarios');
        } finally {
            setLoading(false);
        }
    };

    const handleSendNotification = async () => {
        const title = prompt('Título de la notificación:');
        if (!title) return;

        const message = prompt('Mensaje de la notificación:');
        if (!message) return;

        try {
            setLoading(true);
            const response = await userService.sendNotification({ title, message });

            if (response.success) {
                setSuccess(`Notificación enviada a ${response.data.sentTo} usuarios`);
                setError('');
            } else {
                setError('Error al enviar notificación');
            }
        } catch (err) {
            setError('Error al enviar notificación');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateMonthlyReport = async () => {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        try {
            setLoading(true);
            const response = await userService.generateMonthlyReport(month, year);

            // Crear y descargar el archivo
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `reporte_${month}_${year}.txt`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            setSuccess('Reporte generado exitosamente');
            setError('');
        } catch (err) {
            setError('Error al generar reporte');
        } finally {
            setLoading(false);
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return 'bg-red-100 text-red-800';
            case 'editor': return 'bg-blue-100 text-blue-800';
            case 'user': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (user?.role !== 'admin') {
        return (
            <div className="container mx-auto px-4 py-8">
                <Alert type="error" message="No tienes permisos para acceder a esta sección" />
            </div>
        );
    }

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
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
                <p className="text-gray-600">Gestiona usuarios y supervisa la actividad del sistema</p>
            </div>

            {error && <Alert type="error" message={error} />}
            {success && <Alert type="success" message={success} />}

            {/* Tabs */}
            <div className="mb-6">
                <nav className="flex space-x-8">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'dashboard'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'users'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Gestión de Usuarios
                    </button>
                    <button
                        onClick={() => setActiveTab('commercial')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'commercial'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Panel Comercial
                    </button>
                </nav>
            </div>

            {activeTab === 'dashboard' && (
                <div>
                    {/* Estadísticas principales */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-blue-600 text-lg">👥</span>
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-500">Usuarios Totales</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.users}</p>
                                    <div className="flex text-xs mt-1">
                                        <span className="text-green-600">✓ {stats.activeUsers} activos</span>
                                        {stats.inactiveUsers > 0 && (
                                            <span className="text-red-600 ml-2">✗ {stats.inactiveUsers} inactivos</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <span className="text-green-600 text-lg">📖</span>
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-500">Recetas</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.recipes}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                        <span className="text-yellow-600 text-lg">🏥</span>
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-500">Exámenes</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.exams}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                        <span className="text-red-600 text-lg">🩸</span>
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-500">Registros Glucosa</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.glucoseRecords}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                        <span className="text-purple-600 text-lg">🎆</span>
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-500">Nuevos (30d)</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.newUsersLast30Days}</p>
                                    <p className="text-xs text-gray-400">usuarios registrados</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resumen por roles */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Roles</h3>
                            <div className="space-y-4">
                                {[
                                    { key: 'admin', name: 'Administradores', count: stats.admins, color: 'bg-red-500' },
                                    { key: 'editor', name: 'Editores', count: stats.editors, color: 'bg-blue-500' },
                                    { key: 'user', name: 'Usuarios', count: stats.regularUsers, color: 'bg-green-500' }
                                ].map(role => {
                                    const percentage = stats.activeUsers > 0 ? (role.count / stats.activeUsers * 100).toFixed(1) : 0;

                                    return (
                                        <div key={role.key}>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm font-medium text-gray-700">
                                                    {role.name}
                                                </span>
                                                <span className="text-sm text-gray-500">{role.count} ({percentage}%)</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${role.color}`}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Cuentas</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                                        <span className="text-sm font-medium text-gray-700">Cuentas Activas</span>
                                    </div>
                                    <span className="text-lg font-bold text-green-600">{stats.activeUsers}</span>
                                </div>
                                {stats.inactiveUsers > 0 && (
                                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                                            <span className="text-sm font-medium text-gray-700">Cuentas Inactivas</span>
                                        </div>
                                        <span className="text-lg font-bold text-red-600">{stats.inactiveUsers}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                                        <span className="text-sm font-medium text-gray-700">Nuevos (30 días)</span>
                                    </div>
                                    <span className="text-lg font-bold text-blue-600">{stats.newUsersLast30Days}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'users' && (
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">Gestión de Usuarios</h3>
                            <div className="flex items-center space-x-3">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={showInactiveUsers}
                                        onChange={(e) => setShowInactiveUsers(e.target.checked)}
                                        className="form-checkbox h-4 w-4 text-blue-600"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">Mostrar inactivos</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Usuario
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rol
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Registro
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((userItem) => (
                                    <tr key={userItem._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {userItem.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {userItem.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(userItem.role)}`}>
                                                {userItem.role === 'admin' ? 'Administrador' :
                                                    userItem.role === 'editor' ? 'Editor' : 'Usuario'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(userItem.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            {userItem._id !== user._id && (
                                                <>
                                                    <select
                                                        value={userItem.role}
                                                        onChange={(e) => handleRoleChange(userItem._id, e.target.value)}
                                                        className="text-xs border border-gray-300 rounded px-2 py-1"
                                                    >
                                                        <option value="user">Usuario</option>
                                                        <option value="editor">Editor</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                    <button
                                                        onClick={() => handleDeleteUser(userItem._id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </>
                                            )}
                                            {userItem._id === user._id && (
                                                <span className="text-gray-400 text-xs">Tu cuenta</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'commercial' && (
                <div className="space-y-6">
                    {/* Metricas comerciales */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-lg shadow p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm font-medium">Usuarios Activos</p>
                                    <p className="text-3xl font-bold">{stats.activeUsers}</p>
                                    <p className="text-green-100 text-xs mt-1">Potenciales clientes pagos</p>
                                </div>
                                <div className="text-green-200 text-3xl">💰</div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg shadow p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm font-medium">Crecimiento Mensual</p>
                                    <p className="text-3xl font-bold">{stats.newUsersLast30Days}</p>
                                    <p className="text-blue-100 text-xs mt-1">Nuevos usuarios este mes</p>
                                </div>
                                <div className="text-blue-200 text-3xl">📈</div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg shadow p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm font-medium">Tasa de Retención</p>
                                    <p className="text-3xl font-bold">
                                        {stats.users > 0 ? ((stats.activeUsers / stats.users) * 100).toFixed(1) : 0}%
                                    </p>
                                    <p className="text-purple-100 text-xs mt-1">Usuarios activos vs totales</p>
                                </div>
                                <div className="text-purple-200 text-3xl">🎯</div>
                            </div>
                        </div>
                    </div>

                    {/* Acciones comerciales */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">Enviar Notificación</p>
                                        <p className="text-sm text-gray-600">A todos los usuarios activos</p>
                                    </div>
                                    <button
                                        onClick={handleSendNotification}
                                        disabled={loading}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {loading ? 'Enviando...' : 'Enviar'}
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">Exportar Usuarios</p>
                                        <p className="text-sm text-gray-600">Lista completa en CSV</p>
                                    </div>
                                    <button
                                        onClick={handleExportUsers}
                                        disabled={loading}
                                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                                    >
                                        {loading ? 'Descargando...' : 'Descargar'}
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">Resumen Mensual</p>
                                        <p className="text-sm text-gray-600">Reporte de actividad</p>
                                    </div>
                                    <button
                                        onClick={handleGenerateMonthlyReport}
                                        disabled={loading}
                                        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
                                    >
                                        {loading ? 'Generando...' : 'Generar'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración Comercial</h3>
                            <div className="space-y-4">
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-2">Límites por Rol</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Usuario Básico:</span>
                                            <span className="font-medium">50 registros/mes</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Editor:</span>
                                            <span className="font-medium">200 registros/mes</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Administrador:</span>
                                            <span className="font-medium">Ilimitado</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="border border-gray-200 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-2">Estado del Sistema</h4>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span className="text-sm text-gray-600">Sistema operativo</span>
                                    </div>
                                    <div className="flex items-center space-x-2 mt-2">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                        <span className="text-sm text-gray-600">Base de datos conectada</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Alertas y notificaciones */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                        <div className="flex items-start">
                            <div className="text-yellow-600 mr-3 text-xl">⚠️</div>
                            <div>
                                <h3 className="font-medium text-yellow-800 mb-2">Recomendaciones Comerciales</h3>
                                <ul className="text-sm text-yellow-700 space-y-1">
                                    <li>• Considera implementar un sistema de suscripciones para usuarios frecuentes</li>
                                    <li>• Los usuarios inactivos podrían beneficiarse de campañas de reactivación</li>
                                    <li>• El crecimiento mensual indica una buena adopción del sistema</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;