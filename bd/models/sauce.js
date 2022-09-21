const mongoose = require('mongoose');

const Sauce = mongoose.Schema({

    userId:{type:String,require:true},
    name:{type:String,require:true},
    manufacturer:{type:String,require:true},
    description:{type:String,require:true},
    mainPepper:{type:String,require:true},
    imageUrl:{type:String,require:true},
    heat:{type:Number, min:1, max:10, require:true},
    likes:{type:Number},
    dislikes:{type:Number},
    usersLiked:[String],
    usersDisliked:[String]

});

module.exports=mongoose.model("Sauce",Sauce);