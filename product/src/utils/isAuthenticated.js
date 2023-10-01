const jwt = require('jsonwebtoken');
require('dotenv').config();

function isAuthenticated (req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (e) {
        console.error(e);
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports = isAuthenticated;