import { access_user, create_confirm_code, create_user_token } from "./authentication.service.js";
import { confirmation_code } from "../registration/registration.service.js";
import express from "express";
const authentication_router = express.Router();

authentication_router.post("/phone", (req, res) =>{
    const cred_phone = req.headers["authentication"]; 

    if(!cred_phone)
        throw Error("Не передан номер телефона");

    const user_id = access_user(cred_phone); 
    const code_id = create_confirm_code(user_id); 
   
    res.json({code_id: code_id});
});

authentication_router.post("/phone/confirm", (req, res)=>{
    const res_confirm = confirmation_code(req.headers["confirmation"]); 

    if(!res_confirm)
        throw Error("Ошибка при подтверждении кода");

    const user_token = create_user_token(res_confirm.user_id);

    res.json({user_token: user_token});
});

export default authentication_router;