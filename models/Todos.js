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
        default: 0,
    },
    doneIn: {
        type: Date,
        default: null,
    },
    date: {
        type: Date,
    },
    userId: {
        type: String,
        default: null
    }
})

const Todo = mongoose.model('Todos',TodoSchema)
module.exports = Todo