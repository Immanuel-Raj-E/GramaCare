const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const generateToken = require('../utils/generateToken');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Register a new patient or doctor
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role = 'patient',
      // Patient fields
      dateOfBirth,
      gender,
      bloodGroup,
      village,
      district,
      state,
      pincode,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelation,
      allergies,
      existingConditions,
      // Doctor fields
      specialization,
      qualification,
      experienceYears,
      licenseNumber,
      hospitalOrClinic,
      consultationFee
    } = req.body;

    // 1. Basic validation
    if (!name || !email || !phone || !password) {
      return errorResponse(res, 400, 'Please provide all required fields: name, email, phone, and password');
    }

    if (password.length < 8) {
      return errorResponse(res, 400, 'Password must be at least 8 characters long');
    }

    if (!['patient', 'doctor'].includes(role)) {
      return errorResponse(res, 400, 'Invalid registration role. Allowed roles: patient, doctor');
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return errorResponse(res, 400, 'An account with this email address already exists');
    }

    // 3. Doctor-specific validation
    if (role === 'doctor') {
      if (!specialization || !qualification || !licenseNumber || !hospitalOrClinic) {
        return errorResponse(
          res,
          400,
          'Doctor registration requires specialization, qualification, license number, and clinic/hospital affiliation'
        );
      }

      const existingLicense = await Doctor.findOne({ licenseNumber });
      if (existingLicense) {
        return errorResponse(res, 400, 'A doctor account with this license number already exists');
      }
    }

    // 4. Create User
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role,
      isActive: true
    });

    let profile = null;

    // 5. Create Role-specific Profile
    if (role === 'patient') {
      profile = await Patient.create({
        userId: user._id,
        dateOfBirth: dateOfBirth || null,
        gender: gender || 'male',
        bloodGroup: bloodGroup || 'Unknown',
        address: {
          village: village || '',
          district: district || '',
          state: state || '',
          pincode: pincode || ''
        },
        emergencyContact: {
          name: emergencyContactName || '',
          phone: emergencyContactPhone || '',
          relation: emergencyContactRelation || ''
        },
        allergies: Array.isArray(allergies) ? allergies : (allergies ? [allergies] : []),
        existingConditions: Array.isArray(existingConditions) ? existingConditions : (existingConditions ? [existingConditions] : [])
      });
    } else if (role === 'doctor') {
      profile = await Doctor.create({
        userId: user._id,
        specialization,
        qualification,
        experienceYears: Number(experienceYears) || 0,
        licenseNumber,
        hospitalOrClinic,
        consultationFee: Number(consultationFee) || 0,
        approvalStatus: 'pending' // Mandatory: Doctors require admin approval
      });
    }

    // 6. Generate Token
    const token = generateToken(user._id, user.role);

    return successResponse(res, 201, 'Registration successful', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive
      },
      profile,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    return errorResponse(res, 500, error.message || 'Server error during registration');
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 400, 'Please provide both email and password');
    }

    // Find user including password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    if (!user.isActive) {
      return errorResponse(res, 403, 'Your account has been deactivated. Please contact support.');
    }

    // Fetch role profile
    let profile = null;
    if (user.role === 'patient') {
      profile = await Patient.findOne({ userId: user._id });
    } else if (user.role === 'doctor') {
      profile = await Doctor.findOne({ userId: user._id });
    }

    const token = generateToken(user._id, user.role);

    return successResponse(res, 200, 'Login successful', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive
      },
      profile,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse(res, 500, error.message || 'Server error during login');
  }
};

// @desc    Get current authenticated user info
// @route   GET /api/auth/me
// @access  Protected
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    let profile = null;
    if (user.role === 'patient') {
      profile = await Patient.findOne({ userId: user._id });
    } else if (user.role === 'doctor') {
      profile = await Doctor.findOne({ userId: user._id });
    }

    return successResponse(res, 200, 'User profile fetched successfully', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive
      },
      profile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return errorResponse(res, 500, error.message || 'Server error fetching user details');
  }
};

// @desc    Logout user / clear session
// @route   POST /api/auth/logout
// @access  Protected
const logout = async (req, res) => {
  return successResponse(res, 200, 'Logout successful');
};

module.exports = {
  register,
  login,
  getMe,
  logout
};
