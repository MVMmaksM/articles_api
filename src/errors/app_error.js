export default class AppError extends Error{
    status_code;    
    name; 
    error;
    details;

    constructor(message, status_code, name, error, details){
        super(message);  
        this.status_code = status_code;
        this.name = name;
        this.error = error;
        this.details = details;
    }
}