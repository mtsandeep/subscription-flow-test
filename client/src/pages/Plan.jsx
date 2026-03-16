import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Plan Page - Step 2/4
 *
 * TODO: Allow user to select a gym subscription plan
 * 
 * REQUIREMENTS:
 * - Display available plans with price
 * - Allow user to select a plan
 * - Plan should be selected to continue to next page
 * - if user refreshes in this page, they should go back to profile with filled data
 * 
 * HINT: How will you store the selected plan for later pages?
 */

// Static plan details (description and features)
const PLAN_DETAILS = {
  Basic: {
    description: 'Gym Access',
    features: [
      'Full gym access (6 AM - 10 PM)',
      'All equipment & machines',
      'Locker room & showers',
      'Free WiFi',
    ],
  },
  Pro: {
    description: 'with Personal Trainer',
    features: [
      'Everything in Basic',
      'Personal trainer (2 sessions/week)',
      'Diet & nutrition consultation',
      'Priority slot booking',
    ],
  },
};

// TODO: Replace with API call to GET /api/plans
// Mock plan data from API (id, name, price)
const PLANS = [
  {
    id: 1,
    name: 'Basic',
    price: 149900, // ₹1,499 in paise
  },
  {
    id: 2,
    name: 'Pro',
    price: 299900, // ₹2,999 in paise
  },
];

// Helper to merge API plans with static details
const mergePlansWithDetails = (plans) => {
  return plans.map((plan) => ({
    ...plan,
    ...PLAN_DETAILS[plan.name],
  }));
};

function Plan() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);

  // TODO: Fetch plans from API and merge with PLAN_DETAILS
  const plans = mergePlansWithDetails(PLANS);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
  };

  const handleBack = () => {
    navigate('/profile');
  };

  const handleContinue = () => {
    // TODO: Check if plan is selected before continuing
    navigate('/coupon');
  };

  // Format price to INR
  const formatPrice = (paise) => {
    const rupees = paise / 100;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(rupees);
  };

  return (
    <div className="brutal-card">
      {/* Card Header */}
      <div className="mb-8">
        <div className="inline-block bg-primary px-3 py-1 border-2 border-brutal-black shadow-brutal-sm mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brutal-black">Step 2 of 4</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Choose Your Plan</h2>
        <p className="text-gray-400">Select the gym membership that fits your fitness goals</p>
      </div>

      {/* Plan Cards */}
      <div className="space-y-6 mb-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => handleSelectPlan(plan)}
            className={`relative p-6 border-2 border-brutal-black cursor-pointer transition-all duration-150
              ${selectedPlan?.id === plan.id
                ? 'bg-primary shadow-brutal translate-x-0.5 translate-y-0.5'
                : 'bg-dark-lighter shadow-brutal hover:shadow-brutal-hover hover:translate-x-0.5 hover:translate-y-0.5'
              }`}
          >
            {/* Selection indicator */}
            <div className={`absolute top-4 right-4 w-6 h-6 border-2 border-brutal-black flex items-center justify-center
              ${selectedPlan?.id === plan.id ? 'bg-brutal-black' : 'bg-transparent'}`}
            >
              {selectedPlan?.id === plan.id && (
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>

            {/* Plan info */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-2xl font-bold ${selectedPlan?.id === plan.id ? 'text-brutal-black' : 'text-white'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm ${selectedPlan?.id === plan.id ? 'text-brutal-black/70' : 'text-gray-400'}`}>
                  {plan.description}
                </p>
              </div>
              <div className="text-right pr-10">
                <span className={`text-3xl font-bold ${selectedPlan?.id === plan.id ? 'text-brutal-black' : 'text-primary'}`}>
                  {formatPrice(plan.price)}
                </span>
                <span className={`text-sm block ${selectedPlan?.id === plan.id ? 'text-brutal-black/70' : 'text-gray-400'}`}>
                  /month
                </span>
              </div>
            </div>

            {/* Features */}
            <div className="mt-4 pt-4 border-t border-brutal-black/20">
              <ul className="space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className={`flex items-center gap-2 text-sm ${selectedPlan?.id === plan.id ? 'text-brutal-black' : 'text-gray-300'}`}>
                    <span className={`${selectedPlan?.id === plan.id ? 'text-brutal-black' : 'text-primary'} font-bold`}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro badge */}
            {plan.id === 2 && (
              <div className={`absolute -top-3 -left-3 px-3 py-1 text-xs font-bold uppercase tracking-wider border-2 border-brutal-black shadow-brutal-sm ${
                selectedPlan?.id === plan.id ? 'bg-accent text-brutal-black' : 'bg-secondary text-white'
              }`}>
                Popular
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <button onClick={handleBack} className="btn-outline flex-1">
          Back
        </button>
        <button onClick={handleContinue} className="btn-primary flex-1">
          Continue
        </button>
      </div>
    </div>
  );
}

export default Plan;
