const mongoConnectionConfig = {
  uri: 'mongodb://mongo:27017/ETL',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};

const serverConfig = {
  serverPort: 5000,
};

module.exports = { mongoConnectionConfig, serverConfig };
