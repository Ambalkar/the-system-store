const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// POST /api/admin/create-admin - Create admin user (single use, for setup)
router.post('/create-admin', async (req, res) => {
  try {
    const { name, email, password, secretKey } = req.body;
    
    // Simple secret key check to prevent unauthorized admin creation
    const ADMIN_SECRET = process.env.ADMIN_SECRET || 'admin-secret-key';
    if (secretKey !== ADMIN_SECRET) {
      return res.status(403).json({ message: 'Invalid secret key' });
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Create admin user
    const user = new User({ name, email, password, role: 'admin' });
    await user.save();

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Admin created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
