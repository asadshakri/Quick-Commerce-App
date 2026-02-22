const express=require('express');
const router=express.Router();

const middleware=require("../middleware/auth");
const adminController=require("../controller/adminController");

router.post("/login",adminController.loginAdmin);
router.post("/addProduct",middleware.authenticate,adminController.addProduct);
router.get("/getProduct/:productId",adminController.getProduct);
router.put("/editProduct",adminController.editProduct);
router.delete("/deleteProduct/:productId",middleware.authenticate,adminController.deleteProduct);
router.get("/getAllOrders",middleware.authenticate,adminController.getAllOrders);
//router.put("/updateLocation/:orderId",middleware.authenticate,adminController.updateLocation);
router.get("/getOrder/:orderId",middleware.authenticate,adminController.getOrder);



module.exports=router;