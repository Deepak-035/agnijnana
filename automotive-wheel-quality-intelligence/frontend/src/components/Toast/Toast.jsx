import React from 'react';
import './Toast.css';

export default function Toast({ message, type, onClose }) {
  if (!message) return null;

  return (
    <div className={`toast-notification toast-${type}`}>
      <div className="toast-content">
        <span className="toast-dot"></span>
        <span className="toast-msg">{message}</span>
      </div>
      <button className="toast-close" onClick={onClose}>✕</button>
    </div>
  );
}
