import { Joi } from "express-validation";

const cred_phone_validate = function(value, helpers){    
    let phone_number = Buffer.from(value, "base64").toString();
    phone_number = parseInt(phone_number);

    if(!phone_number)
        throw new Error('invalid phone number');

    if(phone_number.toString().length != 10)
        throw new Error('invalid phone number length');

}

const phone_validation = {
    body: Joi.object({
        cred: Joi.string().base64().custom(cred_phone_validate, 'validate cred_phone base64').required()               
    })
}

export {phone_validation}
