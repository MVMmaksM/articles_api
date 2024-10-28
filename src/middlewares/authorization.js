import AppError from "../errors/app_error.js";
import ERRORS from "../errors/error_codes.js";
import UserTokens from "../db/models/user_tokens.js";

const authorize = async (req, res, next)=>{  
    try{
        const instance = global.instance;
        const token = req.headers["authorization"] ? Buffer.from(req.headers["authorization"], "base64").toString() : undefined;  

        if(!token)
            throw new AppError(ERRORS.NOT_AUTH.error_message, 401, ERRORS.NOT_AUTH.error_code);

        const user = await UserTokens.find_user_token(instance, token);

        if(!user)
            throw new AppError(ERRORS.NOT_AUTH.error_message, 401, ERRORS.NOT_AUTH.error_code);

        next();
    }catch(err){
        next(err);
    }
}

export default authorize;