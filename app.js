const express=require('express');
const app=express();
require('dotenv').config();
const path=require('path');
const port=process.env.PORT;
const http=require("http");

const mongoose=require('mongoose');
const socketIO=require("./socket.io");

const server=http.createServer(app);



const userRouter=require("./Routes/userRouter");
const messageRouter=require("./Routes/messageRouter");
const mediaRouter=require("./Routes/mediaRouter");
const chatListRouter=require("./Routes/chatListRouter");
const paymentRouter=require("./Routes/paymentRouter");

require("./models/user")
const adminRouter=require("./Routes/adminRouter");

app.use(express.json());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, "./view")));



const io=socketIO(server);
app.use((req, res, next) => {
   req.io=io;
    next();
  });





app.use("/user",userRouter);
app.use("/admin",adminRouter);
app.use("/message",messageRouter);
app.use("/media",mediaRouter);
app.use("/chat",chatListRouter);
app.use("/",paymentRouter);


app.get("/", (req, res) => {
    res.redirect("/user/main.html");
  });

app.get("/admin", (req, res) => {
    res.redirect("/admin/admin.html");
  } );

(async () => {
    try {
     await mongoose.connect(process.env.MONGO_URL);
     server.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
    });
    } catch (err) {
      console.error("Server startup failed:", err);
   }
 })();