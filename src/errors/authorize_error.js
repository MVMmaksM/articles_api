import AppError from "./app_error.js";

const error_authorize = {
    name: "Error authorization",
    status_code: 401,
    error: "Bad Request"
}

export default class AuthorizationError extends AppError{
    constructor(details, status_code, error){
        super({name: error_authorize.name, status_code: status_code ?? error_authorize.status_code, error: error ?? error_authorize.error, details})
    }
}