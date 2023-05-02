const ipregex=(req,res,next)=>{
    const {ip}=req.params;
    // console.log(ip)
    const regex=/((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/ 
    const result=regex.test(ip)
    if(result){
        next()
    }else{
        return res.send("wrong Ip provided")
    }
}

module.exports={
    ipregex
}