async function res_start_time(req, res, next) {
    req.startTime = (new Date).getTime();   
    next();
}

async function res_end_time(req, res, next) {
    res.on("finish", ()=>{
        console.log(req);
        console.log(`[${req.method} ${req.originalUrl} ${JSON.stringify(req.body)} ${res.statusCode} ${((new Date).getTime() - req.startTime)/1000}s]`);      
    });
    next();
}

export {res_start_time, res_end_time}