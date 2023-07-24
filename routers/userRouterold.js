const User = require('../models/user');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

console.log("router is loaded");

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1]; // Get the token from the Authorization header
  if (!token) return res.status(401).json({ error: 'Access denied. Token not provided.' });

  const secretKey = 'your_secret_key'; // Replace 'your_secret_key' with your actual secret key

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token.' });

    req.user = user;
    next();
  });
}

// API to get all users (protected with JWT authentication)
router.get('/usercreate', authenticateToken, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users.', message: err.message });
  }
});

// API to get user details by ID (protected with JWT authentication)
router.get('/user-details/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user details.', message: err.message });
  }
});

// API to create a new user (protected with JWT authentication)
router.post('/userpost', authenticateToken, async (req, res) => {
  console.log(req.body);
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    number: req.body.number,
    rollnumber: req.body.rollnumber
  });

  try {
    const userpost = await user.save();
    res.json(userpost);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user.', message: err.message });
  }
});

// API to update user data by ID (protected with JWT authentication)
router.patch('/update/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    user.set(req.body);
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user.', message: err.message });
  }
});

// API to delete user by ID (protected with JWT authentication)
router.delete('/delete/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user.', message: err.message });
  }
});

module.exports = router;
