const { Schema, model } = require('mongoose');

const schema = new Schema({
    name: {
        type : String,
        required: true,
        unique: true
    },
    users: {
        type : Array
    },
    created_at: {
        type: Date
    }
});

module.exports = model('Chat', schema);