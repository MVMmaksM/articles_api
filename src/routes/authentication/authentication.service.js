import crypto from "crypto";
import Users from "../../db/models/users.js";
import ConfirmationCodes from "../../db/models/confirmation_codes.js";
import UserTokens from "../../db/models/user_tokens.js";
import AuthenticationError from "../../errors/authentication_error.js";
import begin_transaction from "../../db/begin_transaction.js";
import commit_transaction from "../../db/commit_transaction.js";

const access_user = async (cred_phone)=>{
    const instance = global.instance;

    let phone_number = Buffer.from(cred_phone, "base64").toString();
    phone_number = Number(phone_number);  

    const user = await Users.find_user_phone(instance, phone_number);

    if(!user)
        throw new AuthenticationError("Пользователь с указанным номером телефона не найден, зарегистрируйтесь", 404, "Not found");
    
    if(!user?.is_confirm)
        throw new AuthenticationError("Учетная запись не подтверждена. Подтвердите учетную запись запросив повторно код подтверждения.");

    return user?.user_id;
}

const create_user_token = async(user_id) =>{
    const instance = global.instance;

    const token = generate_token(); 
       
    await begin_transaction(instance);    
    const user_token_id = await UserTokens.add_token(instance, user_id, token);
    await commit_transaction(instance);
    
    return token;
}

const create_confirm_code = async (user_id)=>{
    const instance = global.instance;
    const confirmation_code = Math.floor(100000 + Math.random() * 900000);

    await begin_transaction(instance);
    const code_id = await ConfirmationCodes.add_code(instance, user_id, confirmation_code, null, true);
    await commit_transaction(instance);
    return code_id;
}

const generate_token = ()=>{
    return crypto.randomBytes(48).toString("base64");   
}

const confirmation_code = async (confirm) =>{  
    const instance = global.instance;

    let confirm_cred = Buffer.from(confirm, "base64")?.toString(); 
    confirm_cred = confirm_cred?.split(":");   
    
    await begin_transaction(instance);
    //0 индекс - code_id, 1 - code
    const code = await ConfirmationCodes.find_code(instance, confirm_cred[0], confirm_cred[1], null, true);  
    
    if(!code)
        throw new AuthenticationError("Код подтверждения или code_id не найден");

    //время действия кода в минутах
    const time_action_code = 5;  
    
    if((Date.now() - new Date(code?.created_on_tz).getTime()) > time_action_code*60000)
        throw new AuthenticationError("Время действия кода подтверждения истекло. Запросите код повторно");

    if(code?.used_on_tz)
        throw new AuthenticationError("Данный код подтверждения уже использован. Запросите код повторно");

    await ConfirmationCodes.used_confirm_code(instance, code?.code_id);
   
    await commit_transaction(instance);
    return code?.user_id;
}

export {access_user, create_user_token, create_confirm_code, confirmation_code}