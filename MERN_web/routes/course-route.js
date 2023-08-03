const { findOne } = require("../models/user-model");

const router = require("express").Router();
const Course = require("../models").course;
const courseValidation = require("../validation").courseValidation;

router.use((req,res,next) =>{
    console.log("course route正在接受一個request...");
    next();
});

//取得所有課程資訊
router.get("/", async(req,res) =>{
    try{
        let courseFound = await Course.find({}).populate("instructor",["username","email","password"]).exec();
        return res.send(courseFound);
    }catch(e) {
        return res.status(500).send(e);
    }
});

//用學生_id找尋找的課程
router.get("/student/:_student_id",async(req,res) =>{
    let {_student_id} =req.params;
    try{
        let courseFound = await Course.find({students:_student_id}).populate("instructor",["username","email"]).exec();
        return res.send(courseFound);
    }catch(e){
        return res.status(500).send(e);
    }
});

//用課程名稱尋找課程
router.get("/findByName/:name",async(req,res) =>{
    let { name } =req.params;
    try{
        let courseFound = await Course.find({title:name}).populate("instructor",["username","email"]).exec();
        return res.send(courseFound);
    }catch(e){
        return res.status(500).send(e);
    }
});

//用講師_id找課程
router.get("/instructor/:_instructor_id",async(req,res) =>{
    let {_instructor_id} =req.params;
    try{
        let courseFound = await Course.find({instructor:_instructor_id}).populate("instructor",["username","email"]).exec();
        return res.send(courseFound);
    }catch(e){
        return res.status(500).send(e);
    }
});

//用_id 尋找課程
router.get("/:_id",async(req,res) =>{
    let {_id} =req.params;
    try{
        let courseFound = await Course.findOne({_id}).populate("instructor",["username","email"]).exec();
        return res.send(courseFound);
    }catch(e){
        return res.status(500).send(e);
    }
});

router.post("/", async (req,res)=>{
    //驗證數據是否符合規範
    let { error } =courseValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);//如果error告訴使用者

    if(req.user.isStudent()) {
        return res.status (400).send("只有講師才能發布新課程。若你已經是講師，請透過講師帳號登入")
    }
    
    //創造新課程
    let { title, description, price } = req.body;
    try{
        let newCourse = new Course({
            title,
            description,
            price,
            instructor:req.user._id,
        });
        let savedCourse = await newCourse.save();
        return res.send({
            message:"New course have been saved",
            savedCourse,
        });
    }catch (e){
        return res.status (500).send("無法創建課程。。。。");
    }
});

//讓學生透過課程id來註冊新功能
router.post("/enroll/:_id",async (req,res) =>{
    let { _id } = req.params;
    let course = await Course.findOne({_id});
    course.students.push(req.user._id);
    await course.save();
    res.send("註冊完成");
});

//更新課程
router.patch("/:_id",async (req,res) =>{
    //驗證數據是否符合規範
    let { error } =courseValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);//如果error告訴使用者

    let { _id } = req.params;
    //確認課程存在
    try{
        let courseFound = await Course.findOne({_id});
        if(!courseFound){
            return res.status(400).send("查無此課程");
        }

        if(courseFound.instructor.equals(req.user._id)){
            let UpdateCourse = await Course.findOneAndUpdate({_id},req.body,{
                new:true,
                runValidators:true,
            });
            return res.send({message:"課程更改成功",UpdateCourse});
        }else{
            return res.status(403).send("只有老師才能更新課程");
        }
    }catch(e){
        return res.status(500).send(e);
    }
});

router.delete("/:_id",async (req,res) =>{
    let { _id } = req.params;
    //確認課程存在
    try{
        let courseFound = await Course.findOne({_id}).exec();
        if(!courseFound){
            return res.status(400).send("查無此課程無法刪除");
        }

        if(courseFound.instructor.equals(req.user._id)){
           await Course.deleteOne({_id}).exec();
            return res.send("課程刪除成功");
        }else{
            return res.status(403).send("只有老師才能Delete課程");
        }
    }catch(e){
        return res.status(500).send(e);
    }
});

module.exports =router;