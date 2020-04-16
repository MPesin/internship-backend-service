import mongoose from 'mongoose';
import {
  InternshipSchema
} from './InternshipScheme.js';

const CompanySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 charachters']
  },
  slug: String,
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please enter a valid url'
    ]
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone number must be up to 20 charachters']
  },
  email: {
    type: String,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please enter a vailid email'
    ]
  },
  photo: {
    type: String, // file name
    default: 'no-photo.jpg'
  },
  internships: {
    type: [InternshipSchema]
  }
}, {
  timestamps: true
});

export default mongoose.model('Company', CompanySchema);