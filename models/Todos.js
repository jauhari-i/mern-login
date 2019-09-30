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
    done: {
        type: String,
    },
    date: {
        type: Date,
    }
})

const Todo = mongoose.model('Todos',TodoSchema)
module.exports = Todo