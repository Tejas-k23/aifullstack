import React, { useState } from 'react';
import './PricingSection.css';

const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      name: 'Free',
      price: 0,
      period: isYearly ? 'year' : 'month',
      subtitle: 'Perfect for getting started',
      buttonText: 'Try it for Free',
      buttonStyle: 'primary',
      features: [
        'Basic editing tools',
        '10+ filters',
        'Export in HD',
        'Limited background remover',
        'No watermark'
      ],
      isPro: false,
      isStudio: false,
      packageId: 1
    },
    {
      name: 'Pro',
      price: 9.99,
      period: isYearly ? 'year' : 'month',
      subtitle: 'For creators who want more',
      buttonText: 'Upgrade to Pro',
      buttonStyle: 'white',
      features: [
        'Everything in Free, plus',
        'All AI tools unlocked',
        'Face & object retouch',
        '30+ filters & styles',
        '50 GB cloud storage'
      ],
      isPro: true,
      isStudio: false,
      packageId: 2
    },
    {
      name: 'Studio',
      price: 29,
      period: isYearly ? 'year' : 'month',
      subtitle: 'For businesses and power users',
      buttonText: 'Go Studio',
      buttonStyle: 'primary',
      features: [
        'Everything in Pro, plus',
        'Custom avatars & branding',
        'Unlimited cloud projects',
        'Team access (up to 5 users)',
        'Commercial license'
      ],
      isPro: false,
      isStudio: true,
      packageId: 3
    }
  ];

  const handlePayment = async (packageId, planName) => {
    if (!phoneNumber) {
      alert('Please enter your phone number');
      return;
    }
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      // 1. Create order from backend - Pointing to Port 3000
      const response = await fetch('http://localhost:3000/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          package_id: packageId, 
          phone_number: phoneNumber 
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }

      const orderData = await response.json();

      // 2. Initialize Razorpay checkout
      const options = {
        key: 'rzp_test_S5LVYSlFVO4x9E', // Your verified Test Key
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.order_id,
        name: 'MyWork AI',
        description: `Upgrade to ${planName}`,
        handler: async function (response) {
          // 3. Verify payment on backend - Pointing to Port 3000
          try {
            const verifyResponse = await fetch('http://localhost:3000/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                phone_number: phoneNumber,
                package_id: packageId
              })
            });

            const result = await verifyResponse.json();
            
            if (verifyResponse.ok) {
              alert(`Payment successful! Credits added: ${result.credits_added || '100'}`);
              window.location.reload(); // Refresh to show new credits
            } else {
              alert('Payment verification failed: ' + result.message);
            }
          } catch (verifyError) {
            console.error('Verification Request Error:', verifyError);
            alert('Verification failed. Backend might be down.');
          }
        },
        prefill: {
          contact: phoneNumber
        },
        theme: {
          color: "#3399cc"
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Payment initialization error:', error);
      alert('Error: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="pricing-section" id="pricing">
      <div className="container">
        <div className="pricing-container">
          <h2 className="pricing-heading">Simple pricing</h2>
          
          <div className="phone-input-container" style={{ marginBottom: '30px', textAlign: 'center' }}>
            <label htmlFor="phone" style={{ display: 'block', marginBottom: '10px', color: '#666' }}>
              Enter phone number for credit allocation:
            </label>
            <input
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g. 9876543210"
              style={{ 
                padding: '12px 20px', 
                borderRadius: '8px', 
                border: '1px solid #ddd',
                fontSize: '16px',
                width: '100%',
                maxWidth: '300px'
              }}
            />
          </div>
          
          <div className="toggle-container">
            <span className={!isYearly ? 'toggle-label active' : 'toggle-label'}>Monthly</span>
            <button 
              className={`toggle-switch ${isYearly ? 'yearly' : ''}`}
              onClick={() => setIsYearly(!isYearly)}
              aria-label="Toggle billing period"
            >
              <span className="toggle-slider"></span>
            </button>
            <span className={isYearly ? 'toggle-label active' : 'toggle-label'}>Yearly</span>
          </div>

          <div className="pricing-cards">
            {plans.map((plan, index) => (
              <div 
                key={index}
                className={`pricing-card ${plan.isPro ? 'pro-card' : ''}`}
              >
                <div className={`card-top-section ${plan.isPro ? 'pro-top' : ''}`}>
                  {plan.isPro && (
                    <div className="popular-badge">(Most Popular)</div>
                  )}
                  <div className="card-header">
                    <h3 className="plan-name">{plan.name}</h3>
                    <div className="plan-price">
                      <span className="price-amount">
                        ${isYearly && plan.price > 0 ? (plan.price * 12 * 0.8).toFixed(0) : plan.price === 0 ? '0' : plan.price.toFixed(plan.price % 1 === 0 ? 0 : 2)}
                      </span>
                      <span className="price-period">/{isYearly ? 'Year' : 'Month'}</span>
                    </div>
                    <p className="plan-subtitle">{plan.subtitle}</p>
                  </div>
                  
                  <button 
                    className={`plan-button ${plan.buttonStyle}`}
                    onClick={() => plan.price > 0 ? handlePayment(plan.packageId, plan.name) : alert('Free plan active')}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : plan.buttonText}
                  </button>
                </div>
                
                <ul className="plan-features">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>{feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;