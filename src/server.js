// import modules
import path from 'path';
import express from 'express';
import morgan from 'morgan';
import colors from 'colors';

// import DB initializer
import connectDB from '../config/db.js';

// import middleware
import errorHandler from './middleware/errorMiddleware.js';

// import router files
import internships from './routes/internshipsRouter.js';
import companies from './routes/companiesRouter.js';

// connect to database
connectDB();

const app = express();

// attach body parser
app.use(express.json());



// set resources folder
app.use(express.static(path.join(getRootDir(), 'resources')));


// set logging middleware using the morgan logger in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// mount routers
app.use('/api/v1/companies', companies);
app.use('/api/v1/internships', internships);

// mount middleware
app.use(errorHandler);

// set port
const PORT = process.env.PORT || 5000;

// start listening on 'PORT'
const server = app.listen(PORT, console.log(`Server Running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold));

// Handle all unhandeled rejections 
process.on('unhandledRejection', (err, promis) => {
  console.log(`Error: ${err.message}`);

  // close and exit server
  server.close(() => process.exit(1))
});

// methods

function getRootDir() {
  const srcDirPath = path.dirname(
    import.meta.url);
  const lastSlashIndex = srcDirPath.lastIndexOf('/');
  return srcDirPath.slice(0, lastSlashIndex)
}