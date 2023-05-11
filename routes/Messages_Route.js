const express = require("express");
const router = express.Router();
const { Get_Messages, Add_Messages } = require("../controllers/Messages");
const { authorize } = require("../Authorize");
// ---------------------------
router.post("/Add-Message/", authorize, Add_Messages);
router.post("/Get-Message/", authorize, Get_Messages);
// ---------------------------
module.exports = router;
// ---------------------------
