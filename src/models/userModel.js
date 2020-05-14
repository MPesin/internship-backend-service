import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import companyModel from '../models/companyModel.js';


const UserSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    minlength: 1
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    minlength: 1
  },
  email: {
    type: String,
    unique: [true, 'Email already exists'],
    required: [true, 'First name is required'],
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please enter a vailid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    select: false,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['intern', 'recruiter', 'companyAdmin'],
    required: [true, 'Please enter the user role']
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
});

// create virtal property for full name
UserSchema.virtual('fullName')
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  })
  .set(function (value) {
    this.firstName = value.substr(0, value.indexOf(' '));
    this.lastName = value.substr(value.indexOf(' ') + 1);
  });

// encrypt password
UserSchema.pre('save', async function (next) {
  // hash password only if it was changed
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;
});


// sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({
    id: this._id
  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
}

UserSchema.methods.matchPassword = async function (passwordToMatch) {
  return await bcrypt.compare(passwordToMatch, this.password);
}

UserSchema.methods.getResetPasswordToken = function () {
  // generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // hash token and set to field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set password expire to 10 min
  this.resetPasswordExpire = Date.now() + 600000; // 600000 = 10[minutes] * 60[seconds] * 1000[milliseconds]

  return resetToken;
}

const userModel = mongoose.model('User', UserSchema);

export default userModel;