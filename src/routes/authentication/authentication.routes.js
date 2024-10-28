import { access_user, create_confirm_code, create_user_token } from "./authentication.service.js";
import { confirmation_code } from "../registration/registration.service.js";
import ERRORS from "../../errors/error_codes.js";
import express from "express";
import AppError from "../../errors/app_error.js";

const auth_router = express.Router();

auth_router.post("/phone", async (req, res, next) =>{
    try{
        const cred_phone = req.headers["authentication"]; 

        if(!cred_phone)
            throw new AppError(ERRORS.NOT_PHONE.error_message, 500, ERRORS.NOT_PHONE.error_code);

        const user_id = await access_user(cred_phone); 
        const code_id = await create_confirm_code(user_id); 
    
        res.json({code_id: code_id});
    }catch(err){
        next(err);
    }    
});

auth_router.post("/phone/confirm", async(req, res, next)=>{
    try{
        const confirm_code = req.headers["confirmation"];

        if(!confirm_code)
            throw new AppError(ERRORS.NOT_CONFIRM_CODE.error_message, 500, ERRORS.NOT_CONFIRM_CODE.error_code);
    
        const user_id = await confirmation_code(confirm_code); 
    
        if(!user_id)
            throw new AppError(ERRORS.ERR_CONFIRM.error_message, 500, ERRORS.ERR_CONFIRM.error_code);
    
        const user_token = await create_user_token(user_id);
    
        res.json({user_token: user_token});
    }catch(err){
        next(err);
    }
});

export default auth_router;