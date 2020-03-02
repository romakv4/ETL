const parser = require('csv-parser');
const fs = require('fs');
const appRoot = require('app-root-path');
const mongoose = require('mongoose');
const Data = require('../models/data');
const File = require('../models/file');

const writeCSVData = async (filename) => {
  try {
    const docs = await File.findOne({ hash: filename });
    if (docs !== null) {
      return { statusCode: 400, error: `File with ${filename} hash already exists in database` };
    }
    return new Promise((resolve, reject) => {
      const result = [];
      fs.createReadStream(`${appRoot}/src/uploads/${filename}.csv`)
        .pipe(parser())
        .on('data', (data) => {
          result.push(data);
        })
        .on('error', (error) => reject(new Error({ statusCode: 500, message: error })))
        .on('end', (async () => {
          const { connection } = mongoose;
          const session = await connection.startSession();
          try {
            await session.startTransaction();
            const insertedFile = new File({ hash: filename });
            const datas = [];
            result.forEach((row) => {
              datas.push(Data.create({ data: row }));
            });
            insertedFile.data = await Promise.all(datas);
            await insertedFile.save();
            await session.commitTransaction();
            resolve({ statusCode: 201, message: 'All rows successfully added to database' });
          } catch (error) {
            await session.abortTransaction();
            reject(new Error({ statusCode: 500, message: `Transaction error: ${error}` }));
          }
        }));
    });
  } catch (error) {
    return { statusCode: 500, message: error };
  }
};

module.exports = { writeCSVData };
