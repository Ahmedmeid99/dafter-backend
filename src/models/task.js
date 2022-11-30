const mongoose = require('mongoose') // to connect server with mongodb & create schema
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: false,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        required: false,
        trim: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    }
},
    {
        timestamps: true
    })

const Task = mongoose.model('Task', taskSchema)
module.exports = Task