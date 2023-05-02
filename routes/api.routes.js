const express=require('express');
require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const apirouter=express.Router();
const {redisClient}=require('../configs/redis')
const {UserModel}=require('../model/user.model')
const {ipregex}=require("../middlewares/ipvalidation.middleware")


apirouter.get("/getIPinfo/:ip",ipregex,async(req,res)=>{
    const {ip}=req.params;
    // console.log(ip)
    //storing searches
    // console.log(req.userId)
    const searches= await UserModel.findOne({_id:req.userId})
    if(!searches.Searches.includes(ip)){
        await UserModel.findOneAndUpdate({_id:req.userId},{$push: {Searches: ip}})
    }

    await redisClient.get(ip,async(err,result)=>{
        if(err){
            console.log("Error getting city from redis",err)
        }else{
            if(result){
                console.log("from redis "+ result)
                return res.status(200).send(`Your IP location is ${result}`)
            }else{
                console.log("making api call")
                await fetch(`https://ipapi.co/${ip}/json/`)
                .then((result)=>result.json())
                .then(async(result)=>{
                    // console.log(result)
                    
                    await redisClient.set(ip,result.city,'ex',21600) // expiry 6hrs

                    return res.status(200).send(`Your IP location is ${result.city}`)
                })
                .catch((err)=>{
                    console.log(err);
                    return res.status(500).send(`Something went wrong`)
                })
            }
        }
    })
    
    
})

module.exports={
    apirouter
}