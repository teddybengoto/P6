const express = require('express');

const userRoute = require('./routes/user');

const app = express();

app.use(express.json()); // give access to the body 
// app.use: Is for all type of request
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


app.use('/Api/auth',userRoute); 

module.exports = app;