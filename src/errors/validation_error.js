import AppError from "./app_error.js";

export default class ValidationError extends AppError{
    constructor({name, status_code, error, details}){
        super({name, status_code, error, details})
    }
}