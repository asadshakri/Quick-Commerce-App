const User=require("../models/user");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const Product=require("../models/product");
const Order=require("../models/order");
const path=require("path");
const addUser=async (req, res) => {
    try{
        const { name, email, password, phone , address } = req.body;
        if (!name || !email || !password || !phone || !address) {
            return res.status(400).json({ message: "Details are required" });
        }

        const user=await User.findOne({ email: email })
        if (user) {
            return res.status(400).json({ message: "User with this email already exists" });
        }
        
        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                return res.status(500).json({ message: "Error hashing password" });
            }

            const newUser = new User({
                name: name,
                email: email,
                    phone: phone,
                    address: address,
                password: hash,
                cart: { items: [] }
            });
            await newUser.save();
            return res.status(201).json({ message: "User created successfully" });
        });
    }
    catch(err)
    {
        return res.status(500).json({ message: err.message });
    }
}

const loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password)
        {
            return res.status(400).json({message:"Email and password are required"});
        }
        const dbUser=await User.findOne({email:email});
        if(!dbUser)
        {
            return res.status(404).json({message:"User not found"});
        }
        bcrypt.compare(password,dbUser.password,(err,result)=>{
            if(err)
            {
                return res.status(500).json({message:"Error comparing passwords"});
            }
            if(result)
            {
                const token=jwt.sign({userId:dbUser._id},`${process.env.TOKEN}`,{expiresIn:"1h"});
                res.cookie("token", token, {
                    httpOnly: true,
                    sameSite: "lax",
                    maxAge: 60 * 60 * 1000
                  }).status(200).json({
                      message: "User login successful",
                      token: token,
                      email: email,
                    });
            }
            else
            {
                return res.status(401).json({message:"Invalid credentials"});
            }
        });
    }
    catch(err)
    {
        return res.status(500).json({message:err.message});
    }
}


const getProfile=async(req,res)=>{
    try{
        const userId=req.user._id;
        const userDetails=await User.findById(userId);
        res.status(200).json({name:userDetails.name,email:userDetails.email,phone:userDetails.phone,address:userDetails.address});
    }
    catch(err)
    {
        res.status(500).json({message:err.message});
    }
  }


  const deleteUser=async(req,res)=>{
    try{
        const userId=req.user._id;
        res.clearCookie("token");
        await User.findByIdAndDelete(userId);
        res.status(200).json({message:"User deleted successfully"});
    }
    catch(err)
    {
        res.status(500).json({message:err.message});
    }
  }

  const shop=(req,res)=>{
     res.sendFile(path.join(__dirname,"../View/shop/shop.html"));
    }



  const changePassword=async(req,res)=>{
    try{
        const {oldPassword,newPassword}=req.body;
        const userId=req.user._id;
        const userDetails=await User.findById(userId);
        bcrypt.compare(oldPassword, userDetails.password, (err, result) => {
            if (err) {
              throw new Error("Something went wrong");
            }
            if (result == true) {
                const saltrounds = 10;
                bcrypt.hash(newPassword, saltrounds, async (err, hash) => {
                    if (err) console.log(err);
              
                    await User.updateOne({ _id: userId }, {$set: { password: hash }});
                    console.log("Password successfully changed");
                    res.status(200).json({ message: "Password changed successfully" });
                  });
              
              return;
            } else {
              res
                .status(401)
                .json({ message: "Old Password incorrect" });
              return;
            }
          });
    }
    catch(err)
    {
        res.status(500).json({message:err.message});
    }
  }


  const updateProfile=async(req,res)=>{
    try{
        const {name,email,phone,address}=req.body;
        const userId=req.user._id;
        await User.updateOne({_id:userId},{$set:{name:name,email:email,phone:phone,address:address}});
        res.status(200).json({message:"Profile updated successfully"});
    }
    catch(err)
    {
        res.status(500).json({message:err.message});
    }
  }


const getProducts=async(req,res)=>{
    try{
        const products=await Product.find();
        return res.status(200).json(products);
    }
    catch(err)
    {
        return res.status(500).json({message:err.message});
    }
}


