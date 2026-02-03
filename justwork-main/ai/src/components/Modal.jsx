import React, { useState, useEffect, useRef } from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, plan, onProceed }) => {
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [confirmWhatsappNumber, setConfirmWhatsappNumber] = useState('');
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
      // Focus trap
      if (firstInputRef.current) {
        firstInputRef.current.focus();
      }
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  const validateNumbers = () => {
    const newErrors = {};

    // Check if both fields are filled
    if (!whatsappNumber.trim()) {
      newErrors.whatsapp = 'WhatsApp number is required';
    } else if (!/^\d{10}$/.test(whatsappNumber)) {
      newErrors.whatsapp = 'Please enter a valid 10-digit number';
    }

    if (!confirmWhatsappNumber.trim()) {
      newErrors.confirm = 'Please confirm your WhatsApp number';
    } else if (whatsappNumber !== confirmWhatsappNumber) {
      newErrors.confirm = 'Numbers do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceed = async () => {
    if (!validateNumbers()) return;

    setIsProcessing(true);
    try {
      await onProceed(whatsappNumber);
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !plan) return null;

  const displayPrice = plan.price === 0 ? 'Free' : `$${plan.price.toFixed(plan.price % 1 === 0 ? 0 : 2)}`;

  return (
    <div className="modal-overlay" onClick={handleBackdropClick} onKeyDown={handleKeyDown}>
      <div className="modal-content" ref={modalRef}>
        <div className="modal-header">
          <h2>Confirm Your Package</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="package-details">
            <h3>{plan.name}</h3>
            <div className="package-price">
              <span className="price">{displayPrice}</span>
              {plan.price > 0 && <span className="period">/{plan.period}</span>}
            </div>
            <p className="package-subtitle">{plan.subtitle}</p>
            <ul className="package-features">
              {plan.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="whatsapp-section">
            <h4>WhatsApp Number Confirmation</h4>
            <p className="whatsapp-note">
              This WhatsApp number will be used for order updates and support.
            </p>

            <div className="input-group">
              <label htmlFor="whatsapp">Enter WhatsApp Number</label>
              <input
                ref={firstInputRef}
                id="whatsapp"
                type="tel"
                value={whatsappNumber}
                onChange={(e) => {
                  setWhatsappNumber(e.target.value.replace(/\D/g, '').slice(0, 10));
                  if (errors.whatsapp) setErrors({ ...errors, whatsapp: '' });
                }}
                placeholder="9876543210"
                maxLength="10"
                className={errors.whatsapp ? 'error' : ''}
              />
              {errors.whatsapp && <span className="error-message">{errors.whatsapp}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="confirm-whatsapp">Confirm WhatsApp Number</label>
              <input
                id="confirm-whatsapp"
                type="tel"
                value={confirmWhatsappNumber}
                onChange={(e) => {
                  setConfirmWhatsappNumber(e.target.value.replace(/\D/g, '').slice(0, 10));
                  if (errors.confirm) setErrors({ ...errors, confirm: '' });
                }}
                placeholder="9876543210"
                maxLength="10"
                className={errors.confirm ? 'error' : ''}
              />
              {errors.confirm && <span className="error-message">{errors.confirm}</span>}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose} disabled={isProcessing}>
            Cancel
          </button>
          <button
            className="btn-proceed"
            onClick={handleProceed}
            disabled={isProcessing || !whatsappNumber || !confirmWhatsappNumber}
          >
            {isProcessing ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;