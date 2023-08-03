import {BrowserRouter, Routes, Route} from "react-router-dom";
import { useState } from "react";
import Layout from "./component/Layout";
import HomeComponent from "./component/home-component";
import RegisterComponent from "./component/register-component";
import LoginComponent from "./component/login-component";
import ProfileComponent from "./component/profile-component";
import AuthService from "./services/auth.service"
import CourseComponent from "./component/course-component";
import PostCourseComponent from "./component/postCourse-component";
import EnrollComponent from "./component/enroll-component";

function App() {
  let [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
  return (
    <BrowserRouter>
    <Routes>
      {/* 這邊的path路徑名稱必須跟nav寫的一樣 */}
      <Route path="/" element={<Layout currentUser={currentUser} setCurrentUser={setCurrentUser}/>}>
        <Route index element={<HomeComponent /> }></Route>
        <Route path="register" element = {<RegisterComponent/>}></Route>
        <Route path="login" element = {<LoginComponent currentUser={currentUser} setCurrentUser={setCurrentUser}/>}></Route>
        <Route path="profile" element = {<ProfileComponent currentUser={currentUser} setCurrentUser={setCurrentUser}/>}></Route>
        <Route path="course" element = {<CourseComponent currentUser={currentUser} setCurrentUser={setCurrentUser}/>}></Route>
        <Route path="postCourse" element = {<PostCourseComponent currentUser={currentUser} setCurrentUser={setCurrentUser}/>}></Route>
        <Route path="enroll" element = {<EnrollComponent currentUser={currentUser} setCurrentUser={setCurrentUser}/>}></Route>
      </Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