const addToCart=(req,res)=>{
    
        const {productId}=req.body;
        Product.findById(productId).then(product=>{
            if(!product)
            {
                return res.status(404).json({message:"Product not found"});
            }
            req.user.addToCart(product).then(()=>{
                return res.status(200).json({message:"Product added to cart"});
            }).catch(err=>{
                return res.status(500).json({message:err.message});
            });
        }
        ).catch(err=>{
            return res.status(500).json({message:err.message});

        });
    }

    const getCart=async(req,res)=>{
        try{
            const usersDetails=await req.user.populate("cart.items.productId")
            const cartProducts= usersDetails.cart.items;
        // console.log(cartProducts);
            const totalPrice=cartProducts.reduce((total,item)=>{
                return total+item.productId.price*item.quantity;
            },0);
            return res.status(200).json({cartProducts,totalPrice});
        }
        catch(err)
        {
            return res.status(500).json({message:err.message});
        }
    }

    const deleteFromCart=async(req,res)=>{
        try{
            const productId=req.params.productId;
            await req.user.deleteFromCart(productId);
            return res.status(200).json({message:"Product removed from cart"});
        }
        catch(err)
        {
            return res.status(500).json({message:err.message});
        }
    }


const checkout=async(req,res)=>{
    try{

        const {lat,lng}=req.body;

        if(!lat || !lng)
        {
            return res.status(400).json({message:"Location data is required for checkout"});
        }


       const usersDetails=await req.user.populate("cart.items.productId")
         const cartProducts= usersDetails.cart.items.map(item=>{
            return {product:{...item.productId._doc},quantity:item.quantity};
            });
        
            const order=new Order({
                user:{
                    name:req.user.name,
                    userId:req.user._id
                },
                products:cartProducts,
                deliveryLocation:{
                    lat,
                    lng
                },
                    status:"Payment Pending"
             
            });
            await order.save();

        
        return res.status(200).json({message:"Order Created",orderId:order._id});
    }
    catch(err)
    {
        return res.status(500).json({message:err.message});
    }
}

const getOrders=async(req,res)=>{
    try{
        const orders=await Order.find({"user.userId":req.user._id, status: { $ne: "Payment Pending" } });
        return res.status(200).json(orders);
    }
    catch(err)
    {
        return res.status(500).json({message:err.message});
    }
}


const s3 = require("../utils/s3");
const { v4: uuidv4 } = require("uuid");

const getReceipt=async(req,res)=>{
    try{
      const orderId=req.params.orderId;
        const orderDetails=await Order.findOne({_id:orderId,"user.userId":req.user._id}).populate("user.userId");

      if(orderDetails.receiptUrl)
       {
        return res.status(200).json({downloadUrl:orderDetails.receiptUrl});
       }
        if(!orderDetails)
        {
            return res.status(404).json({message:"Order not found"});
        }
         
        const fileName = `Receipt/${uuidv4()}-${orderId}.txt`;

        let data = `Receipt for Order ID: ${orderDetails._id}\n\n`;
        data += `Customer Name: ${orderDetails.user.name}\n`;
        data += `Customer Email: ${orderDetails.user.userId.email}\n\n`;
        data += `Products:\n`;
        orderDetails.products.forEach((item, index) => {
            data += `${index + 1}. ${item.product.name} - Rs${item.product.price} x ${item.quantity}\n`;
        });
        const totalPrice = orderDetails.products.reduce((total, item) => total + item.product.price * item.quantity, 0);
        data += `\nTotal Price: Rs${totalPrice}\n`;

    const upload = await s3.upload({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: data,
      ContentType: "text/plain",
      ACL: "public-read"
    }).promise();

    const fileUrl = upload.Location;
    orderDetails.receiptUrl = fileUrl;
   await orderDetails.save();
    res.status(200).json({ downloadUrl: fileUrl });

    }
catch(err)
    {
        return res.status(500).json({message:err.message});
    }
}



module.exports={addUser,
    loginUser,
    getProducts,
    addToCart,
    getCart,
    deleteFromCart,
    checkout,
    getOrders,
    getReceipt,
    getProfile,
    deleteUser,
    changePassword,
    updateProfile,
    shop
};