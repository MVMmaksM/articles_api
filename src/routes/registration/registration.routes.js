import { registration_phone, confirmation_code, get_again_code } from "./registration.service.js";
import express from "express";
import AppError from "../../errors/app_error.js"
import ERRORS from "../../errors/error_codes/error_codes_reg.js"
import Validator from "../../validator/validator.js";

const registration_router = express.Router();

//регистрация по номеру телефона
registration_router.post("/phone", Validator.reg_cred_phone_validate, async (req, res, next)=>{
    try {
        const cred_phone = req?.headers["reg"];   
        const code_id = await registration_phone(cred_phone);  

        res.status(201).json({
            result: "Учетная запись успешно создана, выполните подтверждение",
            code_id: code_id,
        });
    }catch(err){
        next(err);
    }    
}); 

//подтверждение номера телефона при регистрации
registration_router.post("/phone/confirm", Validator.reg_confirm_code_validate, async (req, res, next)=>{
    try{
        const code_id = await confirmation_code(req?.headers["confirm"]); 

        if(!code_id)
            throw new AppError(ERRORS.ERR_CONFIRM.error_message, 500, ERRORS.ERR_CONFIRM.error_code);
    
        res.json({result: "Учетная запись успешно подтверждена, выполните вход"});

    }catch(err){
        next(err);
    }
});

//потворный запрос кода
registration_router.get("/phone/again_code", Validator.reg_cred_phone_validate, async(req, res, next)=>{
    try{
        const code_id = await get_again_code(req?.headers["reg"]);
        res.json({
            code_id: code_id
        });
    }catch(err){
        next(err);
    }
});

export default registration_router;