const express = require('express');
const { login, logout } = require('../controller/authController');
const { validateLogin } = require('../validators/authValidator');
const router = express.Router();

// Route for admin login. It uses the validation middleware first.
router.post('/login', validateLogin, login);

// Route for admin logout.
router.post('/logout', logout);

module.exports = router;
