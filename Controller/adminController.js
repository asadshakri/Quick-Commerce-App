const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt=require("jsonwebtoken");
const Product=require("../models/product");
const User=require("../models/user");
const Order=require("../models/order");


const loginAdmin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if(email!==process.env.ADMIN_EMAIL){
        res.status(401).json({ message: "Not authorized! Invalid admin email" });
        return;
      }
     
      bcrypt.compare(password, process.env.ADMIN_PASSWORD, (err, result) => {
        if (err) {
          throw new Error("Something went wrong");
        }
        if (result == true) {
          res
            .status(200)
            .json({
              message: "Admin login successful",
              token: jwt.sign( {userId:process.env.ADMIN_ID} , process.env.TOKEN, { expiresIn: "1h" }),
              email: email,
            });
          return;
        } else {
          res
            .status(401)
            .json({ message: "User not authorized! Password incorrect" });
          return;
        }
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };


  const addProduct=async(req,res)=>{
    try{
      const {name,price,description,imageUrl}=req.body;
      if(req.user.id!==process.env.ADMIN_ID)
        {
            return res.status(401).json({message:"Not authorized! Only admin can add products"});
        }

        const product=new Product({
            name:name,
            price:price,
            description:description,
            imageUrl:imageUrl
        });
       await product.save();
        
      return res.status(201).json({message:"Product added successfully"});
    }
    catch(err)
    {
      return res.status(500).json({message:err.message});
    }
  }

  const getProduct=async(req,res)=>{
   try{
    const productId=req.params.productId;
     const product=await Product.findById(productId);
      if(!product)
      {
        return res.status(404).json({message:"Product not found"});
      }
      return res.status(200).json(product);
   }
    catch(err)
    {
      return res.status(500).json({message:err.message});
    }

  }

  const editProduct=async(req,res)=>{
    try{
      const {name,price,description,imageUrl,id}=req.body;
      
      const product= await Product.findById(id);
      product.name=name;
      product.price=price;
      product.description=description;
      product.imageUrl=imageUrl;
      await product.save();
      return res.status(200).json({message:"Product updated successfully"});
    }
    catch(err)
    {
      return res.status(500).json({message:err.message});
    }
  }



const deleteProduct=async(req,res)=>{
  try{
    const productId=req.params.productId;
    await Product.findByIdAndDelete(productId);
    return res.status(200).json({message:"Product deleted successfully"});
  }
  catch(err)
  {
    return res.status(500).json({message:err.message});
  }
}

const getAllOrders=async(req,res)=>{
  try{

    const orders=await Order.find();
    return res.status(200).json(orders);
  }
  catch(err)
  {
    return res.status(500).json({message:err.message});
  }
}


const getOrder=async(req,res)=>{
  try{
    const orderId=req.params.orderId;
    const orderLocation=await Order.findById(orderId).select("deliveryLocation");
    if(!orderLocation)
    {
      return res.status(404).json({message:"Order not found"});
    }
    return res.status(200).json(orderLocation);
  }
  catch(err)
  {
    return res.status(500).json({message:err.message});
  }
}

/*const updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.currentLocation = { lat, lng };
    order.status = "OUT_FOR_DELIVERY";
    await order.save();

    const io = req.io;
    io.to(orderId).emit("locationUpdate", {
      lat,
      lng
    });

    return res.status(200).json({ message: "Location updated" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};*/

module.exports = { loginAdmin,addProduct ,getProduct,editProduct,deleteProduct,getAllOrders,getOrder};