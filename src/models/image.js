const mongoose = require('mongoose') // to connect server with mongodb & create schema
const imageSchema = new mongoose.Schema({
    buffer: {
        type: Buffer,
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

const Image = mongoose.model('Image', imageSchema)
module.exports = Image