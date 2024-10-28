import AppError from "../errors/app_error.js";
import ERRORS from "../errors/error_codes.js";

const authorize = async (req, res, next)=>{  
    try{
        const token = req.headers["authorization"] ? Buffer.from(req.headers["authorization"], "base64").toString() : undefined;  

        if(!token)
            throw new AppError(ERRORS.NOT_AUTH.error_message, 401, ERRORS.NOT_AUTH.error_code);

        const user_id = global.user_tokens.find(ut => ut.token === token)?.user_id;

        if(!user_id)
            res.status(401).json({errorCode: -1, errorMsg: "Не авторизован"});

        next();
    }catch(err){
        next(err);
    }
}

export default authorize;