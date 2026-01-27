const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI =
  'mongodb+srv://samuelezekiel488_db_user:cdssdb@cdss.bqgevct.mongodb.net/?appName=CDSS';

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    const UserSchema = new mongoose.Schema(
      {
        email: String,
        password: { type: String, select: false },
        firstName: String,
        lastName: String,
        role: String,
        isVerified: Boolean,
        isActive: Boolean,
      },
      { timestamps: true }
    );

    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    const adminEmail = 'cdssoau@gmail.com';
    const adminPassword = 'CDSSADMIN2026';

    const existing = await User.findOne({ email: adminEmail });
    if (!existing) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await User.create({
        email: adminEmail,
        password: hashedPassword,
        firstName: 'CDSS',
        lastName: 'Admin',
        role: 'ADMIN',
        isVerified: true,
        isActive: true,
      });
      console.log('✅ Admin user added to MongoDB successfully.');
    } else {
      console.log('ℹ️ Admin user already exists.');
    }
  } catch (err) {
    console.error('❌ Error seeding admin:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
