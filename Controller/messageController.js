
const messages=require("../models/message");
const mongoose=require("mongoose");
const addMessage=async(req,res)=>{
    try{
        const message=req.body.message;
        const roomName=req.body.roomName;
        const UserId=req.user._id;
        if (!message || !roomName) {
            return res.status(400).json({ message: "Invalid message data" });
          }

          const newMessage=new messages({
            message:message,
            roomName:roomName,
            user:{
                userId: UserId,
                name:req.user.name,     
            }
            });
           await newMessage.save();
        res.status(201).json({message:"Message added successfully"});
    }
    catch(err)
    {
        console.log("Error in adding message")
        res.status(500).json({message:err.message});
    }
}

const fetchMessages=async(req,res)=>{
    try{
        
        const roomName=req.params.roomName;
        
      const allMessages=await messages.find({
            roomName:roomName
        }).sort({createdAt:1});
        res.status(200).json({messages:allMessages});
    }
    catch(err)
    {
        console.log("Error in fetching messages")
        res.status(500).json({message:err.message});
    }
}

module.exports={addMessage,fetchMessages};