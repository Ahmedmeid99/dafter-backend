const mongoose = require('mongoose') // to connect server with mongodb & create schema

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 7,
            trim: true,
        },
        token: {
            type: String,
            required: false,
        }
    }, {
    timestamps: true,
}
)
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})
userSchema.virtual('notes', {
    ref: 'Note',
    localField: '_id',
    foreignField: 'owner'
})
userSchema.virtual('diaries', {
    ref: 'Diary',
    localField: '_id',
    foreignField: 'owner'
})
const User = mongoose.model("User", userSchema)
module.exports = User 