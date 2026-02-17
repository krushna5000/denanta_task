import React from 'react';

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: '#e74c3c',
      color: 'white',
      padding: '12px 20px',
      borderRadius: '4px',
      zIndex: '9999',
      fontSize: '14px',
      fontWeight: '600',
      boxShadow: '0 2px 8px rgba(231, 76, 60, 0.3)',
      maxWidth: '600px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span style={{
        flex: '1',
        marginRight: '10px'
      }}>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '16px',
            cursor: 'pointer',
            padding: '0',
            flexShrink: '0'
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
