import mongoose from 'mongoose';
import geocoder from '../utils/geocoder.js';
import ErrorResponse from '../utils/ErrorResponse.js';

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
}, {
  _id: false
});

const InternshipScheme = new mongoose.Schema({
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
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    }
  },
  requirements: {
    type: [RequirementSchema],
    required: true
  },
  estimatedEmploymentTime: {
    type: Number,
    required: [true, 'Please enter an estimated time of employment between 3 and 12 months'],
    min: [3, 'Internship must be at least 3 months'],
    max: [12, 'Internship must be no longer than 12 months (1 year)']
  }
}, {
  timestamps: true
});


// check if there's no identical jobId
InternshipScheme.pre('validate', function (next) {
  const allInternships = this.parent().internships;
  const jobIds = allInternships.map(internship => internship.jobId);
  console.log(jobIds);

  if (jobIds.filter(id => id === this.jobId).length > 1) {
    throw new ErrorResponse(`The jobId ${this.jobId} already exists in the database`, 403);
  }
  next();
});

// set the location
// InternshipScheme.pre('save', async function (next) {
//   const location = await geocoder.geocode(this.address);
//   this.location = {
//     type: 'Point',
//     cooedinates: [location[0].longitude, location[0].latitude],
//   }
//   console.log(this.parent());

//   this.address = {
//     formattedAddress: location[0].formattedAddress,
//     street: location[0].street,
//     city: location[0].city,
//     state: location[0].stateCode,
//     zipcode: location[0].zipcode,
//     country: location[0].countryCode
//   };

//   next();
// });

export default InternshipScheme;