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
const path = require("path");//HUUU
const port = process.env.PORT || 8080; //HUU PORT //process.env.PORT是Heroku自動動態設定，8080則是備案，如果前面沒運行則在8080


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
app.use(express.static(pate.join(__dirname,"client", "build")));//HUU

app.use("/api/user",authRoute);
//course route應該被保護
//如果request header 內部沒有jwt，則request就會被視為是unauthorized
app.use("/api/courses",passport.authenticate("jwt",{session:false}), courseRoute);

if(process.env.NODE_ENV =="production" || process.env.NODE_ENV === "staging"){
    app.get("*",(req,res) =>{
        res.sendFile(path.join(__dirname,"client", "build", "index.html"));
    });
}//HUU

app.listen(port, () =>{
    console.log("後端伺服器listen to port 8080");
});

