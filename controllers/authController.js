const User = require('../models/user')
const {hashPassword, comparePassword} = require("../helpers/auth")
const jwt = require('jsonwebtoken')

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

//Login endpoint
const loginUser = async (req, res) => {
    try{
        const {email, password} = req.body;
        //check if user exists
        const user = await User.findOne({email});
        if(!user){
            return res.json({
                error: "No user found"
            })
        }

        //match password
        const match = await comparePassword(password, user.password)
        if(match){
            //assign jwt
            jwt.sign({
                email: user.email, 
                id: user._id, 
                name: user.name,
                role: user.role
            }, process.env.JWT_SECRET, {}, (err, token) => {
                if(err) throw err;
                res.cookie('token', token).json(user)
            })
        }else{
            res.json("Incorrect Password");
        }
    } catch(err){

    }
}

module.exports = {
    test,
    registerUser,
    loginUser
}

