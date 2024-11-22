import AppError from "./app_error.js";

const error_info = {
    name: "Error article comments",
    status_code: 400,
    error: "Bad Request"
}

export default class ArticleCommentsError extends AppError{
    constructor(details, status_code, error){
        super({name: error_info.name, status_code: status_code ?? error_info.status_code, error: error ?? error_info.error, details})
    }
}