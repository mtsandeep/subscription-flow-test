import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Coupon Page - Step 3/4
 *
 * TODO: Allow user to apply a coupon code (optional)
 *
 * AVAILABLE COUPONS (from database):
 * - WELCOME10: 10% off (max 100 uses)
 * - SUPER50: 50% off (max 5 uses)
 * 
 * REQUIREMENTS:
 * - Allow user to apply a coupon code (optional)
 * - If user refreshes in this page, they should go back to profile with filled data
 * 
 * HINT: Store the validated coupon info for the summary page
 */
function Coupon() {
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [validatedCoupon, setValidatedCoupon] = useState(null);

  // TODO: Implement coupon state
  const couponError = null;

  const handleApplyCoupon = async () => {
    // TODO: Call POST /api/validate-coupon
    console.log('Validating coupon:', couponCode);

    setValidatedCoupon(
      couponCode === 'WELCOME10'
        ? {
            code: 'WELCOME10',
            discountPercent: 10,
            remainingUses: 100,
          }
        : couponCode === 'SUPER50'
          ? {
              code: 'SUPER50',
              discountPercent: 50,
              remainingUses: 5,
            }
          : null,
    );
  };

  const handleBack = () => {
    navigate('/plan');
  };

  const handleSkip = () => {
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
            className="btn-secondary px-6"
          >
            Apply
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

        {validatedCoupon && (
          <div className="bg-primary/20 border-2 border-brutal-black p-4 mb-6 mt-6 shadow-brutal-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary font-bold flex items-center gap-2">
                  <span>&#10003;</span>
                  Coupon Applied!
                </p>
                <p className="text-gray-200 text-sm">
                  {validatedCoupon.discountPercent}% off your subscription
                </p>
                <p className="text-gray-400 text-xs">
                  {validatedCoupon.remainingUses} uses remaining after yours
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-primary">
                  -{validatedCoupon.discountPercent}%
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
