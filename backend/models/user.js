const mongoose = require('mongoose')

const {Schema} = mongoose

const userSchema = new Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    college: String,
    role: {
      type: String,
      enum: ['student', 'college_admin', 'super_admin'],
      default: 'student',
    }
})

const userModel = mongoose.model('User', userSchema);

module.exports = userModel