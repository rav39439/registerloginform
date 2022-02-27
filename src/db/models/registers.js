const bcrypt = require('bcryptjs')
const mongoose=require("mongoose")
const jwt=require("jsonwebtoken")
const playistSchema=new mongoose.Schema({
    name:String,
    email:String,
    author:String,
    videos:Number,
    password:String,
    date:{
        type:Date,
        default:Date.now

    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]

})
playistSchema.methods.generateAuthToken=async function(){
try {
    const token=jwt.sign({_id:this._id.toString()}, "mynameisravishiamstudyingnodejsim")
    this.tokens=this.tokens.concat({token})
    await this.save()
    
    return token;
} catch (error) {
    res.send("the error part is" + error)
    console.log("the error is" + error)
}
}
playistSchema.pre('save',async function(next){
if(this.isModified("password")){
    //const passwordhash=await bcrypt.hash(password ,10)
    console.log(`current password ${this.password}`)

    this.password= await bcrypt.hash(this.password,10)
    console.log(`changed password ${this.password}`)
    
}
next()

})
const Register=new mongoose.model("Register",playistSchema);
module.exports=Register;
