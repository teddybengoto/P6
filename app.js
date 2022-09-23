const express = require('express');
const path = require('path');

const userRoute = require('./routes/user');
const sauceRoute = require('./routes/sauce');
//const helmet = require("helmet");

const app = express();
//app.use(helmet());


app.use(express.json()); // give access to the body 
// app.use: Is for all type of request
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    
    next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth',userRoute); 
app.use('/api/sauces', sauceRoute); 

module.exports = app;