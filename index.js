const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors')
const {mongoose} = require('mongoose')
const cookieParser = require('cookie-parser')

//database connection
mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("database connected"))
.catch((err)=> console.log("database not connected", err))

const app = express()
const port = process.env.PORT || 3000

//middleware
app.use(cors({
    credentials: true,
    origin: (origin, callback) => {
        callback(null, true)
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())

app.use('/', require('./routes/authRoutes'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
