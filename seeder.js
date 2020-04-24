// A standlone seeder to load all the '_data' files to the database.
import fs from 'fs';
// import mongoose from 'mongoose';
import coloers from 'colors';
import connectDB from './config/db.js';
import companyModel from './src/models/companyModel.js';

// connect database
connectDB();

// load data from file
const companies = loadJsonDataFromFile('Companies');

// start main
main();

// methodes

async function main() {
  if (process.argv.includes('-l')) {
    await loadData(companyModel, companies);
  } else if (process.argv.includes('-d')) {
    await deleteAllData(companyModel);
  } else {
    console.log('flags :\n-l - to load data to database\n-d - to delete all data from the database');
  }
  process.exit();
}

function loadJsonDataFromFile(dataName) {
  return JSON.parse(fs.readFileSync(`${process.cwd()}/_data/${dataName}.json`));
}

async function loadData(model, data) {
  try {
    console.log('Loading Data...'.green);
    await model.create(data);
    console.log('Data Loaded to the Database'.bgGreen);
  } catch (error) {
    console.error(error);
  }
}

async function deleteAllData(model) {
  try {
    console.log('Deleting Data...'.red);
    await model.deleteMany();
    console.log('All the Data Deleted from the Database'.bgRed);
  } catch (error) {
    console.error(error);
  }
}