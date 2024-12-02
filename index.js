/**
 * @author: Kei Ishikawa
 */
const express = require('express');
const mongoose = require('mongoose');
const user = require('./routes/route_user');
const employee = require('./routes/route_employee');
const { collection } = require('./models/user');
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());

const cors = require('cors');                                           
app.use(cors());


const mongoDb = process.env.MONGO_URI
require('dotenv').config();
mongoose.connect(mongoDb).then(() => {
    console.log("Connected to the database.");
}).catch(err => {
    console.error("Error connecting to database.", err)
});

app.get('/', (req, res) => {
    res.send('<h1>Welcome to my Assignment 2 in Full Stack</h1>');
});

app.use('/api/v1/user', user);
app.use('/api/v1/emp', employee);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});