const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    cart:{
        items:[
            {
                productId:{
                    type:Schema.Types.ObjectId,
                    ref:"Product",
                    required:true
                },
                quantity:{
                    type:Number,
                    required:true
                }
            }
        ]
    },
})


userSchema.methods.addToCart= async function(product)
{
    try{
        const cartItemIndex=this.cart.items.findIndex(item=>{
         return item.productId.toString()===product._id.toString();
        })

        let updatedCartItems=[...this.cart.items];
        let newQuantity=1;

        if(cartItemIndex>=0)
        {
         newQuantity=this.cart.items[cartItemIndex].quantity+1;
         updatedCartItems[cartItemIndex].quantity=newQuantity;
        }
        else{
         updatedCartItems.push({productId: product._id,quantity: newQuantity});
        }

       const updatedCart={items:updatedCartItems};
       this.cart=updatedCart;
       return  await this.save();   
     }
     catch(err)
     {
         throw err;
     }

 }

userSchema.methods.deleteFromCart=async function(productId)
{
    try{
        const updatedCartItems=this.cart.items.filter(item=>{
            return item.productId.toString()!==productId.toString();
        })
        this.cart.items=updatedCartItems;
        return await this.save();
    }
    catch(err)
    {
        throw err;
    }
}

userSchema.methods.clearCart=async function()
{
    try{
        this.cart={items:[]};
        return await this.save();
    }
    catch(err)
    {
        throw err;
    }
}


module.exports=mongoose.model("User",userSchema)