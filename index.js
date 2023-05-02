const express= require('express');
const cors=require('cors')
require('dotenv').config();
const {connection}=require('./configs/mongoDB')

const {userRouter}=require('./routes/user.routes')
const {apirouter}=require('./routes/api.routes')
const {authmiddleware}=require('./middlewares/auth.middleware')
const logger=require('./middlewares/winston.logger')

const app=express();

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.status(200).send("c4 Evaluation")
})

app.use('/user',userRouter)


app.use('/api',authmiddleware,apirouter)

app.listen(process.env.PORT, async()=>{
    try {
        await connection
        console.log("Connected to MongoDB")
        // logger.log("info",`new database connection at ${new Date().toDateString()}`)
        
    } catch (error) {
        console.log(error)
    }
    console.log(`Server is running at port ${process.env.PORT}`)
})

