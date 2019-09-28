const mongoose = require('mongoose')

const TodoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    desk: {
        type: String,
        required: false,
    },
    time: {
        type: Date,
        default: Date.now
    }
})

const Todo = mongoose.model('Todos',TodoSchema)
module.exports = Todo