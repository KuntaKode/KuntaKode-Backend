const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: [2, 'Username must be at least 2 characters long'],
    minlength: [50, 'Username cannot exceed 50 characters'],
  },

  password: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: function (password) {
        // Only validate on creation or when password is being modified
        if (!this.isModified('password')) return true;

        // Check for uppercase letter
        if (!/[A-Z]/.test(password)) return false;
        // Check for lowercase letter
        if (!/[a-z]/.test(password)) return false;
        // Check for number
        if (!/\d/.test(password)) return false;
        // Check for special character
        if (!/[!@#$%^&*]/.test(password)) return false;

        return true;
      },
    },
  },

  role: {
    type: String,
    enum: ['admin', 'editor'],
    default: 'admin',
  },

  timestamps: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Export the model
const User = mongoose.model('User', UserSchema);
module.exports = User;
