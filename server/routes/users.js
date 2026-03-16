import db from '../db.js';

/**
 * GET /api/users/:username - Get user by username
 */
export function getUserByUsername(req, res) {
  const { username } = req.params;

  try {
    const user = db.query('SELECT * FROM users WHERE username = ?').get(username);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * POST /api/users - Create new user
 */
export function createUser(req, res) {
  const { username, name, age, weight, height } = req.body;

  // Validate required fields
  if (!username || !name) {
    return res.status(400).json({ error: 'Username and name are required' });
  }

  try {
    // Check if username already exists
    const existingUser = db.query('SELECT id FROM users WHERE username = ?').get(username);
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // Insert new user
    const result = db.query(`
      INSERT INTO users (username, name, age, weight, height)
      VALUES (?, ?, ?, ?, ?)
    `).run(username, name, age || null, weight || null, height || null);

    // Fetch the created user
    const user = db.query('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({ success: true, user });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
