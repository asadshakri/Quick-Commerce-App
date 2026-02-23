const express=require('express');
const router=express.Router();
const middleware=require("../middleware/auth");
const userController=require("../Controller/userController");

router.post("/signup",userController.addUser);
router.post("/login",userController.loginUser);

router.get("/getProducts",userController.getProducts);
router.post("/addToCart", middleware.authenticate, userController.addToCart);
router.get("/getCart", middleware.authenticate, userController.getCart);
router.delete("/deleteCart/:productId", middleware.authenticate, userController.deleteFromCart);
router.post("/checkout", middleware.authenticate, userController.checkout);
router.get("/getOrders", middleware.authenticate, userController.getOrders);
router.get("/receipt/:orderId", middleware.authenticate, userController.getReceipt);

router.patch("/updateProfile",middleware.authenticate,userController.updateProfile);
router.get("/profile",middleware.authenticate,userController.getProfile);
router.delete("/deleteUser",middleware.authenticate,userController.deleteUser);
router.patch("/changePassword",middleware.authenticate,userController.changePassword);
router.get("/shop",middleware.authenticate,userController.shop);
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
  });

module.exports=router;