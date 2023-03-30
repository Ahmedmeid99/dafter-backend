const express = require('express') // to create server & routes
const mongoose = require('mongoose') // to connect server with mongo
const cors = require('cors')
const corsAccess = require('./middleware/cors')
const userRouter = require('./routes/user')
const taskRouter = require('./routes/task')
const noteRouter = require('./routes/note')
const diaryRouter = require('./routes/diary')
const imageRouter = require('./routes/image')
const app = express()

app.use(cors()) // give us ability to access from frontend-code
app.use(express.json())
app.use('/api', corsAccess, userRouter)
app.use('/api', corsAccess, taskRouter)
app.use('/api', corsAccess, noteRouter)
app.use('/api', corsAccess, diaryRouter)
app.use('/api', corsAccess, imageRouter)
const PORT = process.env.PORT || 3000

// const MONGODB_URL = 'mongodb://127.0.0.1:27017/dafter-app-backend'
const MONGODB_URL = 'mongodb+srv://ahmed-eid-dafter:eid199963@cluster0.h575og5.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(MONGODB_URL)
    .then(() => app.listen(PORT, () => console.log(`server is running on ${PORT} port`)))
    .catch((error) => console.log(error.message))

/*
 * C:/Users/Ezz/mongodb/bin/mongod.exe --dbpath C:/Users/Ezz/mongodb-data
*/
