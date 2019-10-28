const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        require: true
    },
    accesstoken: {
        type: String,
        required: true
    },
    refreshtoken: {
        type: String,
        required: true
    },
    expire: {
        type: Number,
        required: true
    }
});

mongoose.model('users', UserSchema);