import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { couponsApi } from '../api/coupons';
import { useSubscription } from '../context/SubscriptionContext';

/**
 * Coupon Page - Step 3/4
 */
function Coupon() {
  const navigate = useNavigate();
  const { user, plan, coupon, setCoupon } = useSubscription();

  const [couponCode, setCouponCode] = useState(coupon?.code || '');
  const [loading, setLoading] = useState(false);
  const [couponError, setCouponError] = useState(null);

  // Redirect to profile if no user or plan exists (refresh handling)
  if (!user || !plan) {
    return <Navigate to="/profile" replace />;
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setLoading(true);
    setCouponError(null);

    try {
      const response = await couponsApi.validate({ code: couponCode.trim().toUpperCase() });
      setCoupon(response.coupon);
    } catch (err) {
      setCoupon(null);
      setCouponError(err.response?.data?.error || "Invalid coupon code");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/plan');
  };

  const handleSkip = () => {
    setCoupon(null);
    navigate('/summary');
  };

  const handleContinue = () => {
    navigate('/summary');
  };

  return (
    <div className="brutal-card">
      {/* Card Header */}
      <div className="mb-8">
        <div className="inline-block bg-accent px-3 py-1 border-2 border-brutal-black shadow-brutal-sm mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brutal-black">Step 3 of 4</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Apply Coupon</h2>
        <p className="text-gray-400">Have a promo code? Get a discount on your subscription!</p>
      </div>

      {/* Coupon Input */}
      <div className="mb-6">
        <label htmlFor="coupon" className="label-brutal">
          Coupon Code
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            id="coupon"
            value={couponCode}
            onChange={(e) => {
              setCouponCode(e.target.value);
            }}
            placeholder="Enter coupon code"
            className="input-brutal flex-1 uppercase tracking-wider"
          />
          <button
            onClick={handleApplyCoupon}
            disabled={loading}
            className="btn-secondary px-6 disabled:opacity-50"
          >
            {loading ? '...' : 'Apply'}
          </button>
        </div>

        {/* Validation feedback */}
        {couponError && (
          <div className="bg-red-500/10 border-2 border-brutal-black p-4 mb-6 mt-6 shadow-brutal-sm">
            <p className="text-white font-bold flex items-center gap-2">
              <span>&#9888;</span>
              {couponError}
            </p>
          </div>
        )}

        {coupon && (
          <div className="bg-primary/20 border-2 border-brutal-black p-4 mb-6 mt-6 shadow-brutal-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary font-bold flex items-center gap-2">
                  <span>&#10003;</span>
                  Coupon Applied!
                </p>
                <p className="text-gray-200 text-sm">
                  {coupon.discount_percent}% off your subscription
                </p>
                <p className="text-gray-400 text-xs">
                  {coupon.max_uses - coupon.current_uses} uses remaining after yours
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-primary">
                  -{coupon.discount_percent}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Available Coupons Hint */}
      <div className="bg-dark border-2 border-brutal-black p-4 mb-8 shadow-brutal-sm">
        <p className="text-gray-400 text-sm mb-2 font-bold uppercase tracking-wider">Available Coupons:</p>
        <div className="flex flex-wrap gap-2">
          <span className="bg-secondary/20 text-secondary px-3 py-1 border border-secondary/50 font-mono text-sm">
            WELCOME10
          </span>
          <span className="bg-secondary/20 text-secondary px-3 py-1 border border-secondary/50 font-mono text-sm">
            SUPER50
          </span>
        </div>
        <p className="text-gray-500 text-xs mt-2">
          Try one of these codes for a discount!
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <button onClick={handleBack} className="btn-outline flex-1">
          Back
        </button>
        <button onClick={handleSkip} className="btn-outline flex-1">
          Skip
        </button>
        <button onClick={handleContinue} className="btn-primary flex-1">
          Continue
        </button>
      </div>
    </div>
  );
}

export default Coupon;
