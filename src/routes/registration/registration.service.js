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

    const user = await Users.find_user_phone(instance, phone_number);

    //если юзер существует и подтвержден, то пусть аутентифицируется
    if(user && user?.confirm){
        throw new RegistrationError("Пользователь с указанным номером телефона уже существует, аутентифицируйтесь");
    }  

    //если юзер существует, но не подтвержден, то пусть запрашивает повторно код
    if(user && !user?.confirm){
        throw new RegistrationError("Пользователь с указанным номером телефона уже существует. "  +
                                     "Учетная запись не подтверждена, для подтверждения учетной записи повторно запросите код подтверждения");
    }

    const user_id = await Users.create_user(instance, 
        {
            phone: phone_number,
            login: null,
            password: null,
            firstname: null,
            lastname: null
        });  
    
    const code_id = await create_confirm_code(instance, user_id);

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

    //время действия кода в минутах
    const time_action_code = 5;
    console.log(code?.created_on_tz)

    if((Date.now() - new Date(code?.created_on_tz).getTime()) > time_action_code*60000)
        throw new RegistrationError("Время действия кода подтверждения истекло. Запросите код повторно");

    if(code?.used_on_tz)
        throw new RegistrationError("Данный код подтверждения уже использован. Запросите код повторно");


    const result = await ConfirmationCodes.used_confirm_code(instance, code?.code_id);
    console.log(result);
    await commit_transaction(instance);
    return code_id;
}

const create_confirm_code = async(instance, user_id)=>{
    const latest_code =  await ConfirmationCodes.get_latest_user_code(instance, user_id);

    if(latest_code){
        //время действия кода в минутах
        const time_action_code = 5;

        if((Date.now() - new Date(latest_code?.created_on_tz).getTime()) < time_action_code*60000)
            throw new RegistrationError("Время действия последнего кода подтверждения еще не истекло");
    }
    
    const confirmation_code = Math.floor(Math.random() * (999999 - 111111) + 0);  
    const code_id = await ConfirmationCodes.add_code(instance, user_id, confirmation_code); 

    return code_id;
}

const get_again_code = async(cred_phone)=>{
    const instance = global.instance; 
    
    await begin_transaction(instance);

    let phone_number = Buffer.from(cred_phone, "base64").toString();
    phone_number = Number(phone_number);   

    const user = await Users.find_user_phone(instance, phone_number);

    if(!user)
        throw new RegistrationError("Пользователя с указанным номером телефона не существует. Зарегистрируйтесь");

    const code_id = await create_confirm_code(instance, user?.user_id);

    await commit_transaction(instance);
    return code_id;
}

export {registration_phone, confirmation_code, get_again_code}