import { Joi } from "express-validation";

const cred_phone_validate = function(value, helpers){  
    const exp_phone = /^[0-9]+$/;  
    let phone = Buffer.from(value, "base64").toString();   

    if(!exp_phone.test(phone))
        throw new Error('invalid phone number');

    if(phone.length != 10)
        throw new Error('invalid phone number length');

}

const phone_validation = {
    body: Joi.object({
        cred: Joi.string().base64().custom(cred_phone_validate, 'validate cred_phone base64').required()               
    })
}

export {phone_validation}
