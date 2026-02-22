const User=require("../models/user");
const jwt=require("jsonwebtoken");
require('dotenv').config();

module.exports=(io)=>{
    io.use(async(socket,next)=>{

    try{
    const token=socket.handshake.auth.token;
    console.log("Received token:", token); 
    if(!token){
        return next(new Error("Authentication error: Token not provided"));
    }
        
       const user=jwt.verify(token,`${process.env.TOKEN}`);

       if(user.userId===process.env.ADMIN_ID)
        {
            socket.user={id:process.env.ADMIN_ID,email:process.env.ADMIN_EMAIL,name:"Admin",isAdmin:true};
            return next();
        }

        if(!user){
            return next(new Error("Authentication error: Invalid token"));
        }

        const sendingUser=await User.findById(user.userId);
          
        if(!sendingUser){
            return next(new Error("Authentication error: User not found"));
        }
        socket.user=sendingUser;
        next();
    }
    catch(err)
    {
        return next(new Error("Authentication error: "+err.message));
    }      

})
};