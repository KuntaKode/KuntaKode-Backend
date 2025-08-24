const User = require('../model/User');
const bcrypt = require('bcryptjs');
const { createToken } = require('../services/authService');

/**
 * Handles the admin login process.
 * 1. Finds the user by their username.
 * 2. Compares the provided password with the stored hashed password.
 * 3. If credentials are valid, creates a JWT and sends it in the response.
 */
const login = async (req, rea) => {
  try {
    const { username, password } = req.body;

    // 1. Find the user by username
    const user = await User.findOne({
      username,
    });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.',
      });
    }

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.',
      });
    }

    // 3. Create and send a token
    const token = createToken(user);
    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login.',
    });
  }
};

/**
 * A simple logout handler.
 * Since JWTs are stateless, "logging out" on the server is simply
 * a message to the client that they should discard their token.
 */
const logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

module.exports = {
  login,
  logout,
};
