const { Schema, model } = require('mongoose');

const schema = new Schema({
    username: {
        type : String,
        required: true,
        unique: true
    },
    created_at: {
        type: Date
    }
});

module.exports = model('User', schema);