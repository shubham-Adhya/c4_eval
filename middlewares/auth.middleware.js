require('dotenv').config();
const {redisClient}=require('../configs/redis')
const jwt=require('jsonwebtoken')
const {UserModel}=require('../model/user.model')

const authmiddleware=async(req,res,next)=>{
    try {
        const token=req.headers.authorization?.split(' ')[1];

        const blackListRedis=await redisClient.lrange("BL_list",0,-1)
        // console.log(blackListRedis)
        if(blackListRedis.includes(token)){
            return res.status(401).send({message: "Unauthorized"})
        }

        const decodedToken=jwt.verify(token,process.env.JWT_secret);
        const {userId}=decodedToken;
        const user=await UserModel.findById(userId);
        if(!user){
            return res.status(401).send({message: "Unauthorized"})
        }

        req.userId=user._id
        next()

    } catch (error) {
        return res.status(401).send({message: "Unauthorized"})
    }
}

module.exports={
    authmiddleware
}