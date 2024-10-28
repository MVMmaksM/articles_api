import Users from "../../db/models/users.js";
import ConfirmationCodes from "../../db/models/confirmation_codes.js";
import AppError from "../../errors/app_error.js";
import ERRORS from "../../errors/error_codes.js";

const registration_phone = async(cred_phone)=>{   
    const instance = global.instance; 

    let phone_number = Buffer.from(cred_phone, "base64").toString();
    phone_number = parseInt(phone_number);
    
    if(!phone_number)
        throw new AppError(ERRORS.NOT_VALID_PHONE.error_message, 500, ERRORS.NOT_VALID_PHONE.error_code);
    
    const user = await Users.find_user_phone(instance, phone_number);  

    if(user)
        throw new AppError(ERRORS.EXIST_PHONE.error_message, 500, ERRORS.EXIST_PHONE.error_code);

    const user_id = await Users.create_user(instance, 
        {
            phone: phone_number,
            login: null,
            password: null
        });  

    const confirmation_code = Math.floor(Math.random() * (999999 - 111111) + 0);   

    const code_id = await ConfirmationCodes.add_code(instance, user_id, confirmation_code);   

    return code_id;
}

const confirmation_code = async (confirm_code_id) =>{
    if(!confirm_code_id)
        throw new AppError(ERRORS.NOT_CONFIRM_CODE.error_message, 500, ERRORS.NOT_CONFIRM_CODE.error_code);

    let confirm_cred = Buffer.from(confirm_code_id, "base64").toString(); 

    if(!confirm_cred)
        throw new AppError(ERRORS.NOT_CONFIRM_CODE.error_message, 500, ERRORS.NOT_CONFIRM_CODE.error_code);

    confirm_cred = confirm_cred.split(":");
    
    if(!confirm_cred[0] || !confirm_cred[1])
        throw new AppError(ERRORS.NOT_VALID_CONF_CODE.error_message, 500, ERRORS.NOT_VALID_CONF_CODE.error_code);

    const code_id = await ConfirmationCodes.find_code_code_id(instance, confirm_cred[0], confirm_cred[1]);   
    
    if(!code_id)
        throw new AppError(ERRORS.NOT_VALID_CONF_CODE.error_message, 500, ERRORS.NOT_VALID_CONF_CODE.error_code);

    return code_id;
}

export {registration_phone, confirmation_code}