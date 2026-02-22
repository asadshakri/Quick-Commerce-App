const express=require('express');
const router=express.Router();
const middleware=require("../middleware/auth");
const {processPayment,getPaymentPage,getPaymentStatus}=require("../Controller/paymentController");


router.post("/pay",middleware.authenticate,processPayment);
router.get("/paymentPage",getPaymentPage)
router.get("/payment-status/:orderId",getPaymentStatus)

module.exports=router;