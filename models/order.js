const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const orderSchema=new Schema({
    products:[
        {
            product:{type:Object,required:true},
            quantity:{type:Number,required:true}
        }
    ],
    user:{
        userId:{type:Schema.Types.ObjectId,ref:"User",required:true},
        name:{type:String,required:true}
    },

    status: {
        type: String,
        default: "PENDING"
      },
      deliveryLocation: {
        lat: Number,
        lng: Number
      },

      currentLocation: {
        lat: Number,
        lng: Number
      },
      receiptUrl: {
        type: String
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
    });


module.exports=mongoose.model("Order",orderSchema)