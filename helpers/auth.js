const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(12, (err, salt) => {
            if(err){
                reject(err)
            } 
            
            bcrypt.hash(password, salt, (err, hash) => {
                if(err){
                    reject(err)
                } 
                resolve(hash)
            })
        })
    })
}

const comparePassword = (password, hashed) => {
    return bcrypt.compare(password, hashed)
}

//jwt verification middleware
const verifyToken = (req, res, next) => {
    let token = req.cookies.token;
    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
    }
    if(!token) {
        return res.status(401).json({error: 'No token provided'});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch(err) {
        return res.status(401).json({error: 'Invalid token'});
    }
}

//role-based middleware
const requireRole = (roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return res.status(403).json({error: 'Access denied'});
        }
        next();
    }
}
module.exports = { hashPassword, comparePassword, verifyToken, requireRole }