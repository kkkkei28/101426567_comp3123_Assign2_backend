/**
 * @author: Kei Ishikawa
 */

const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
require('dotenv').config();
const secret_key = process.env.JWT_SECRET;

// SIGN UP AS A USER.
// THROW AN ERROR IF USER IS ALREADY EXISTING ON RECORD.
exports.signup = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ message: errors.array(), status: false });
    }

    const { username, email, password } = req.body;
    try {
    
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists in the database.',
                status: false
            });
        }
        const newUser = new User({ username, email, password });
        const savedUser = await newUser.save();
        res.status(201).json({ message: 'User created successfully', user_id: savedUser._id, status: true });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create new user', error: err.message, status: false });
    }
};


// USER LOGIN
// THROWS AN ERROR IF PROVIDED BY WRONG USERNAME OR PASSWORD
exports.login = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()){
        return res.status(400).json({ message: errors.array(), status: false });
    }

    const { username, password } = req.body;
    const user = await User.findOne({username});
    if (!user){
        return res.status(401).json({message: 'Invalid username or user doesnt exist.', status: false});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid){
        const token = jwt.sign({ id: user._id }, secret_key, { expiresIn: '3h'});
        res.status(200).json({ message: 'Logging in successful!',status: true, token});
    } else {
        res.status(401).json({ message: 'Invalid password.', status: false });
    }
};