const {Server}=require("socket.io");
const socketMiddleware=require("./middleware");
const locationTrack=require("./handler/liveTrack");
const chat=require("./handler/chat");

module.exports=(server)=>{
    const io=new Server(server,{
        cors:{
            origin:"*"
        }
    })
  console.log("Socket.io server initialized");
    socketMiddleware(io);

    io.on("connection",(socket)=>{
    console.log("User connected:",socket.id); 
    locationTrack(io,socket);
    chat(io,socket);

})

    return io;

}