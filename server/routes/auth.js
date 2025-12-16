const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  console.log('Register request received:', req.body);
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ username, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    console.log('User saved:', user.id);

    const payload = { id: user.id };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) {
        console.error('JWT Sign Error:', err);
        throw err;
      }
      res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
    });
  } catch (err) {
    console.error('Register Route Error:', err);
    res.status(500).send('Server Error: ' + err.message);
  }
});

// Login
router.post('/login', async (req, res) => {
  console.log('Login request received:', req.body.email);
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      console.log('Invalid Credentials (User not found):', email);
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid Credentials (Password mismatch):', email);
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const payload = { id: user.id };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) {
        console.error('JWT Sign Error:', err);
        throw err;
      }
      res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
    });
  } catch (err) {
    console.error('Login Route Error:', err);
    res.status(500).send('Server Error: ' + err.message);
  }
});

module.exports = router;
