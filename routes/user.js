const express = require('express');

const userCtr = require('../controller/user');
const auth = require('../middleware/auth');

const router = express.Router();

//router.post('/test',auth,userCtr.test);
router.post('/signup',userCtr.signup);
router.post('/login',userCtr.login);

module.exports=router;
