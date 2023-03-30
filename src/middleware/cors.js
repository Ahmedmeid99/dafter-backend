const express = require('express')
const app = express()

const cors = app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*")
    next()
})
module.exports = cors