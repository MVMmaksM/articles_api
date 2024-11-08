import ValidationError from "./validation_error.js";
const error = {
    name: "Error validation query-params",
    status_code: 400,
    error: "Bad Request"
}

export default class ValidationQueryParamsError extends ValidationError{
  
    constructor(details){
        super({name: error.name, status_code: error.status_code, error: error.error, details: details});       
    }
}