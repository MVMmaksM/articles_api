import AppError from "./app_error";

export default class ValidationError extends AppError{
    constructor(name, status_code, error, details){
        super(name, status_code, error, details)
    }
}