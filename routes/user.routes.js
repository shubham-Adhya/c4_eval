const express=require('express');
require('dotenv').config();
const {UserModel}=require('../model/user.model')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const {redisClient}=require('../configs/redis')
const userRouter=express.Router();

userRouter.post('/signup',async(req,res)=>{
    try {
        const {name,email,password}=req.body

        const userExists=await UserModel.findOne({email});
        if(userExists){
            return res.status(400).send({message: "User already exists"})
        }

        const hashedPass=bcrypt.hashSync(password,3);
        const user=new UserModel({email,password:hashedPass,name})
        user.save();
        return res.status(200).send({message: "User creation success"})
    } catch (error) {
        console.log(error);
        return res.status(500).send("Something went wrong")
    }
})
userRouter.post('/login',async(req,res)=>{
    try {
        const {name,email,password}=req.body

        const user=await UserModel.findOne({email});
        if(!user){
            return res.status(401).send({message: "User not found"})
        }

        const passCompare=await bcrypt.compare(password,user.password);
        if(!passCompare){
            return res.status(401).send({message: "Wrong Password"})
        }

        const token=jwt.sign({userId:user._id},process.env.JWT_secret)

        res.status(200).send({message: "Login Success", token})


    } catch (error) {
        console.log(error);
        return res.status(500).send("Something went wrong")
    }
})


userRouter.get('/logout',async(req,res)=>{
    const token=req.headers.authorization?.split(' ')[1];
    await redisClient.rpush('BL_list',token,(err,result)=>{
        if(err) {
            console.log("Error setting the black list token to redis",err)
            return res.status.apply(500).send("Something went wrong")
        } else {
            if(result){
                console.log("Value set in redis")
                return res.status(200).send({message: "Logout Success",status:result})
            }else{
                return res.status.apply(500).send("Something went wrong")
            }
        }
    })
})

module.exports={
    userRouter
}