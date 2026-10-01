const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

const seedDemoData = async () => {
  try {
    // 1. Seed Demo Approved Doctor
    let demoDoctor = await User.findOne({ email: 'dr_sharma@ruralhealth.org' });
    if (!demoDoctor) {
      demoDoctor = await User.create({
        name: 'Dr. Priya Sharma',
        email: 'dr_sharma@ruralhealth.org',
        phone: '9812345678',
        password: 'Password@123',
        role: 'doctor',
        isActive: true
      });

      await Doctor.create({
        userId: demoDoctor._id,
        specialization: 'General Medicine & Family Health',
        qualification: 'MBBS, MD',
        experienceYears: 10,
        licenseNumber: 'MCI-2016-784920',
        hospitalOrClinic: 'Rampur Primary Health Centre',
        consultationFee: 50,
        availability: [
          { dayOfWeek: 'Monday', startTime: '09:00', endTime: '13:00' },
          { dayOfWeek: 'Tuesday', startTime: '09:00', endTime: '13:00' },
          { dayOfWeek: 'Wednesday', startTime: '09:00', endTime: '13:00' },
          { dayOfWeek: 'Thursday', startTime: '09:00', endTime: '13:00' },
          { dayOfWeek: 'Friday', startTime: '09:00', endTime: '13:00' },
          { dayOfWeek: 'Saturday', startTime: '09:00', endTime: '12:00' }
        ],
        approvalStatus: 'approved' // Approved for instant consultation
      });
      console.log('[Seed] Demo Approved Doctor seeded: dr_sharma@ruralhealth.org / Password@123');
    }

    // 2. Seed Demo Patient
    let demoPatient = await User.findOne({ email: 'ramesh_patel@ruralhealth.org' });
    if (!demoPatient) {
      demoPatient = await User.create({
        name: 'Ramesh Patel',
        email: 'ramesh_patel@ruralhealth.org',
        phone: '9876543210',
        password: 'Password@123',
        role: 'patient',
        isActive: true
      });

      await Patient.create({
        userId: demoPatient._id,
        dateOfBirth: new Date('1988-06-15'),
        gender: 'male',
        bloodGroup: 'B+',
        address: {
          village: 'Rampur',
          district: 'Dhar',
          state: 'Madhya Pradesh',
          pincode: '454001'
        },
        emergencyContact: {
          name: 'Suresh Patel',
          phone: '9811223344',
          relation: 'Brother'
        },
        allergies: ['Penicillin', 'Dust'],
        existingConditions: ['Hypertension']
      });
      console.log('[Seed] Demo Patient seeded: ramesh_patel@ruralhealth.org / Password@123');
    }
  } catch (error) {
    console.error('[Seed] Demo data seeding error:', error.message);
  }
};

module.exports = seedDemoData;
