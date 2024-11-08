import ValidationQueryParamsError from "../errors/validation_query_params_error.js";
import VAlidationHeadersError from "../errors/validation_headers_error.js";
import Users from "../db/models/users.js";
import is_base64 from "is-base64";

export default class Validator{
    static async pagination_validate(req, res, next){
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
    }

    static async reg_cred_phone_validate(req, res, next){
        let phone = req?.headers["cred"];

        if(!phone)
            throw new VAlidationHeadersError("Не установлен обязательный заголовок cred в headers");

        if(!is_base64(phone))
            throw new VAlidationHeadersError("Не установлен обязательный заголовок cred не является строкой base64");

        phone = Buffer.from(cred_phone, "base64").toString();     
        phone = Number(phone);
        
        if(!phone)
            throw new VAlidationHeadersError("Не верно указан номер телефона");

        if(phone.toString().length != 9)
            throw new VAlidationHeadersError("Длина номера телефона должна быть 9 цифр");

        const instance = global.instance;        
        const user_id = await Users.find_user_phone(instance, phone);

        if(user_id)
            throw new VAlidationHeadersError("пользователь с указанным номером телефона уже существует, аутентифицируйтесь");

        next();
    }
}
