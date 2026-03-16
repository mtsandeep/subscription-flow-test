import db from '../db.js';

/**
 * GET /api/plans - Get all plans
 */
export function getPlans(req, res) {
  try {
    const plans = db.query('SELECT * FROM plans ORDER BY price ASC').all();
    res.json({ plans });
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * GET /api/plans/:id - Get plan by ID
 */
export function getPlanById(req, res) {
  const { id } = req.params;

  try {
    const plan = db.query('SELECT * FROM plans WHERE id = ?').get(id);

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.json({ plan });
  } catch (error) {
    console.error('Error fetching plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
