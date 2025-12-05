const express = require('express');
const router = express.Router();
const {test, registerUser, loginUser} = require('../controllers/authController')
const {verifyToken, requireRole} = require('../helpers/auth')

router.get('/', test)
router.post('/register', registerUser)
router.post('/login', loginUser)

//route admins and users
router.get('/admin-panel', verifyToken, requireRole(['college_admin', 'super_admin']), (req, res) => {
    res.json({message: 'Admin access granted'});
});

router.get('/student-dashboard', verifyToken, requireRole(['student']), (req, res) => {
    res.json({message: 'Student dashboard'});
});

module.exports = router