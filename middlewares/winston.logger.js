const winston= require("winston")
const {MongoDB}=require('winston-mongodb')
require('dotenv').config();

const logger=winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports:[
        new MongoDB({
            level: 'info',
            db: process.env.winston_mongoURL,
            collection: "logs",
            options:{
                useUnifiedTopology: true
            }
        })
    ]
})
// logger.log({level:'info',message:`new database connection at ${new Date().toDateString()}`})
logger.log({level:'info'})
module.exports={
    logger
}