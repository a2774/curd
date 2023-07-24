const mongoose = require('mongoose');

// this is import module 
const User  = require('../models/user');
// require express
const express = require('express');
// express and router connection
const router = express.Router();

// import jwt
const jwt = require('jsonwebtoken');
console.log("router is loaded");

router.post('/userpost', async (req, res) => {
  const { name, email, number, rollnumber } = req.body;

  // Check if all required fields are provided
  if (!name || !email || !number || !rollnumber) {
    return res.status(400).json({ error: 'Please provide all required fields.' });
  }

  // Validate email format
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  // Validate name format
  if (!isValidName(name)) {
    return res.status(400).json({ error: 'Invalid name format. Only alphabetic characters are allowed.' });
  }


  // Validate "number" and "rollnumber" (positive integers)
  if (!isValidPositiveInteger(number) || !isValidPositiveInteger(rollnumber)) {
    return res.status(400).json({ error: 'Number and Rollnumber must be positive integers.' });
  }


  // Validate number and rollnumber are numeric
  if (isNaN(number) || isNaN(rollnumber)) {
    return res.status(400).json({ error: 'Number and Rollnumber must be numeric values.' });
  }

  const user = new User({
    name,
    email,
    number,
    rollnumber
  });

  try {
    const userpost = await user.save();
    res.json(userpost);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user.', message: err.message });
  }
});

// Helper function to validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper function to validate "name" format (only alphabetic characters allowed)
function isValidName(name) {
  const nameRegex = /^[A-Za-z]+$/;
  return nameRegex.test(name);
}


// Helper function to validate positive integer
function isValidPositiveInteger(value) {
  const numberRegex = /^[1-9]\d*$/;
  return numberRegex.test(value);
}

router.get('/user-details/:id', async (req, res) => {
  const userId = req.params.id;

  // Check if the provided ID is a valid MongoDB ObjectID
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ error: 'Invalid user ID.' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user details.', message: err.message });
  }
});

router.patch('/update/:id', async (req, res) => {
  const userId = req.params.id;

  // Check if the provided ID is a valid MongoDB ObjectID
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ error: 'Invalid user ID.' });
  }

  try {
    const user = await User.findById(userId);
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

router.delete('/delete/:id', async (req, res) => {
  const userId = req.params.id;

  // Check if the provided ID is a valid MongoDB ObjectID
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ error: 'Invalid user ID.' });
  }

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user.', message: err.message });
  }
});




module.exports = router
