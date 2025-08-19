const jwt = require('jsonwebtoken');

/**
 * Creates a JSON Web Token (JWT) for a user.
 * The token contains the user's ID and role.
 * It is signed with a secret key from the environment variables and expires in 1 hour.
 * @param {object} user - The user object from the database.
 * @returns {string} The created JWT.
 */
const createToken = (user) => {
  const payload = {
    id: user._id,
    role: user.role,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

/**
 * Verifies a JWT.
 * It checks if the token is valid and hasn't expired.
 * @param {string} token - The JWT to verify.
 * @returns {object|null} The decoded token payload if valid, otherwise null.
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  createToken,
  verifyToken,
};
