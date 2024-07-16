const { getDB } = require('./db');
const bcrypt = require('bcryptjs');

const createUser = async (user) => {
  const db = getDB();
  const salt = await bcrypt.genSalt(10);
  user.pin = await bcrypt.hash(user.pin, salt);
  await db.collection('users').insertOne(user);
};

const findUserByIdentifier = async (identifier) => {
  const db = getDB();
  return await db.collection('users').findOne({ $or: [{ mobile: identifier }, { email: identifier }] });
};

const updateUser = async (query, update) => {
  const db = getDB();
  await db.collection('users').updateOne(query, { $set: update });
};

module.exports = { createUser, findUserByIdentifier, updateUser };
