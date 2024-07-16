const jwt = require('jsonwebtoken');
const { getDB } = require('../config/db');

const auth = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const db = getDB();
    req.user = await db.collection('users').findOne({ _id: decoded.user.id });
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = auth;
