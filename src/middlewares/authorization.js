import UserTokens from "../db/models/user_tokens.js";
import AuthorizationError from "../errors/authorize_error.js";

const authorize = async (req, res, next)=>{  
    try{
        const instance = global.instance;
        const token = req.headers["authorization"];        

        if(!token)
            throw new AuthorizationError("Не указан token");

        const user = await UserTokens.find_user_token(instance, token);      
        
        if(!user)
            throw new AuthorizationError("Указанный токен не найден");

        req.user = user;
        next();
    }catch(err){
        next(err);
    }
}

export default authorize;