const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model('User',UserSchema)

module.exports = User