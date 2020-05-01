import mongoose from 'mongoose';
import slugify from 'slugify';

const CompanySchema = new mongoose.Schema({
  name: {
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
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
});

// create a company slug from the name
CompanySchema.pre('save', function (next) {
  this.slug = slugify(this.name, {
    lower: true
  });
  next();
});

// cascade remove internships related to company when it's removed
CompanySchema.pre('remove', async function (next) {
  await this.model('Internship').deleteMany({
    company: this._id
  });
  next
});

CompanySchema.virtual('internships', {
  ref: 'Internship',
  localField: '_id',
  foreignField: 'company',
  justOne: false
});

const companyModel = mongoose.model('Company', CompanySchema);

export default companyModel;