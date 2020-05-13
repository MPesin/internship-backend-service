// A standlone seeder to load all the '_data' files to the database.
import fs from 'fs';
// import mongoose from 'mongoose';
import coloers from 'colors';
import connectDB from './config/db.js';
import companyModel from './src/models/companyModel.js';
import internshipModel from './src/models/internshipModel.js';
import userModel from './src/models/userModel.js';

// connect database
connectDB();

// load data from file
const companies = loadJsonDataFromFile('Companies');
const internships = loadJsonDataFromFile('Internships');
const users = loadJsonDataFromFile('Users');

// start main
main();

// methodes

async function main() {
  if (process.argv.includes('-l')) {
    await loadData(internshipModel, internships);
    await loadData(companyModel, companies);
    await loadData(userModel, users);
  } else if (process.argv.includes('-d')) {
    await deleteAllData(internshipModel);
    await deleteAllData(companyModel);
    await deleteAllData(userModel);
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
    console.log(`Loading Data of ${model.modelName}...`.green);
    await model.create(data);
    console.log('Data Loaded to the Database'.bgGreen);
  } catch (error) {
    console.error(error);
  }
}

async function deleteAllData(model) {
  try {
    console.log(`Deleting Data of ${model.modelName}...`.red);
    await model.deleteMany();
    console.log('All the Data Deleted from the Database'.bgRed);
  } catch (error) {
    console.error(error);
  }
}