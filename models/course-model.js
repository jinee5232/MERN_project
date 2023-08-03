const mongoose= require("mongoose");
const {Schema} = mongoose;

const courseschema = new Schema({
    id: { type: String},
    title: {
        type: String,
        required: true,
    } ,
    description:{
        type:String,
        required: true,
    },
    price:{
        type:Number,
        required:true,
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,//mongoDB 所設定的primary key
        ref:"User"
    },
    students:{
        type:[String],
        defarlt:[],
    },
});

module.exports = mongoose.model("Course",courseschema);