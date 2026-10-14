import React from 'react';
import { CheckIcon, AlertIcon, InfoIcon } from './Icons';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '2px' }}>
            {toast.type === 'success' && <CheckIcon size={16} color="#10b981" />}
            {toast.type === 'error' && <AlertIcon size={16} color="#ef4444" />}
            {toast.type === 'info' && <InfoIcon size={16} color="#818cf8" />}
          </div>
          <div style={{ flex: 1 }}>{toast.message}</div>
          <button
            onClick={() => onDismiss(toast.id)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '1.1rem',
              lineHeight: 1,
              padding: '0 4px'
            }}
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
