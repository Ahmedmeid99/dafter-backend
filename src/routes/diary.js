const express = require('express') // to create server & routes
const auth = require('../middleware/auth')
const Diary = require('../models/diary')

const router = new express.Router()
////////////////////////////////////
// add diary
// get diaries
// delete diary
// delete diaries
// update diary 
////////////////////////////////////

// add diary
router.post('/diaries', auth, async (req, res) => {

    try {
        const diary = new Diary({ ...req.body, owner: req.user._id })
        diary.save()
        res.status(200).json({ diary, status: 'ok' })
    } catch (e) {
        res.status(401).json({ error: e.message })
    }
})
////////////////////////////////
// GET /diaries?completed=true
// GET /diaries?limit=2&skip=2
// GET /diaries?sortBy=createdAt:desc
// get diaries
router.get('/diaries', auth, async (req, res) => {
    const match = {}
    const sort = {}
    // if (req.query.point) {

    //     match.type = req.query.type // [work,home,learn,life]
    // }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':'); // [createdAt,desc]
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    try {
        await req.user.populate({
            path: 'diaries',
            match: match,
            options: {
                limit: parseInt(req.query.limit), //count of tasks in each page (2)
                skip: parseInt(req.query.skip), // get the next of tasks in each page, 2 > 4 > 6 > 8 ...
                sort,
            }
        })
        res.status(200).send(req.user.diaries)
    } catch (e) {
        res.status(401).json({ error: e.message })
    }
})

// delete diary
router.delete('/diaries/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const diary = await Diary.findOneAndDelete({ owner: req.user._id, _id: id })
        res.status(200).json({ diary, status: 'ok' })
    } catch (e) {
        res.status(401).json({ error: e.message })
    }
})
// delete diaries
router.delete('/diaries', auth, async (req, res) => {
    try {
        await Diary.deleteMany({ owner: req.user._id })
        res.status(200).json({ status: 'ok' })
    } catch (e) {
        res.status(401).json({ error: e.message })
    }
})
// update diary (update all properties)
router.put('/diaries/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const diary = await Diary.findByIdAndUpdate({ owner: req.user._id, _id: id }, { ...req.body })
        res.status(200).json({ diary, status: 'ok' })
    } catch (e) {
        res.status(401).json({ error: e.message })
    }
})

module.exports = router