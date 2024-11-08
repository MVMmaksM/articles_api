import Users from "../../db/models/users.js";
import ConfirmationCodes from "../../db/models/confirmation_codes.js";
import AppError from "../../errors/app_error.js";
import ERRORS from "../../errors/error_codes/error_codes_reg.js";
import begin_transaction from "../../db/begin_transaction.js"
import commit_transaction from "../../db/commit_transaction.js";
import RegistrationError from "../../errors/registration_error.js"

const registration_phone = async(cred_phone)=>{   
    const instance = global.instance; 
    
    await begin_transaction(instance);

    let phone_number = Buffer.from(cred_phone, "base64").toString();
    phone_number = Number(phone_number);   

    const user_id = await Users.create_user(instance, 
        {
            phone: phone_number,
            login: null,
            password: null,
            firstname: null,
            lastname: null
        });  

    const confirmation_code = Math.floor(Math.random() * (999999 - 111111) + 0);  
    const code_id = await ConfirmationCodes.add_code(instance, user_id, confirmation_code); 
    
    await commit_transaction(instance);

    return code_id;
}

const confirmation_code = async (confirm) =>{  
    const instance = global.instance;

    let confirm_cred = Buffer.from(confirm, "base64")?.toString(); 
    confirm_cred = confirm_cred?.split(":");   
    
    await begin_transaction(instance);
    //0 индекс - code_id, 1 - code
    const code = await ConfirmationCodes.find_code(instance, confirm_cred[0], confirm_cred[1]);  
    
    if(!code)
        throw new RegistrationError("Код подтверждения или code_id не найден");

       
    
    await commit_transaction(instance);
    return code_id;
}

export {registration_phone, confirmation_code}