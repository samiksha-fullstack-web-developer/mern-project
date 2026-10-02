require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/Users');

const [, , username, email, phone, password] = process.argv;

if (!username || !email || !phone || !password) {
  console.error('Usage: node createAdmin.js <username> <email> <phone> <password>');
  process.exit(1);
}

async function createAdmin() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: username.trim() }],
    });

    if (existingUser) throw new Error('Email or username already exists');

    await User.create({
      username: username.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      password: await bcrypt.hash(password, 12),
      role: 'admin',
    });

    console.log(`Admin created: ${normalizedEmail}`);
  } catch (error) {
    console.error(`Failed to create admin: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();