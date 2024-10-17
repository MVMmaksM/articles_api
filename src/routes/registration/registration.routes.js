import { registration_phone, confirmation_code } from "./registration.service.js";
import express from "express";
const registration_router = express.Router();

registration_router.post("/phone", (req, res)=>{
    const cred_phone = req.headers["registration"];   

    if(!cred_phone)
        throw Error("Не указан номер телефона");

    const code_id = registration_phone(cred_phone);

    if(!code_id)
        throw Error("Ошибка при регистрации");

    res.json({code_id: code_id});
});

registration_router.post("/phone/confirm", (req, res)=>{
    const token = confirmation_code(req.headers["registration"]);

    if(!token)
        throw Error("Неверно указан код подтверждения");

    res.json({token: token});
});

export default registration_router;