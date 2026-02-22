const Order=require("../../models/order");

module.exports=(io,socket)=>{

    socket.on("joinOrderRoom",(orderId)=>{
        socket.join(orderId);
        console.log(`User ${socket.id} joined room ${orderId}`);
    }
    )

    socket.on("startDelivery", (orderId) => {
        socket.join(orderId);
        console.log("Delivery started:", orderId);
      });
    
      socket.on("locationUpdate", ({ orderId, lat, lng }) => {

        io.to(orderId).emit("locationUpdate", { lat, lng });
    
        socket.lastSaved = socket.lastSaved || 0;
        if (Date.now() - socket.lastSaved > 10000) {
          Order.findByIdAndUpdate(orderId, {
            currentLocation: { lat, lng },
            status: "OUT_FOR_DELIVERY",
            updatedAt: new Date()
          }).exec();
    
          socket.lastSaved = Date.now();
        }
      });
    
      socket.on("deliveryCompleted", async (orderId) => {
        await Order.findByIdAndUpdate(orderId, {
          status: "DELIVERED"
        });
    
        io.to(orderId).emit("deliveryCompleted");
        console.log(" Delivery completed:", orderId);
      });


}