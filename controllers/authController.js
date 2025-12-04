const User = require('../models/user')
const {hashPassword, comparePassword} = require("../helpers/auth")

const test = (req, res) => {
    res.json("test is working")
}

const registerUser = async (req, res) => {
    try{
        const {name, email, password, college, role} = req.body;
        //name is required
        if(!name) {
            return res.json({
                error: 'Name is required!'
            })
        }
        //check email
        const exist = await User.findOne({email});
        if(exist){
            return res.json({
                error: 'email already exists!'
            })
        }
        //check college
        if(!college) {
            return res.json({
                error: 'College name is required!'
            })
        }
        //check password
        if(!password || password.length < 6){
            return res.json({
                error: "Password is required and should be atleast 6 characters"
            })
        }
        //hash the password using bcrypt
        const hashedPassword = await hashPassword(password)

        //create user if no errors
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            college,
            role
        })
        return res.json(user)

    } catch(error){
        console.log(error)
        return res.json({
            error: 'Server error: ' + error.message
        })
    }
}

module.exports = {
    test,
    registerUser
}

