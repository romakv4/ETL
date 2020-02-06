const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    data: Object
});

module.exports = mongoose.model('Data', schema);