const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
  data: Object,
});

module.exports = mongoose.model('Data', schema);
