/* eslint-disable no-console */
const mongoose = require('mongoose');

const mongoConnect = async (connectionConfig) => {
  const { uri, options } = connectionConfig;
  try {
    await mongoose.connect(uri, options);
    console.log(`Successfully connected to Mongo by uri: ${uri}`);
  } catch (error) {
    console.log(`Mongo connection error ${error}`);
  }
};

module.exports = { mongoConnect };
