import React, { createContext, useContext, useState, useEffect } from 'react';

const SubscriptionContext = createContext();

export function useSubscription() {
  return useContext(SubscriptionContext);
}

export function SubscriptionProvider({ children }) {
  // Try to load initial state from sessionStorage
  const getInitialState = () => {
    const saved = sessionStorage.getItem('subscriptionFlow');
    return saved ? JSON.parse(saved) : { user: null, plan: null, coupon: null };
  };

  const [state, setState] = useState(getInitialState);

  // Save state to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('subscriptionFlow', JSON.stringify(state));
  }, [state]);

  const setUser = (user) => setState((prev) => ({ ...prev, user }));
  const setPlan = (plan) => setState((prev) => ({ ...prev, plan }));
  const setCoupon = (coupon) => setState((prev) => ({ ...prev, coupon }));
  
  const resetFlow = () => {
    const newState = { user: null, plan: null, coupon: null };
    setState(newState);
    sessionStorage.removeItem('subscriptionFlow');
  };

  // Keep user but clear flow selections (useful when user wants to restart flow or after successful subscription)
  const clearSelections = () => {
    setState((prev) => ({ ...prev, plan: null, coupon: null }));
  };

  return (
    <SubscriptionContext.Provider
      value={{
        ...state,
        setUser,
        setPlan,
        setCoupon,
        resetFlow,
        clearSelections
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}
