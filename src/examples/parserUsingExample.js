/* eslint-disable no-console */
const parser = require('csv-parser');
const fs = require('fs');

const result = [];

fs.createReadStream('S1_with_weather.csv')
  .pipe(parser())
  .on('data', (data) => result.push(data))
  .on('end', (() => console.log(result)));
