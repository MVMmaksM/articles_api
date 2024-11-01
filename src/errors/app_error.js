export default class AppError extends Error{
    name; 
    status_code;    
    error;
    details;

    constructor(name, status_code, error, details){
        super(details);  
        this.name = name;
        this.status_code = status_code;
        this.error = error;
        this.details = details;
    }
}