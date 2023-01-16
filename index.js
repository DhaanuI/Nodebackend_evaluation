const express=require("express")
const mongoose=require("mongoose");
const app=express();
app.use(express.json());
mongoose.set('strictQuery', true);
const {connection}=require("./config/db");
require('dotenv').config();

const cors=require("cors")

const { userRoute } = require("./routes/user.route");
const { postRoute } = require("./routes/post.route");
const { authenticate } = require("./middlewares/authenticate.middleware");

app.use(cors());


app.use("/users",userRoute)
app.get("/",(req,res)=>{
    res.send("Homepage")
})

app.use(authenticate)
app.use("/posts",postRoute)


app.listen(process.env.port,async()=>{
    try{
        await connection;
        console.log("Connected to Database")       
    }
    catch(err)
    {
        console.log(err)
    }

    console.log(`Server is running on port ${process.env.port}`)
})
