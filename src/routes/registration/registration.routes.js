import { registration_phone } from "./registration.service.js";
import express from "express";
const registration_router = express.Router();

registration_router.post("/phone", (req, res)=>{
    const cred_phone = req.headers["registration"];
    const result_registration = registration_phone(cred_phone);

    if(!result_registration)
        throw Error("Ошибка при регистрации");

    res.json({result: true, msg: "Код подтверждения отправлен на указанный номер"});
});

export default registration_router;