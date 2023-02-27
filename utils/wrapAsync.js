module.exports = errorfunc =>{
    return(req, res, next)=>{
        errorfunc(req, res, next).catch(next);
    }
}