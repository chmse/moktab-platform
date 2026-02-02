import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface SuccessToastProps {
    show: boolean;
    message: string;
    onClose: () => void;
}

const SuccessToast: React.FC<SuccessToastProps> = ({ show, message, onClose }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 9999,
            animation: 'slideIn 0.3s ease-out forwards'
        }}>
            <div style={{
                backgroundColor: '#1A237E', // Navy
                color: '#C5A059', // Gold
                padding: '1rem 2rem',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                border: '1px solid rgba(197, 160, 89, 0.3)',
                maxWidth: '400px'
            }}>
                <CheckCircle size={24} />
                <span style={{ fontWeight: 'bold' }}>{message}</span>
                <button
                    onClick={onClose}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'rgba(197, 160, 89, 0.6)',
                        cursor: 'pointer',
                        marginLeft: '0.5rem',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <X size={18} />
                </button>
            </div>
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default SuccessToast;
