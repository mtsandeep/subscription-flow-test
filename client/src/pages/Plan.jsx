import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { plansApi } from '../api/plans';
import { useSubscription } from '../context/SubscriptionContext';

/**
 * Plan Page - Step 2/4
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

// Helper to merge API plans with static details
const mergePlansWithDetails = (plansList) => {
  return plansList.map((plan) => ({
    ...plan,
    ...(PLAN_DETAILS[plan.name] || { description: '', features: [] }),
  }));
};

function Plan() {
  const navigate = useNavigate();
  const { user, plan: contextPlan, setPlan } = useSubscription();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await plansApi.getAll();
        setPlans(mergePlansWithDetails(data.plans || []));
      } catch (err) {
        setError('Failed to fetch plans. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Redirect to profile if no user exists in context (e.g. refreshed page)
  if (!user) {
    return <Navigate to="/profile" replace />;
  }

  const handleSelectPlan = (plan) => {
    setPlan(plan);
  };

  const handleBack = () => {
    navigate('/profile');
  };

  const handleContinue = () => {
    if (contextPlan) {
      navigate('/coupon');
    }
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

      {loading ? (
        <div className="text-white text-center py-8">Loading plans...</div>
      ) : error ? (
        <div className="bg-red-500/10 border-2 border-brutal-black p-4 mb-6 shadow-brutal-sm">
          <p className="text-white font-bold">{error}</p>
        </div>
      ) : (
        <div className="space-y-6 mb-8">
          {plans.map((planOption) => (
            <div
              key={planOption.id}
              onClick={() => handleSelectPlan(planOption)}
              className={`relative p-6 border-2 border-brutal-black cursor-pointer transition-all duration-150
                ${contextPlan?.id === planOption.id
                  ? 'bg-primary shadow-brutal translate-x-0.5 translate-y-0.5'
                  : 'bg-dark-lighter shadow-brutal hover:shadow-brutal-hover hover:translate-x-0.5 hover:translate-y-0.5'
                }`}
            >
              {/* Selection indicator */}
              <div className={`absolute top-4 right-4 w-6 h-6 border-2 border-brutal-black flex items-center justify-center
                ${contextPlan?.id === planOption.id ? 'bg-brutal-black' : 'bg-transparent'}`}
              >
                {contextPlan?.id === planOption.id && (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>

              {/* Plan info */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className={`text-2xl font-bold ${contextPlan?.id === planOption.id ? 'text-brutal-black' : 'text-white'}`}>
                    {planOption.name}
                  </h3>
                  <p className={`text-sm ${contextPlan?.id === planOption.id ? 'text-brutal-black/70' : 'text-gray-400'}`}>
                    {planOption.description}
                  </p>
                </div>
                <div className="text-right pr-10">
                  <span className={`text-3xl font-bold ${contextPlan?.id === planOption.id ? 'text-brutal-black' : 'text-primary'}`}>
                    {formatPrice(planOption.price)}
                  </span>
                  <span className={`text-sm block ${contextPlan?.id === planOption.id ? 'text-brutal-black/70' : 'text-gray-400'}`}>
                    /month
                  </span>
                </div>
              </div>

              {/* Features */}
              <div className="mt-4 pt-4 border-t border-brutal-black/20">
                <ul className="space-y-2">
                  {planOption.features.map((feature, idx) => (
                    <li key={idx} className={`flex items-center gap-2 text-sm ${contextPlan?.id === planOption.id ? 'text-brutal-black' : 'text-gray-300'}`}>
                      <span className={`${contextPlan?.id === planOption.id ? 'text-brutal-black' : 'text-primary'} font-bold`}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pro badge */}
              {planOption.name === 'Pro' && (
                <div className={`absolute -top-3 -left-3 px-3 py-1 text-xs font-bold uppercase tracking-wider border-2 border-brutal-black shadow-brutal-sm ${
                  contextPlan?.id === planOption.id ? 'bg-accent text-brutal-black' : 'bg-secondary text-white'
                }`}>
                  Popular
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <button onClick={handleBack} className="btn-outline flex-1">
          Back
        </button>
        <button 
          onClick={handleContinue} 
          disabled={!contextPlan}
          className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default Plan;
