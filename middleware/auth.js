const User=require("../models/user");
const jwt=require("jsonwebtoken");
require('dotenv').config();

const authenticate=async(req,res,next)=>{
    try{
        const token=req.header("authorization");
      
        const user=jwt.verify(token,`${process.env.TOKEN}`);
      
        if(user.userId===process.env.ADMIN_ID)
            {
                req.user={id:process.env.ADMIN_ID,email:process.env.ADMIN_EMAIL,name:"Admin",isAdmin:true};
                return next();
            }

        const loginUser=await User.findById(user.userId);
        req.user=loginUser;
        next();
    }
    catch(err)
    {
        return res.status(500).json({message:err.message});
    }
        
    }
module.exports={authenticate};