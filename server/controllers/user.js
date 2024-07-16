const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createUser, findUserByIdentifier, updateUser } = require('../config/userModel');

exports.register = async (req, res) => {
  const { name, pin, mobile, email } = req.body;
  try {
    let user = await findUserByIdentifier(mobile) || await findUserByIdentifier(email);
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = { name, pin, mobile, email, balance: 0, role: 'user', status: 'pending' };
    await createUser(user);
    res.status(201).json({ msg: 'User registered, pending admin approval' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  const { identifier, pin } = req.body; // identifier can be either mobile or email
  try {
    const user = await findUserByIdentifier(identifier);
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(pin, user.pin);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user._id,
      },
    };

    jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.balance = async (req, res) => {
  res.json({ balance: req.user.balance });
};
