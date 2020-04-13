import mongoose from 'mongoose';

const RequirementSchema = new mongoose.Schema({
  requirement: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Requirement text is limited to 100 charachters']
  },
  type: {
    type: String,
    required: true,
    enum: [
      'must',
      'advantage',
      'optional'
    ]
  }
});

export const InternshipSchema = new mongoose.Schema({
  jobId: {
    type: Number,
    default: 0,
  },
  field: {
    type: String,
    required: [true, 'Please add a field'],
    unique: true,
    trim: true,
    maxlength: [50, 'Field cannot be more than 50 charachters']
  },
  description: {
    type: String,
    required: [true, 'Please add description'],
    unique: true,
    trim: true,
    maxlength: [600, 'Description text is limited to 600 charachters']
  },

  address: {
    type: String,
    required: [true, 'Please Enter address']
  },
  location: { // GeoJSON
    type: {
      type: String,
      enum: ['Point'],
      required: false
    },
    coordinates: {
      type: [Number],
      required: false,
      index: '2dsphere'
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String
  },
  requirements: {
    type: [RequirementSchema],
    required: true
  },
  estimatedEmploymentTime: {
    type: Number,
    required: true,
    min: [3, 'Internship must be at least 3 months'],
    max: [12, 'Internship must be no longer than 12 months (1 year)']
  },
  createdOn: {
    type: Date,
    default: Date.now
  }
});