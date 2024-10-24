import { registration_phone, confirmation_code } from "./registration.service.js";
import express from "express";
const registration_router = express.Router();

//регистрация по номеру телефона
registration_router.post("/phone", async (req, res, next)=>{
    try {
        const cred_phone = req.headers["registration"];   

        if(!cred_phone)
            throw Error("Не указан номер телефона");
         
        const code_id = await registration_phone(cred_phone);  

        if(!code_id)
            throw Error("Ошибка при регистрации");

        res.json({code_id: code_id});
    }catch(err){
        next(err);
    }    
}); 

//подтверждление номер телефона при регистрации
registration_router.post("/phone/confirm", async (req, res, next)=>{
    try{
        const code_id = await confirmation_code(req.headers["confirm"]); 

        if(!code_id)
            throw Error("Ошибка при подтверждении кода");
    
        res.json({result: "Учетная запись успешно подтверждена, выполните вход"});

    }catch(err){
        next(err);
    }
});

export default registration_router;