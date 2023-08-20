const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: '../../config.env' })

const Tour = require('../../models/tourModel')

const devData = JSON.parse(fs.readFileSync('./tours-simple.json', 'utf-8'));

const importTour = async () => {
  try {
    await Tour.create(devData); // 也可帶 array 進去
    console.log('data success loaded')
    process.exit();
  } catch(e) {
    console.log(e);
  }
}

const deleteAllData = async () => {
  try {
    await Tour.deleteMany();
    console.log('data success delete')
    process.exit();
  } catch(e) {
    console.log(e)
  }
}

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
}).then((connect) => {
  console.log('DB connect successful!!');
});

if (process.argv[2] === '--import') {
  importTour()
} else if (process.argv[2] === '--delete') {
  deleteAllData()
}
