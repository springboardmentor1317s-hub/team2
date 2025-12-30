const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach the decoded user payload to the request object
        // Token contains { id: userId }, so decoded.id is the user ID
        req.user = { id: decoded.id };
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
