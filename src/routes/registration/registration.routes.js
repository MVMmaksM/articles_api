import { registration_phone, confirmation_code } from "./registration.service.js";
import express from "express";
import AppError from "../../errors/app_error.js"
import ERRORS from "../../errors/error_codes/error_codes_reg.js"
import {phone_validation} from "../../validator/reg_validaton.js"
import { validate } from "express-validation";

const registration_router = express.Router();

//регистрация по номеру телефона
registration_router.post("/phone", validate(phone_validation, {keyByField: true}), async (req, res, next)=>{
    try {
        const cred_phone = req?.body?.cred;  
        if(!cred_phone)
            throw new AppError(ERRORS.NOT_PHONE.error_message, 500, ERRORS.NOT_PHONE.error_code);
         
        const code_id = await registration_phone(cred_phone);  

        if(!code_id)
            throw new AppError("Ошибка при регистрации", 500, ERRORS.ERR_OTHER_REG.error_code);

        res.json({
            result: "Учетная запись успешно создана, выполните подвтерждение",
            code_id: code_id,
        });
    }catch(err){
        next(err);
    }    
}); 

//подтверждение номера телефона при регистрации
registration_router.post("/phone/confirm", async (req, res, next)=>{
    try{
        const code_id = await confirmation_code(req.headers["confirm"]); 

        if(!code_id)
            throw new AppError(ERRORS.ERR_CONFIRM.error_message, 500, ERRORS.ERR_CONFIRM.error_code);
    
        res.json({result: "Учетная запись успешно подтверждена, выполните вход"});

    }catch(err){
        next(err);
    }
});

export default registration_router;