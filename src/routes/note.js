const express = require('express') // to create server & routes
const auth = require('../middleware/auth')
const Note = require('../models/note')

const router = new express.Router()
////////////////////////////////////
// add note
// get notes
// delete note
// delete notes
// update note (update completed)
////////////////////////////////////

// add task
router.post('/notes', auth, async (req, res) => {

    try {
        const note = new Note({ ...req.body, owner: req.user._id })
        note.save()
        res.status(200).json({ note, status: 'ok' })
    } catch (e) {
        res.status(401).json({ error: e.message })
    }
})
////////////////////////////////
// GET /tasks?completed=true
// GET /tasks?limit=2&skip=2
// GET /tasks?sortBy=createdAt:desc
// get tasks
router.get('/notes', auth, async (req, res) => {
    const match = {}
    const sort = {}
    if (req.query.type) {
        match.type = req.query.type // [work,home,learn,life]
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':'); // [createdAt,desc]
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    try {
        await req.user.populate({
            path: 'notes',
            match: match,
            options: {
                limit: parseInt(req.query.limit), //count of tasks in each page (2)
                skip: parseInt(req.query.skip), // get the next of tasks in each page, 2 > 4 > 6 > 8 ...
                sort,
            }
        })
        res.status(200).send(req.user.notes)
    } catch (e) {
        res.status(401).json({ error: e.message })
    }
})

// delete task
router.delete('/notes/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const note = await Note.findOneAndDelete({ owner: req.user._id, _id: id })
        res.status(200).json({ note, status: 'ok' })
    } catch (e) {
        res.status(401).json({ error: e.message })
    }
})
// delete tasks
router.delete('/notes', auth, async (req, res) => {
    try {
        await Note.deleteMany({ owner: req.user._id })
        res.status(200).json({ status: 'ok' })
    } catch (e) {
        res.status(401).json({ error: e.message })
    }
})
// update task (update all properties)
router.put('/notes/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const note = await Note.findByIdAndUpdate({ owner: req.user._id, _id: id }, { ...req.body })
        res.status(200).json({ note, status: 'ok' })
    } catch (e) {
        res.status(401).json({ error: e.message })
    }
})

module.exports = router