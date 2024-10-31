import { ValidationError } from "express-validation";

async function error_handler(err, req, res, next) {
    if (err instanceof ValidationError) {
        console.log(`\nERROR:${JSON.stringify(err)} \n`);
        return res.status(err.statusCode).json(err)
    }else{
        console.log(`\n ${err.stack} \n`);
        return res.status(err.status_code || 500).json({error_code: err.error_code || -1, error_msg: err.message});
    }        
}

export default error_handler;