const mongoose = require('mongoose') // to connect server with mongodb & create schema
const noteSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        trim: true,
        default: 'life',
        lowercase: true
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    }
}, {
    timestamps: true,
})

const Note = mongoose.model('Note', noteSchema)
module.exports = Note
