const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const messageSchema= new Schema({
        message: {
            type: String,
            required: true
        },
        roomName: {
            type: String,
            required: true
        },
        type: {
            type: String,
            defaultValue: "text"
        },
        mediaType: {
            type: String
        },
        user:{
            userId:{type:Schema.Types.ObjectId,ref:"User"},
            name:{type:String,required:true},
        }
},
{
    timestamps:true
})


module.exports = mongoose.model("Message", messageSchema);
