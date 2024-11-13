import { access_user, create_confirm_code, create_user_token, confirmation_code } from "./authentication.service.js";
import express from "express";
import Validator from "../../validator/validator.js";

const auth_router = express.Router();

auth_router.post("/phone", Validator.cred_phone_validate, async (req, res, next) =>{
    try{
        const cred_phone = req.headers["authentication"];

        const user_id = await access_user(cred_phone); 
        const code_id = await create_confirm_code(user_id); 
    
        res.json({code_id: code_id});
    }catch(err){
        next(err);
    }    
});

auth_router.post("/phone/confirm", Validator.confirm_code_validate, async(req, res, next)=>{
    try{
        const confirm_code = req.headers["confirm"];
    
        const user_id = await confirmation_code(confirm_code);   
        const user_token = await create_user_token(user_id);
    
        res.json({user_token: user_token});
    }catch(err){
        next(err);
    }
});

export default auth_router;