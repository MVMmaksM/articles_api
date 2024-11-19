import AppError from "./app_error.js";

const error = {
    name: "Error article favorites",
    status_code: 400,
    error: "Bad Request"
}

export default class ArticleFavoritesError extends AppError{
    constructor(details){
        super({name: error.name, status_code: error.status_code, error: error.error, details})
    }
}