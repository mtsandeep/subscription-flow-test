/**
 * API Index
 * Exports all API modules for easy importing
 */

export { default as api } from './axios';
export { plansApi } from './plans';
export { usersApi } from './users';
export { couponsApi } from './coupons';
export { subscriptionsApi } from './subscriptions';

// Default export with all APIs
export default {
  plans: await import('./plans').then(m => m.plansApi),
  users: await import('./users').then(m => m.usersApi),
  coupons: await import('./coupons').then(m => m.couponsApi),
  subscriptions: await import('./subscriptions').then(m => m.subscriptionsApi),
};
