const parser = require("csv-parser");
const fs = require("fs");
const fsPromises = require("fs").promises;
const crypto = require("crypto");
const mongoose = require("mongoose");
const Data = require("./models/data");
const File = require("./models/file");

const hash = crypto.createHash('md5');
const result = [];
mongoose.connect('mongodb://localhost:27017/ETL', {useNewUrlParser: true, useUnifiedTopology:true});

const getFileHash = async (filePath) => {
    const fileText = await fsPromises.readFile(filePath, 'utf-8');
    return hash.update(fileText).digest('hex');
}

const writeData = async () => {
    const hash = await getFileHash('S1_with_weather.csv');
    try {
        const docs = await File.findOne({ hash });
        if (docs !== null) {
            console.log("Parasha");
        } else {
            fs.createReadStream('S1_with_weather.csv')
                .pipe(parser())
                .on('data', data => {
                    result.push(data);
                })
                .on('error', () => {
                    console.log(error);
                })
                .on('end', (async () => {
                    try {
                        const { connection } = mongoose;
                        const session = await connection.startSession();
                        await session.startTransaction();
                        const insertedFile = new File({ hash });
                        for (row of result) {
                            const data = await Data.create({ data: row });
                            await insertedFile.data.push(data);
                        }
                        await insertedFile.save();
                        await session.commitTransaction();
                        console.log('Transaction successfully commited');
                        await connection.close();
                    } catch (error) {
                        await session.abortTransaction();
                        console.log(`Transaction error: ${error}`);
                    }
                }));
        }
    } catch (error) {
        console.log(error);
    }
}

writeData();

// const getFileWithData = async () => {
//     const hash = await getFileHash('S1_with_weather.csv');
//     File.find({ hash }).populate('data').exec(data => {
//         console.log(data);
//     });
// }

// getFileWithData();