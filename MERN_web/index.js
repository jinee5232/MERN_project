const express=require("express");
const app = express();
const mongoose= require("mongoose");
const dotenv=require("dotenv");
dotenv.config();
const authRoute = require("./routes").auth;
const courseRoute =require("./routes").course;
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");

//連結mongooDB
mongoose.connect("mongodb://127.0.0.1/mernDB").then(() =>{
    console.log("Connecting to(連結到) mongodb...");
}).catch((e) =>{
    console.log(e);
});

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

app.use("/api/user",authRoute);
//course route應該被保護
//如果request header 內部沒有jwt，則request就會被視為是unauthorized
app.use("/api/courses",passport.authenticate("jwt",{session:false}), courseRoute);

//只有登入的人才能新增課程或註冊課程
//驗證jwt是否有效

app.listen(8080, () =>{
    console.log("後端伺服器listen to port 8080");
});

