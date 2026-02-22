const { createOrder } = require("../services/cashfreeService");
const path = require("path");
const {cashfree} = require("../services/cashfreeService");
const user=require("../models/user");
const order=require("../models/order");
const payment= require("../models/payment");



exports.getPaymentPage = async (req, res) => {
  res.sendFile(path.join(__dirname, "..", "View", "pay","index.html"));
};



exports.processPayment = async (req, res) => {


  try{
   console.log(req.body.orderId);
    const db=await order.findOne({
        _id:req.body.orderId,
    })

   // console.log(db);

    const paymentId = "ORDER-" + Date.now();
    const orderAmount = db.products.reduce((total, item) => total + item.product.price * item.quantity, 0);
    const orderCurrency = "INR";
    const customerPhone = "1234567890";
    const customerID = "1"

 console.log(orderAmount);


    const paymentSessionId = await createOrder(
      paymentId,
      orderAmount,
      orderCurrency,
      customerID,
      customerPhone
    );
console.log(paymentSessionId);
    const paymentDone=new payment({
        paymentId,
        orderAmount,
        orderCurrency,
        paymentStatus:"pending",
        orderId:req.body.orderId,
        paymentSessionId
        })
        await paymentDone.save();

    res.status(200).json({ paymentSessionId, paymentId});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPaymentStatus = async (req,res) => {
  try {
    const paymentId=req.params.orderId;
    console.log("Fetching payment status for:", paymentId);
    const response = await cashfree.PGOrderFetchPayments(paymentId);
    console.log("Order fetched successfully:", response.data);

    let getOrderResponse = response?.data ?? response;

    let orderStatus;

    if (
      getOrderResponse.filter(
        (transaction) => transaction.payment_status === "SUCCESS"
      ).length > 0
    ) {
      orderStatus = "Success";
    } else if (
      getOrderResponse.filter(
        (transaction) => transaction.payment_status === "PENDING"
      ).length > 0
    ) {
      orderStatus = "Pending";
    } else {
      orderStatus = "Failure";
    }
   
   await payment.updateOne(
    {
        paymentId:paymentId
    },
    {
        $set:{
            paymentStatus:orderStatus
        }
    }
    )

    const payment_details= await payment.findOne({
        paymentId:paymentId
    })

    if(orderStatus=="Success")
        {
         await order.updateOne(
           { _id: payment_details.orderId },
           { $set: { status: "PLACED" } }
         );
         const orderDoc = await order
         .findOne({ _id: payment_details.orderId })
         .populate("user.userId");
     
       await orderDoc.user.userId.clearCart();
     }

  else if(orderStatus=="Failure")
  {
    await payment.deleteOne({
        _id:payment_details._id
    })
   
  }

       res.status(200).json({orderStatus,paymentId});
     } 
    
   
     catch (error) {
       console.log(
         "Error:",
         error?.response?.data?.message || error.message
       );
       res.status(500).json({message:error.message});
     }
   };
   