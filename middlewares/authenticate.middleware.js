const express = require("express")
const jwt = require("jsonwebtoken")

const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        let decoded = jwt.verify(token, 'key');
       
        if(decoded)
        {
            let userID=decoded.userID;
           
            req.body.userID=userID;
            
            next()
        }
        else{
            res.send({"message":"you are not authorized"})
        }
        
    }
    else
    {
        res.send({"message":"you are not authorized"})
    }

}

module.exports={
    authenticate
}


