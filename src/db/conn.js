const mongoose=require("mongoose")
mongoose.connect("mongodb://localhost:27017/ttchanell",{useNewUrlParser:true , useUnifiedTopology:true,useFindAndModify:true,useCreateIndex:true}).then( ()=>
    console.log("connection successful")
).catch((err)=>console.log(err))

