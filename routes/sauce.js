const express = require('express');

const sauceCtr = require('../controller/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const router = express.Router();

router.get('/',auth,sauceCtr.getSauces);
router.get('/:id',auth,sauceCtr.getOneSauce);
router.post('/',auth,multer,sauceCtr.creatSauce);
router.post('/:id/like',auth,sauceCtr.likeSauce);
router.put('/:id',auth,multer,sauceCtr.updateSauce);
router.delete('/:id',auth,sauceCtr.deleteSauce);


module.exports=router;
