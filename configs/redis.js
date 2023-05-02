const Redis=require('ioredis');
require('dotenv').config();

const redisClient=new Redis(`redis://default:${process.env.redisLabsPass}@redis-17881.c301.ap-south-1-1.ec2.cloud.redislabs.com:17881`)

redisClient.on('connect',async()=>{
    console.log('Connected to Redis Labs')
})
redisClient.on('error',async(err)=>{
    console.log('Error connecting Redis Labs',err)
})

module.exports={
    redisClient
}