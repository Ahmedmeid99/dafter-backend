const express = require('express') // to create server & routes
const jwt = require('jsonwebtoken') // to add unique token for evry user login
const bcrypt = require('bcrypt')
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
module.exports = router