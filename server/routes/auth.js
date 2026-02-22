
const express = require('express');
const { register, login, getAllUsers, getCurrentUser } = require('../controllers/authController');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/users', auth, getAllUsers);
router.get('/me', auth, getCurrentUser);

module.exports = router;
