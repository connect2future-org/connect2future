const mongoose=require("mongoose");

const contactSchema=new mongoose.Schema({
fullName:{type:String,required:true,trim:true},
email:{type:String,required:true,trim:true,lowercase:true},
countryCode:{
type:String,
required:true
},
phone:{
type:String,
required:true
},
service:{type:String,required:true},
subService:{type:String,required:true},
message:{type:String,default:"",trim:true},
status:{
type:String,
enum:["New","Read"],
default:"New"
}
},{
timestamps:true
});

module.exports=mongoose.model("Contact",contactSchema);
