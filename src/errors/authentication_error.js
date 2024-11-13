import AppError from "./app_error.js";

const error_auth = {
    name: "Error authentication",
    status_code: 400,
    error: "Bad Request"
}

export default class AuthenticationError extends AppError{
    constructor(details, status_code, error){
        super({name: error_auth.name, status_code: status_code ?? error_auth.status_code, error: error ?? error_auth.error, details})
    }
}