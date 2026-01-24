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

async function checkDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to:', mongoose.connection.name);
    const cols = await mongoose.connection.db.listCollections().toArray();
    console.log(
      'Collections:',
      cols.map((c) => c.name)
    );
    for (const col of cols) {
      const count = await mongoose.connection.db.collection(col.name).countDocuments();
      console.log(`- ${col.name}: ${count} docs`);
      if (count > 0) {
        const sample = await mongoose.connection.db.collection(col.name).findOne();
        console.log(`  Sample from ${col.name}:`, JSON.stringify(sample, null, 2));
      }
    }
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

checkDB();
