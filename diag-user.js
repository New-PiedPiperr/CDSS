const fs = require('fs');
const mongoose = require('mongoose');

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  content.split('\n').forEach((line) => {
    const [key, ...value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.join('=').trim();
    }
  });
}

loadEnv('.env.local');

async function checkUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const User = mongoose.connection.db.collection('users');
    const users = await User.find({}).toArray();
    console.log(
      'All Users:',
      JSON.stringify(
        users.map((u) => ({ email: u.email, isVerified: u.isVerified })),
        null,
        2
      )
    );
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

checkUser();
