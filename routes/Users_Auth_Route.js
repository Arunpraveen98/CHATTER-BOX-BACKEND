const express = require("express");
const router = express.Router();
const {
  User_Login,
  User_Register,
  Get_All_Users,
  Set_Avatar,
  set_Default_Avatar,
  User_Logout,
} = require("../controllers/Users");
const { authorize } = require("../Authorize");
// ---------------------------
router.post("/User-Login", User_Login);
router.post("/User-Register", User_Register);
router.get("/All-Users/:id", authorize, Get_All_Users);
router.post("/Set-Avatar/:id", authorize, Set_Avatar);
router.get("/Get-Avatar", authorize, set_Default_Avatar);
router.get("/User-Logout/:id", authorize, User_Logout);
// ---------------------------
module.exports = router;
// ---------------------------
