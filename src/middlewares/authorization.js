import AppError from "../errors/app_error.js";
import ERRORS from "../errors/error_codes/error_codes_authorize.js";
import UserTokens from "../db/models/user_tokens.js";

const authorize = async (req, res, next)=>{  
    try{
        const instance = global.instance;
        const token = req.headers["authorization"]; 

        if(!token)
            throw new AppError(ERRORS.NOT_AUTHORIZE.error_message, 401, ERRORS.NOT_AUTHORIZE.error_code);

        const user = await UserTokens.find_user_token(instance, token);      
        
        if(!user)
            throw new AppError(ERRORS.NOT_AUTHORIZE.error_message, 401, ERRORS.NOT_AUTHORIZE.error_code);

        req.user = user;
        next();
    }catch(err){
        next(err);
    }
}

export default authorize;