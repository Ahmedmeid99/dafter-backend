const User = require('../models/user')
const jwt = require('jsonwebtoken') // to add unique token for evry user login

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace("Bearer ", "") //tack token from header request 
        const decoded = jwt.verify(token, 'secret123') // token => object of data
        const user = await User.findOne({
            _id: decoded.id,
            token: token
        })
        if (!user) {
            throw new Error()
        }
        // token
        req.token = token
        // user
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({ error: 'please authenticate' })
    }
}
module.exports = auth