
const jwt=require("jsonwebtoken")
const Register=require("../models/registers")
//const jwt = require('njwt')
//const cookieParser=require("cookie-parser")
const auth=async(req,res,next)=>{
try {
    const token= req.cookies.jwt;
    //console.log(token)
    const verifyUser=jwt.verify(token,"mynameisravishiamstudyingnodejsim")
    console.log(verifyUser)
    const user=await Register.findOne({_id:verifyUser._id})
    console.log(user.name)
    req.token=token
    req.user=user
    //console.log(user)
    next();
} catch (error) {
    res.status(401).send(error);
}
}
module.exports=auth;
