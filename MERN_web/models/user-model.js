const mongoose= require("mongoose");
const {Schema} = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
    username:{
        type: String,
        required:true,
        minlength:3,
        maxlength:50,
    },
    email:{
        type: String,
        required:true,
        minlength:6,
        maxlength:50,
    },
    password:{
        type: String,
        required:true,
    },
    role:{
        type:String,
        enum:["student","instructor"],
        // 強制一定要有兩種身分
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
});

//instance methods
userSchema.methods.isStudent = function(){
    return this.role == "student";
};

userSchema.methods.isInstructor =function(){
   return this.role == "instructor";
};

// userSchema.methods.comparePassword = async function(password,cb){
//     let result = await bcrypt.compare(password,this.password);
//     return cb(null,result);
// };
userSchema.methods.comparePassword = async function(password,cb){
    let result;
    try{
        result = await bcrypt.compare(password,this.password);
        return cb (null,result);
    } catch(e){
        return cb(e,result);
    } 
};

//mongoose middlewaares
// 若使用者為新用戶，或者正在更改密碼，則將密碼進行雜湊處理
userSchema.pre("save",async function(next){
    //如果用async (next) =>{}   this就無法代表mongoDB 內的 document
    //this 代表 mongoDB 內的 document
    if (this.isNew || this.isModified("password")){
        //將密碼進行雜湊處理
        const hashValue = await bcrypt.hash(this.password, 10);
        this.password = hashValue;
    } 
    next();
});

module.exports = mongoose.model("User", userSchema);

