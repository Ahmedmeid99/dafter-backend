const express = require('express') // to create server & routes
const auth = require('../middleware/auth')
const Task = require('../models/task')

const router = new express.Router()
////////////////////////////////////
// add task
// get tasks
// delete task
// delete tasks
// update task (update all properties)
// update task (update completed)
////////////////////////////////////

// add task
router.post('/tasks', auth, async (req, res) => {

    try {
        const task = new Task({ ...req.body, owner: req.user._id })
        task.save()
        res.status(200).json({ task, status: 'ok' })
    } catch (e) {
        res.status(401).json({ error: e.message })
    }
})
////////////////////////////////
// GET /tasks?completed=true
// GET /tasks?limit=2&skip=2
// GET /tasks?sortBy=createdAt:desc
// get tasks
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}
    if (req.query.completed) {
        match.completed = req.query.completed === 'true' ? true : false
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':'); // [createdAt,desc]
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    try {
        await req.user.populate({
            path: 'tasks',
            match: match,
            options: {
                limit: parseInt(req.query.limit), //count of tasks in each page (2)
                skip: parseInt(req.query.skip), // get the next of tasks in each page, 2 > 4 > 6 > 8 ...
                sort,
            }
        })
        res.status(200).send(req.user.tasks)
    } catch (e) {
        res.status(401).json({ error: e.message })
    }
})

// delete task
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const task = await Task.findOneAndDelete({ owner: req.user._id, _id: id })
        res.status(200).json({ status: 'ok' })
    } catch (e) {
        res.status(401).json({ error: e.message })
    }
})
// delete tasks
router.delete('/tasks', auth, async (req, res) => {
    try {
        await Task.deleteMany({ owner: req.user._id })
        res.status(200).json({ status: 'ok' })
    } catch (e) {
        res.status(401).json({ error: e.message })
    }
})
// update task (update all properties)
router.put('/tasks/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const task = await Task.findByIdAndUpdate({ owner: req.user._id, _id: id }, { ...req.body })
        res.status(200).json({ task, status: 'ok' })
    } catch (e) {
        res.status(401).json({ error: e.message })
    }
})
// update task (update completed)
router.patch('/tasks/:id', auth, async (req, res) => {
    const completed = req.body.completed
    try {
        const id = req.params.id
        const task = await Task.findByIdAndUpdate({ owner: req.user._id, _id: id }, { completed })
        res.status(200).json({ task, status: 'ok' })
    } catch (e) {
        res.status(401).json({ error: e.message })
    }
})
module.exports = router