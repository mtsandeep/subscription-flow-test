import express from 'express';
import cors from 'cors';
import { validateCoupon, getCoupons } from './routes/coupons.js';
import { subscribe } from './routes/subscriptions.js';
import { getUserByUsername, createUser } from './routes/users.js';
import { getPlans, getPlanById } from './routes/plans.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Users routes (minimal - just create and lookup by username)
app.get('/api/users/:username', getUserByUsername);
app.post('/api/users', createUser);

// Plans routes (read-only - plans are seeded in database)
app.get('/api/plans', getPlans);
app.get('/api/plans/:id', getPlanById);

// Coupons routes
app.get('/api/coupons', getCoupons);
app.post('/api/coupons/validate', validateCoupon);

// Subscription routes
app.post('/api/subscriptions/subscribe', subscribe);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
