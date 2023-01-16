const express = require("express")
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const { UserModel } = require("../models/usermodel.model");
const userRoute = express.Router();
userRoute.use(express.json());


userRoute.post("/register", async (req, res) => {
    const { name, email, gender, password } = req.body;
    try {
        bcrypt.hash(password, 5, async (err, encrypted_password) => {
            if (err) {
                console.log(err)
                res.send("error")
            }
            else {
                const data = new UserModel({ name, email, gender, password: encrypted_password })

                await data.save();
                res.send({"message":"User registered successfully"})
            }
        });
    }
    catch (err) {
        console.log(err)
        res.send({ "message": "something went wrong" });
    }
})

userRoute.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.find({ email });
        if (user.length > 0) {
            bcrypt.compare(password, user[0].password, (err, result) => {
                if (result) {
                    let token = jwt.sign({ userID: user[0]._id }, 'key');
                    res.send({ "message": "Login done", "token": token })
                }
                else {
                    res.send({ "message": "wrong credentials" })
                }
            });
        }
        else {
            res.send({ "message": "wrong credentials" })
        }
    }
    catch (err) {
        console.log(err)
        res.send({ "message": "wrong credentials" });
    }
})


module.exports = {
    userRoute
}