import ValidationError from "./validation_error";

export default class ValidationQueryParamsError extends ValidationError{
    error = {
        name: "Error validation",
        status_code: 400,
        error: "Bad Request"
    }
    constructor(details){
        super({...this.error, ...details});
    }
}