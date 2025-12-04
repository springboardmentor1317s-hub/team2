// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // 1. Extract the token from the 'Authorization' header.
    // The format is typically: Authorization: Bearer <token>
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // 2. Check if a token exists
    if (!token) {
        // 401 Unauthorized - The client failed to provide a token
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // 3. Verify the token using the secret key
        // If verification fails, it throws an error.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Attach the decoded user payload to the request object.
        // This makes 'req.user.id' and 'req.user.role' available in all protected route handlers.
        req.user = decoded.user; 
        
        // 5. Proceed to the route handler
        next(); 

    } catch (err) {
        // Token verification failed (e.g., token expired, invalid signature)
        res.status(401).json({ msg: 'Token is not valid' });
    }
};