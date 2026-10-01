const User = require('../models/User');

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: 'System Administrator',
        email: 'admin@gramacare.org',
        phone: '9999999999',
        password: 'Admin@12345',
        role: 'admin',
        isActive: true
      });
      console.log('[Seed] Default Administrator created: admin@gramacare.org / Admin@12345');
    }
  } catch (error) {
    console.error('[Seed] Admin seeding error:', error.message);
  }
};

module.exports = seedAdmin;
