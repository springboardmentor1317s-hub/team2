const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors')
const {mongoose} = require('mongoose')

//database connection
console.log('MONGO_URI:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("database connected"))
.catch((err)=> console.log("database not connected", err))

const app = express()
const port = 3000

//middleware
app.use(express.json())

app.use('/', require('./routes/authRoutes'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
