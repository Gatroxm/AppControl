import React from 'react';

const Alert = ({
    type = 'info',
    title,
    message,
    onClose,
    actions = [],
    className = ''
}) => {
    const typeStyles = {
        success: {
            container: 'bg-success-50 border-success-200 text-success-800',
            icon: '✅',
            titleColor: 'text-success-800',
            messageColor: 'text-success-700',
        },
        error: {
            container: 'bg-danger-50 border-danger-200 text-danger-800',
            icon: '❌',
            titleColor: 'text-danger-800',
            messageColor: 'text-danger-700',
        },
        warning: {
            container: 'bg-warning-50 border-warning-200 text-warning-800',
            icon: '⚠️',
            titleColor: 'text-warning-800',
            messageColor: 'text-warning-700',
        },
        info: {
            container: 'bg-primary-50 border-primary-200 text-primary-800',
            icon: 'ℹ️',
            titleColor: 'text-primary-800',
            messageColor: 'text-primary-700',
        },
    };

    const styles = typeStyles[type] || typeStyles.info;

    return (
        <div className={`border rounded-lg p-4 ${styles.container} ${className}`}>
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <span className="text-lg">{styles.icon}</span>
                </div>

                <div className="ml-3 flex-1">
                    {title && (
                        <h3 className={`text-sm font-medium ${styles.titleColor}`}>
                            {title}
                        </h3>
                    )}

                    {message && (
                        <div className={`mt-1 text-sm ${styles.messageColor}`}>
                            {typeof message === 'string' ? <p>{message}</p> : message}
                        </div>
                    )}

                    {actions.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {actions.map((action, index) => (
                                <button
                                    key={index}
                                    onClick={action.onClick}
                                    className={`text-sm font-medium underline hover:no-underline ${styles.titleColor}`}
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {onClose && (
                    <div className="flex-shrink-0 ml-4">
                        <button
                            onClick={onClose}
                            className={`inline-flex rounded-md p-1.5 hover:bg-opacity-20 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-gray-600 ${styles.titleColor}`}
                        >
                            <span className="sr-only">Cerrar</span>
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Alert;