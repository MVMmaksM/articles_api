import { Joi } from "express-validation";

const start_count_validation = {
    query: Joi.object({
        start: Joi.number()
                .integer() 
                .min(1)           
                .required(),
        count: Joi.number()
                .integer()
                .min(1)
                .max(200)
                .required()
    }) 
}

export {start_count_validation}