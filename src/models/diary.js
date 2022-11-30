const mongoose = require('mongoose') // to connect server with mongodb & create schema
const diarySchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    subTitle: {
        type: String,
        required: true,
        trim: true
    },
    descriptio: {
        type: String,
        required: true,
        trim: true
    },
    points: [

        {
            type: String,
            required: true,
            trim: true
        }

    ],
    owner: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User',
    }
}, {
    timestamps: true,
})

const Diary = mongoose.model('Diary', diarySchema)
module.exports = Diary