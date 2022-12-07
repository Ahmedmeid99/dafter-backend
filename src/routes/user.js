const express = require('express') // to create server & routes
const jwt = require('jsonwebtoken') // to add unique token for evry user login
const bcrypt = require('bcrypt')
const multer = require('multer') //to upload files - images
const sharp = require('sharp') // to resize images
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()
////////////////////////////////////
// create user (sign up)
// add token for user (login)
// read user (get user)
// delete user
// logout user
////////////////////////////////////
// create user (sign up)
router.post('/users/signup', async (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const enteredPassword = req.body.password
    const password = await bcrypt.hash(enteredPassword, 8)
    try {
        const user = await User.create({ name, email, password })
        user.save()
        res.status(200).json({ user: { name, email }, status: 'ok' })
    } catch (e) {
        res.status(401).json({ error: e.message })
    }
})

// add token for user (login)
router.post('/users/login', async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    try {
        const user = await User.findOne({ email })
        const isMatch = bcrypt.compare(password, user.password)
        if (isMatch) {
            const id = user._id
            const token = await jwt.sign({ email, id }, 'secret123') // sign() to create token using email password 
            user.token = token
            user.save()
            res.status(200).json({ user: { token, email }, status: 'ok' })
        } else {
            res.status(404).json({ error: 'enter valid email,password' })
        }
    } catch (e) {
        res.status(402).json({ error: e.message })
    }
})
// read user (get user)
router.get('/users/me', auth, async (req, res) => {
    try {
        res.send(req.user) // req.user come from middleware
    } catch (e) {
        res.status(402).json({ error: e.message })
    }
})
// delete user
router.delete('/users/me', auth, async (req, res) => {
    try {
        await User.deleteOne({ password: req.user.password, email: req.user.email })
        // req.user.delete()
        res.send({ status: 'ok', user: 'deleted' }) // req.user come from middleware
    } catch (e) {
        res.status(402).json({ error: e.message })
    }
})
// logout user
router.post('/users/me', auth, async (req, res) => {
    try {
        req.user.token = ''
        req.user.save()
        res.send({ status: 'ok', user: 'deleted' }) // req.user come from middleware
    } catch (e) {
        res.status(402).json({ error: e.message })
    }
})
// update user
router.put('/users/me', auth, async (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const enteredPassword = req.body.password
    const password = await bcrypt.hash(enteredPassword, 8)
    try {
        const user = await User.findByIdAndUpdate(req.user._id, { name, email, password })
        user.save()
        res.send({ status: 'ok', user }) // req.user come from middleware
    } catch (e) {
        res.status(402).json({ error: e.message })
    }
})
///////////////////////////////////////////////////
// create middleWare  to filtering img
const avater = multer({
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
// add img to avater property in user
router.post('/users/me/avater', auth, avater.single('avater'), async (req, res) => {
    // const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    const buffer = req.file.buffer

    req.user.avater = buffer
    await req.user.save()
    res.send({ status: 'ok' })
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
    next()
})
//delete avater (user img)
router.delete('/users/me/avater', auth, avater.single('avater'), async (req, res) => {
    req.user.avater = undefined
    await req.user.save()
    res.send({ status: 'ok' })
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
    next()
})
//read user avater
router.get('/users/me/avater', auth, async (req, res) => {
    try {
        const user = req.user
        if (!user || !user.avater) {
            return res.status(400).send('user is not found or avater is not found')
        }
        res.set("Content-Type", "image/png")
        res.send(user.avater)
    } catch (e) {
        res.status(400).send()
    }
})
///////////////////////////////////////////////////
// add img to bgAvater property in user
router.post('/users/me/bgAvater', auth, avater.single('bgAvater'), async (req, res) => {
    // const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    const buffer = req.file.buffer

    req.user.bgAvater = buffer
    await req.user.save()
    res.send({ status: 'ok' })
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
    next()
})
//delete bgAvater (user background img)
router.delete('/users/me/bgAvater', auth, avater.single('bgAvater'), async (req, res) => {
    req.user.bgAvater = undefined
    await req.user.save()
    res.send({ status: 'ok' })
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
    next()
})
//read user bgAvater
router.get('/users/me/bgAvater', auth, async (req, res) => {
    try {
        const user = req.user
        if (!user || !user.bgAvater) {
            return res.status(400).send('user is not found or avater is not found')
        }
        res.set("Content-Type", "image/png")
        res.send(user.bgAvater)
    } catch (e) {
        res.status(400).send()
    }
})
///////////////////////////////////////////////////
module.exports = router