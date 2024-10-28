import md5 from "md5";
import AppError from "../../errors/app_error.js";
import ERRORS from "../../errors/error_codes.js";
import Users from "../../db/models/users.js";
import ConfirmationCodes from "../../db/models/confirmation_codes.js";
import UserTokens from "../../db/models/user_tokens.js";

const access_user = async (cred_phone)=>{
    const instance = global.instance;
    const phone = parseInt(Buffer.from(cred_phone, "base64").toString());

    if(!phone)
        throw new AppError(ERRORS.NOT_VALID_PHONE.error_message, 500, ERRORS.NOT_VALID_PHONE.error_code);   
    
    if(phone.toString().length != 10)
        throw new AppError(ERRORS.ERR_PHONE_LENGTH.error_message, 500, ERRORS.ERR_PHONE_LENGTH.error_code);

    const user_id = await Users.find_user_phone(instance, phone);

    if(!user_id)
        throw new AppError(ERRORS.EXIST_PHONE.error_message, 500, ERRORS.NOT_EXIST_PHONE.error_code);

    return user_id;
}

const create_user_token = async(user_id) =>{
    const token_hash = md5(user_id.toString() + Date.now().toString());
    let buff = new Buffer(token_hash);
    const token = buff.toString('base64');
    
    const user_token_id = await UserTokens.add_token(instance, user_id, token);

    if(!user_token_id)
        throw new AppError("Ошибка при создании токена", 500, ERRORS.ERR_OTHER_AUTH.error_code);
    
    return token;
}

const create_confirm_code = async (user_id)=>{
    const instance = global.instance;
    const confirmation_code = Math.floor(Math.random() * (999999 - 111111) + 0);
    const code_id = await ConfirmationCodes.add_code(instance, user_id, confirmation_code);
    return code_id;
}

export {access_user, create_user_token, create_confirm_code}