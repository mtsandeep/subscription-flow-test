import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { subscriptionsApi } from '../api/subscriptions';
import { useSubscription } from '../context/SubscriptionContext';

/**
 * Summary Page - Step 4/4
 */
function Summary() {
  const navigate = useNavigate();
  const { user, plan, coupon, setUser, clearSelections } = useSubscription();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redirect if missing critical context data (e.g. refreshed the page)
  if (!user || !plan) {
    return <Navigate to="/profile" replace />;
  }

  // Format price to INR
  const formatPrice = (paise) => {
    const rupees = paise / 100;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(rupees);
  };

  // Calculate final price
  const discountAmount = coupon ? Math.floor((plan.price * coupon.discount_percent) / 100) : 0;
  const finalPrice = plan.price - discountAmount;

  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await subscriptionsApi.subscribe({
        user_id: user.id,
        plan_id: plan.id,
        coupon_id: coupon?.id || null,
      });

      // On success, update user with new subscription info 
      setUser({ ...user, subscription: response.subscription });
      
      // Clear plan and coupon from context so user doesn't accidentally re-trigger the flow immediately
      clearSelections();
      
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to complete subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/coupon');
  };

  return (
    <div className="brutal-card">
      {/* Card Header */}
      <div className="mb-8">
        <div className="inline-block bg-secondary px-3 py-1 border-2 border-brutal-black shadow-brutal-sm mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-white">Step 4 of 4</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Order Summary</h2>
        <p className="text-gray-400">Review your order before completing</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border-2 border-brutal-black p-4 mb-6 shadow-brutal-sm">
          <p className="text-white font-bold flex items-center gap-2">
            <span>&#9888;</span>
            {error}
          </p>
        </div>
      )}

      {/* Order Details */}
      <div className="space-y-3 mb-8">
        {/* User Info */}
        <div className="flex justify-between items-center py-2 px-4 bg-dark border-2 border-brutal-black">
          <span className="text-gray-400 text-sm">User</span>
          <div className="text-right">
            <span className="font-medium text-white block">{user.name}</span>
            <span className="text-gray-500 text-xs">@{user.username}</span>
          </div>
        </div>

        {/* Plan */}
        <div className="flex justify-between items-center py-4 px-4 bg-dark border-2 border-brutal-black">
          <span className="text-gray-400 text-sm">Plan</span>
          <span className="font-medium text-white">{plan.name}</span>
        </div>

        {/* Pricing */}
        <div className="flex justify-between items-center py-4 px-4 bg-dark border-2 border-brutal-black">
          <span className="text-gray-400 text-sm">Price</span>
          <span className="font-medium text-white">{formatPrice(plan.price)}</span>
        </div>

        {/* Discount */}
        {coupon && (
          <div className="flex justify-between items-center py-4 px-4 bg-primary border-2 border-brutal-black">
            <span className="text-brutal-black text-sm font-bold">Discount ({coupon.code})</span>
            <span className="font-bold text-brutal-black">
              -{formatPrice(discountAmount)}
            </span>
          </div>
        )}

        {/* Final Price */}
        <div className="flex justify-between items-center py-4 px-4 bg-secondary border-2 border-brutal-black shadow-brutal-lg">
          <span className="text-white text-sm font-bold">Total</span>
          <span className="text-2xl font-bold text-white">
            {formatPrice(finalPrice)}
          </span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <button 
          onClick={handleBack} 
          disabled={loading}
          className="btn-outline flex-1 disabled:opacity-50"
        >
          Back
        </button>
        <button 
          onClick={handleSubscribe} 
          disabled={loading}
          className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Complete Purchase'}
        </button>
      </div>
    </div>
  );
}

export default Summary;
