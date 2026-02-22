const express=require("express");
const router=express.Router();
const middleware=require("../middleware/auth");

const messageController=require("../Controller/messageController");

router.post("/add",middleware.authenticate,messageController.addMessage);
router.get("/get/:roomName",middleware.authenticate,messageController.fetchMessages);

module.exports=router;