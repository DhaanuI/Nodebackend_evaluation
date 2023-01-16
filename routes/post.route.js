const express=require("express");
const jwt  = require("jsonwebtoken");
const mongoose=require("mongoose");
const { PostModel } = require("../models/postmodel.model");
const postRoute=express.Router();
postRoute.use(express.json());

postRoute.get("/",async(req,res)=>{
    const query=req.query;
    console.log(query)
       try{   
         const data=await PostModel.find(query)
         res.send(data);

       }
       catch(err)
       {
          console.log(err)
          res.send("error in getting all posts")
       }
})

postRoute.post("/create",async(req,res)=>{
    const {title,body,device,userID}=req.body;
    try{   
      const data=new PostModel({title,body,device,userID})
      await data.save();
      res.send(data);

    }
    catch(err)
    {
       console.log(err)
       res.send("error in getting all posts")
    }
})

postRoute.patch("/update/:id",async(req,res)=>{
    const ID=req.params.id;
    const payload=req.body
    const data=await PostModel.find({_id:ID});
    const userid_in_req=payload.userID;
    const userid_in_doc=data[0].userID;
    
    try{
        if(userid_in_req!==userid_in_doc)
        {
            res.send({"message":"you arenot authorised"})
        }
        else{
            await PostModel.findByIdAndUpdate({_id:ID},payload)
            res.send("Database modified")
        }

    }
    catch(err)
    {
          console.log(err)
          res.send("error")
    }
    
})

postRoute.delete("/delete/:id",async(req,res)=>{
    const ID=req.params.id;
    
    const data=await PostModel.find({_id:ID});
    let token=req.headers.authorization
    var decoded = jwt.verify(token, 'key');
    
    const userid_in_doc=data[0].userID;
    
    try{
        if(decoded.userID!==userid_in_doc)
        {
            res.send({"message":"you arenot authorised"})
        }
        else{
            await PostModel.findByIdAndDelete({_id:ID})
            res.send("Particular data has been deleted")
        }

    }
    catch(err)
    {
          console.log(err)
          res.send("error")
    }
})

module.exports={
    postRoute
}