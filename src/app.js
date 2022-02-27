
require('dotenv').config()
const express=require("express")
const bcrypt = require("bcryptjs")
const path = require("path")
const cookieParser=require("cookie-parser")

const app=express()
require("./db/conn")
//const tem=path.join(__dirname ,"../src/db/models/registers")
const Register=require("../src/db/models/registers")
console.log(process.env.SECRET_KEY)
//const te=path.join(__dirname ,"../src/db/middleware/auth")
const auth=require("../src/db/middleware/auth")
const hbs=require("hbs")
const port=5630
const temp= path.join(__dirname , "../public")
app.set('view engine','hbs')
//app.use(express.static(temp))
const tempalt=path.join(__dirname , '../templates/views')
const partials=path.join(__dirname , '../templates/partials')
hbs.registerPartials(partials)
//console.log(process.env.SECRET_KEY)
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))
app.set("views",tempalt)

app.get("/" , (req,res)=>{
    res.render('index')
})
app.get("/secret" ,auth, (req,res)=>{
   res.render("secret")
})

app.get("/logout" ,auth, async(req,res)=>{
    res.clearCookie("jwt")
    console.log("logged out")
    await req.user.save()
    res.render("login")
 })
 

app.get("/register" , (req,res)=>{
    res.render('register')
})

app.post("/register" , async(req,res)=>{
   try{
const registeremployee=new Register({
    name:req.body.name,
   email:req.body.email,
    author:req.body.author,
    videos:req.body.videos,
    password:req.body.password
    
})

const token=await registeremployee.generateAuthToken()
res.cookie('jwt',token,{expires:new Date(Date.now + 30000),httpOnly:true})

const registered=await registeremployee.save()
res.status(201).render("index")
   } catch(error){
   res.status(400).send(error)
   }
})


app.get("/login" , (req,res)=>{
    res.render('login')
})
app.post("/login" , async(req,res)=>{
    try{
   const email=req.body.email;
   const password=req.body.password;
   const usermail=await Register.findOne({email:email})
   console.log(usermail.password)
   console.log(password)
   const token=await usermail.generateAuthToken()
   console.log("the token part is" + token)
   res.cookie('jwt',token,{expires:new Date(Date.now + 1),httpOnly:true})
   console.log(`this is the cookie of request made ${req.cookies.jwt}`)
   const ismatch=bcrypt.compareSync(password,usermail.password)
   console.log(ismatch)
   if(ismatch){
    res.status(201).render("index")
   }
   else{
       res.send("password not matching")
   }
    }
   catch(error){
    res.send(error)
    console.log("invalid")
    }
})

app.listen(port,()=>{
    console.log(`listening to port ${port}`)
})