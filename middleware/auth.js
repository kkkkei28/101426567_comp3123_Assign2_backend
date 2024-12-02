/**
 * @author: Kei Ishikawa
 */

const jwt = require('jsonwebtoken');
const secret_key = process.env.JWT_SECRET;
require('dotenv').config();

// AUTHENTICATION FOR OUR JWT TOKEN
// THROWS AN ERROR IF PROVIDED TOKEN ISN'T RECOGNIZED.
const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token){
        return res.status(401).send({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, secret_key);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(400).send({ message: 'Invalid token.' });
    }
};

module.exports = authenticate;