import { useNavigate } from 'react-router-dom';

/**
 * Summary Page - Step 4/4
 *
 * TODO: Show order summary and handle subscription
 *
 * REQUIREMENTS:
 * - Display user info (fetch from API or state)
 * - Display selected plan with price
 * - Display applied coupon (if any) with discount
 * - Show final price
 * - On "Buy Now", call POST /api/subscriptions/subscribe
 * - On success, redirect to /profile with success message
 */
function Summary() {
  const navigate = useNavigate();

  // Format price to INR
  const formatPrice = (paise) => {
    const rupees = paise / 100;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(rupees);
  };

  // TODO: Get this data from your state management solution
  const orderSummary = {
    user: { id: 1, username: 'johndoe', name: 'John Doe' },
    plan: { id: 2, name: 'Pro', price: 149900 },
    coupon: null, // or { code: 'WELCOME10', discountPercent: 10 }
    finalPrice: 149900,
  };

  const handleSubscribe = async () => {
    // TODO: Call POST /api/subscriptions/subscribe

    console.log('Subscribe with:', {
      userId: orderSummary.user.id,
      planId: orderSummary.plan.id,
      couponCode: orderSummary.coupon?.code,
    });

    // On success:
    // navigate to profile with details
    navigate('/profile');
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

      {/* Order Details */}
      <div className="space-y-3 mb-8">
        {/* User Info */}
        <div className="flex justify-between items-center py-2 px-4 bg-dark border-2 border-brutal-black">
          <span className="text-gray-400 text-sm">User</span>
          <div className="text-right">
            <span className="font-medium text-white block">{orderSummary.user.name}</span>
            <span className="text-gray-500 text-xs">@{orderSummary.user.username}</span>
          </div>
        </div>

        {/* Plan */}
        <div className="flex justify-between items-center py-4 px-4 bg-dark border-2 border-brutal-black">
          <span className="text-gray-400 text-sm">Plan</span>
          <span className="font-medium text-white">{orderSummary.plan.name}</span>
        </div>

        {/* Pricing */}
        <div className="flex justify-between items-center py-4 px-4 bg-dark border-2 border-brutal-black">
          <span className="text-gray-400 text-sm">Price</span>
          <span className="font-medium text-white">{formatPrice(orderSummary.plan.price)}</span>
        </div>

        {/* Discount */}
        {orderSummary.coupon && (
          <div className="flex justify-between items-center py-4 px-4 bg-primary border-2 border-brutal-black">
            <span className="text-brutal-black text-sm font-bold">Discount</span>
            <span className="font-bold text-brutal-black">
              -{formatPrice(orderSummary.plan.price * orderSummary.coupon.discountPercent / 100)}
            </span>
          </div>
        )}

        {/* Final Price */}
        <div className="flex justify-between items-center py-4 px-4 bg-secondary border-2 border-brutal-black shadow-brutal-lg">
          <span className="text-white text-sm font-bold">Total</span>
          <span className="text-2xl font-bold text-white">
            {formatPrice(orderSummary.finalPrice)}
          </span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <button onClick={handleBack} className="btn-outline flex-1">
          Back
        </button>
        <button onClick={handleSubscribe} className="btn-primary flex-1">
          Complete Purchase
        </button>
      </div>
    </div>
  );
}

export default Summary;
