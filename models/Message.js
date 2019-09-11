const { Schema, model } = require('mongoose');

const schema = new Schema({
    chat: {
        type: String
    },
    author: {
        type: String
    },
    text: {
        type: String
    },
    created_at: {
        type: Date,
        required: true
    }
});

module.exports = model('Message', schema);