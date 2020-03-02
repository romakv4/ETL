/* eslint-disable no-console */
const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const { mongoConnect } = require('./connect');
const router = require('./routes/router');

const { ENVIRONMENT } = process.env;
// eslint-disable-next-line import/no-dynamic-require
const { mongoConnectionConfig, serverConfig } = require(`./configuration/${ENVIRONMENT}`);
const { serverPort } = serverConfig;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(router);


const server = app.listen(serverPort, async () => {
  try {
    await mongoConnect(mongoConnectionConfig);
    console.log(`Server started at http://localhost:${serverPort}`);
  } catch (error) {
    console.log(`Start server error: ${error}`);
  }
});

module.exports = server;
