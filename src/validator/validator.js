import ValidationQueryParamsError from "../errors/validation_query_params_error.js";
import VAlidationHeadersError from "../errors/validation_headers_error.js";
import Users from "../db/models/users.js";
import is_base64 from "is-base64";

export default class Validator{
    static async pagination_validate(req, res, next){
        try{
            const offset = Number(req?.query?.offset);
            const limit = Number(req?.query?.limit);      

            if(!Number.isInteger(offset) || Number.isNaN(offset))          
                throw new ValidationQueryParamsError('Обязательный query-параметр offset принимает только целые числа');

            if(offset < 0)
                throw new ValidationQueryParamsError('Обязательный query-параметр offset принимает минимальное значение равное 1');

            if(!Number.isInteger(limit) || Number.isNaN(limit))
                throw new ValidationQueryParamsError('Обязательный query-параметр limit принимает только целые числа');

            if(limit > 200 || limit < 0)
                throw new ValidationQueryParamsError('Обязательный query-параметр limit принимает минимальное значение равное 1 и максимальное значение равное 200');

            next();  
        }catch(err){
            next(err);
        }      
    }

    static async reg_cred_phone_validate(req, res, next){
        try{
            const key_hedears = 'reg'
            let phone = req?.headers[key_hedears];

            if(!phone)
                throw new VAlidationHeadersError(`Не установлен обязательный заголовок ${key_hedears} в headers`);

            if(!is_base64(phone))
                throw new VAlidationHeadersError(`Обязательный заголовок ${key_hedears} в headers не является строкой в кодировке base64`);           

            phone = Buffer.from(phone, "base64").toString();     
            phone = Number(phone);
            
            if(!phone)
                throw new VAlidationHeadersError("Не верно указан номер телефона");

            if(phone.toString().length != 10)
                throw new VAlidationHeadersError("Длина номера телефона должна быть 10 цифр");

            const instance = global.instance;        
            const user_id = await Users.find_user_phone(instance, phone);

            if(user_id)
                throw new VAlidationHeadersError("Пользователь с указанным номером телефона уже существует, аутентифицируйтесь");

            next();
        }catch(err){
            next(err);
        }
    }

    static async reg_confirm_code_validate(req, res, next){
        try{
            const key_hedears = 'confirm'
            let confirm_cred = req?.headers[key_hedears];

            if(!confirm_cred)
                throw new VAlidationHeadersError(`Не передан код подтверждения`);

            if(!is_base64(confirm_cred))
                throw new VAlidationHeadersError(`Обязательный заголовок ${key_hedears} в headers не является строкой в кодировке base64`); 

            confirm_cred = Buffer.from(confirm_cred, "base64").toString();
            confirm_cred = confirm_cred?.split(":");

            //под 0 индексом находится code_id
            if(!confirm_cred[0])
                throw new VAlidationHeadersError(`Не указан code_id`);
            
            //под 1 индексом находится сам код
            const code = Number(confirm_cred[1]); 
            
            if(!code)
                throw new VAlidationHeadersError(`Код подтверждения должен состоять только из цифр`);

            if(code?.toString().length != 6)
                throw new VAlidationHeadersError(`Код подтверждения должен состоять из 6 цифр`);

            next();
        }catch(err){
            next(err);
        }
    }
}
