const express = require('express') // to create server & routes
const multer = require('multer') //to upload files - images
const auth = require('../middleware/auth')
const Image = require('../models/image')

const router = new express.Router()
////////////////////////////////////
// add image
// get image
// delete image
// delete images
////////////////////////////////////
///////////////////////////////////////////////////
// create middleWare  to filtering img
const image = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an img'))
        }
        cb(undefined, true)
    }
})
// add img to image property in user
router.post('/images', auth, image.single('image'), async (req, res) => {
    const buffer = req.file.buffer
    const image = new Image({ buffer, owner: req.user.id })
    await image.save()
    res.status(200).send({ status: 'ok' })
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
    next()
})
////////////////////////////////
router.get('/images', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':'); // [createdAt,desc]
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    try {
        await req.user.populate({
            path: 'images',
            match: match,
            options: {
                limit: parseInt(req.query.limit), //count of tasks in each page (2)
                skip: parseInt(req.query.skip), // get the next of tasks in each page, 2 > 4 > 6 > 8 ...
                sort,
            }
        })
        res.status(200).send(req.user.images)
    } catch (e) {
        res.status(401).json({ error: e.message })
    }
})

// delete image
router.delete('/images/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const image = await Image.findOneAndDelete({ owner: req.user._id, _id: id })
        res.status(200).json({ image, status: 'ok' })
    } catch (e) {
        res.status(401).json({ error: e.message })
    }
})
// delete images
router.delete('/images', auth, async (req, res) => {
    try {
        await Image.deleteMany({ owner: req.user._id })
        res.status(200).json({ status: 'ok' })
    } catch (e) {
        res.status(401).json({ error: e.message })
    }
})


module.exports = router