const fs = require('fs');
const util = require('util');
const path = require('path');
const prisma = require('../database');

// const readFile = util.promisify(fs.readFile);
// const readData = async () => {
//   try {
//     const data = fs.readFile(path.join(__dirname, '../', 'raw-data.json'), 'utf-8');
//     return (JSON.parse(data));
//   } catch (error) {
//     return error;
//   }
// };

// const readData = async () => readFile(path.join(__dirname, '../', 'raw-data.json'), 'utf-8', (err, data) => {
//   if (err) throw err;
//   return JSON.parse(data);
// });

const dataToArray = ({ data }) => {
  const acronymData = [];
  data.map((objData) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(objData)) {
      acronymData.push({ acronym: key, meaning: value });
    }
    return true;
  });
  return acronymData;
};

const readData = async () => new Promise((resolve, reject) => {
  fs.readFile(path.join(__dirname, '../', 'raw-data.json'), 'utf-8', (error, data) => {
    if (error) reject(error);
    const acronyData = JSON.parse(data);
    resolve(dataToArray(acronyData));
  });
});

const populateDB = async () => {
  try {
    const data = await readData();
    console.log('processing...');
    return Promise.all(data.map(async ({ acronym, meaning }) => {
      await prisma.acronym.create({
        data: {
          acronym,
          meaning,
        },
      });
    }));
    console.log('done...');
  } catch (error) {
    return error;
  }
};

populateDB();

/* coonst populateDB = () => {
  const { data } = await readData();
  // console.log(data);
  await Promise.all(data.map(async (obj) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(obj)) {
      // eslint-disable-next-line no-await-in-loop
      await prisma.acronym.create({
        data: {
          acronym: key,
          meaning: value,
        },
      });
    }
  }));
} */
