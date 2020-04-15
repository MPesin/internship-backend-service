import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from '../config/db.js';
import colors from 'colors';
import errorHandler from './middleware/error.js';

// route files
import internships from './routes/internships.js';
import companies from './routes/companies.js';


// load env vars
dotenv.config({
  path: './config/config.env'
});

// connect to database
connectDB();

const app = express();

// body parser
app.use(express.json())

// set logging middleware using the morgan logger in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// mount routers
app.use('/api/v1/internships', internships)
app.use('/api/v1/companies', companies)

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