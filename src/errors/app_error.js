export default class AppError extends Error{
    status_code; 
    error_code;

    constructor(message, status_code, error_code){
        super(message);
        this.error_code = error_code;
        this.status_code = status_code;
    }
}