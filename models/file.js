const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    hash:  String,
    data: [{type: Schema.Types.ObjectId, ref: 'Data'}]
});

module.exports = mongoose.model('File', schema);