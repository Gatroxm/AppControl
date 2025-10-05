import React, { useState, useEffect } from 'react';
import glucometryService from '../../services/glucometryService';
import LoadingSpinner from '../common/LoadingSpinner';
import Alert from '../common/Alert';

const GlucometryForm = () => {
    const [formData, setFormData] = useState({
        glucoseLevel: '',
        measurementType: 'fasting',
        notes: '',
        symptoms: ''
    });
    const [recentRecords, setRecentRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        loadRecentRecords();
    }, []);

    const loadRecentRecords = async () => {
        try {
            const records = await glucometryService.getRecords(1, 5);
            setRecentRecords(records.records || []);
        } catch (error) {
            console.error('Error cargando registros:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await glucometryService.createRecord(formData);
            setMessage({ type: 'success', text: 'Registro guardado exitosamente' });
            setFormData({
                glucoseLevel: '',
                measurementType: 'fasting',
                notes: '',
                symptoms: ''
            });
            loadRecentRecords();
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Error al guardar registro' });
        } finally {
            setLoading(false);
        }
    };

    const getGlucoseStatus = (level, type) => {
        const value = parseFloat(level);

        if (type === 'fasting') {
            if (value < 70) return { status: 'low', text: 'Bajo' };
            if (value >= 70 && value <= 100) return { status: 'normal', text: 'Normal' };
            if (value > 100 && value <= 125) return { status: 'prediabetes', text: 'Prediabetes' };
            return { status: 'high', text: 'Alto' };
        } else {
            if (value < 70) return { status: 'low', text: 'Bajo' };
            if (value >= 70 && value <= 140) return { status: 'normal', text: 'Normal' };
            if (value > 140 && value <= 199) return { status: 'prediabetes', text: 'Prediabetes' };
            return { status: 'high', text: 'Alto' };
        }
    };

    return (
        <div className="glucometry-container">
            <div className="glucometry-header">
                <h1>📊 Control de Glucosa</h1>
                <p>Registra tus niveles de glucosa diarios</p>
            </div>

            {message.text && (
                <Alert type={message.type} message={message.text} />
            )}

            <div className="glucometry-content">
                <div className="form-section">
                    <h2>Nuevo Registro</h2>
                    <form onSubmit={handleSubmit} className="glucometry-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Nivel de Glucosa (mg/dL)</label>
                                <input
                                    type="number"
                                    name="glucoseLevel"
                                    value={formData.glucoseLevel}
                                    onChange={handleChange}
                                    className="form-input"
                                    min="20"
                                    max="600"
                                    required
                                    placeholder="Ej: 95"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Tipo de Medición</label>
                                <select
                                    name="measurementType"
                                    value={formData.measurementType}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                >
                                    <option value="fasting">En ayunas</option>
                                    <option value="postprandial">Postprandial (2h después de comer)</option>
                                    <option value="random">Aleatoria</option>
                                    <option value="bedtime">Antes de dormir</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Síntomas (opcional)</label>
                            <input
                                type="text"
                                name="symptoms"
                                value={formData.symptoms}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Ej: mareo, sed, cansancio..."
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Notas adicionales</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                className="form-input"
                                rows="3"
                                placeholder="Cualquier información adicional..."
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? <LoadingSpinner /> : '💾 Guardar Registro'}
                        </button>
                    </form>
                </div>

                <div className="records-section">
                    <h2>Registros Recientes</h2>
                    {recentRecords.length === 0 ? (
                        <div className="no-records">
                            <p>No hay registros recientes</p>
                            <p className="text-muted">¡Agrega tu primer registro arriba!</p>
                        </div>
                    ) : (
                        <div className="records-list">
                            {recentRecords.map((record) => {
                                const status = getGlucoseStatus(record.glucoseLevel, record.measurementType);
                                return (
                                    <div key={record._id} className="record-card">
                                        <div className="record-header">
                                            <div className="record-level">
                                                <span className="level-value">{record.glucoseLevel}</span>
                                                <span className="level-unit">mg/dL</span>
                                                <span className={`status-badge status-${status.status}`}>
                                                    {status.text}
                                                </span>
                                            </div>
                                            <div className="record-date">
                                                {new Date(record.createdAt).toLocaleDateString('es-ES', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </div>
                                        <div className="record-details">
                                            <p><strong>Tipo:</strong> {record.measurementType}</p>
                                            {record.symptoms && (
                                                <p><strong>Síntomas:</strong> {record.symptoms}</p>
                                            )}
                                            {record.notes && (
                                                <p><strong>Notas:</strong> {record.notes}</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GlucometryForm;