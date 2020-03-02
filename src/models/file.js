const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
  filename: String,
  hash: String,
  data: [{ type: Schema.Types.ObjectId, ref: 'Data' }],
});

module.exports = mongoose.model('File', schema);
