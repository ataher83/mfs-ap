const express = require('express');
const { register, login, balance } = require('../controllers/user');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/balance', auth, balance);

module.exports = router;
