const express = require('express');
const router = express.Router();

// Hardcoded user for demonstration
const mockUser = {
    username: 'testuser',
    password: 'password123'
};

// @route   POST /api/auth/login
// @desc    Authenticate user
// @access  Public
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    if (username === mockUser.username && password === mockUser.password) {
        // In a real app, you would return a JWT token here
        res.json({
            success: true,
            msg: 'Login successful'
        });
    } else {
        res.status(401).json({ msg: 'Invalid credentials' });
    }
});

module.exports = router;