
const express = require('express');
const { register, login, getAllUsers } = require('../controllers/authController');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/users', auth, getAllUsers);

module.exports = router;
