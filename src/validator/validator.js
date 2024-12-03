import ValidationQueryParamsError from "../errors/validation_query_params_error.js";
import ValidationHeadersError from "../errors/validation_headers_error.js";
import ValidationParamsError from "../errors/validation_params_error.js";
import ValidationBodyArticleError from "../errors/validation_create_article_error.js";
import ValidationBodyArticleCommentError from "../errors/validation_add_comment_erroe.js";
import is_base64 from "is-base64";

export default class Validator{
    static async pagination_validate(req, res, next){
        try{

            let offset = req?.query?.offset;
            let limit = req?.query?.limit;

            if(offset === "")
                throw new ValidationQueryParamsError('Обязательный query-параметр offset не может быть пустым');

            if(limit === "")
                throw new ValidationQueryParamsError('Обязательный query-параметр limit не может быть пустым');

            offset = Number(req?.query?.offset);
            limit = Number(req?.query?.limit); 

            if(!Number.isInteger(offset) || Number.isNaN(offset))          
                throw new ValidationQueryParamsError('Обязательный query-параметр offset принимает только целые числа');

            if(offset < 0)
                throw new ValidationQueryParamsError('Обязательный query-параметр offset принимает минимальное значение равное 1');

            if(!Number.isInteger(limit) || Number.isNaN(limit))
                throw new ValidationQueryParamsError('Обязательный query-параметр limit принимает только целые числа');

            if(limit > 200 || limit < 0)
                throw new ValidationQueryParamsError('Обязательный query-параметр limit принимает минимальное значение равное 1 и максимальное значение равное 200');

            next();  
        }catch(err){
            next(err);
        }      
    }

    static async cred_phone_validate(req, res, next){
        try{
            //костыль
            const key_hedears = req?.originalUrl.includes("/api/v1/registration/") ? "reg" : "authentication";         
            let phone = req?.headers[key_hedears]; 

            if(!phone)
                throw new ValidationHeadersError(`Не установлен обязательный заголовок ${key_hedears} в headers`);

            if(!is_base64(phone))
                throw new ValidationHeadersError(`Обязательный заголовок ${key_hedears} в headers не является строкой в кодировке base64`);           

            phone = Buffer.from(phone, "base64").toString();     
            phone = Number(phone);
            
            if(!phone)
                throw new ValidationHeadersError("Не верно указан номер телефона");

            if(phone.toString().length != 10)
                throw new ValidationHeadersError("Длина номера телефона должна быть 10 цифр");

            next();
        }catch(err){
            next(err);
        }
    }

    static async confirm_code_validate(req, res, next){
        try{
            const key_hedears = 'confirm'
            let confirm_cred = req?.headers[key_hedears];

            if(!confirm_cred)
                throw new VAlidationHeadersError(`Не передан код подтверждения`);

            if(!is_base64(confirm_cred))
                throw new VAlidationHeadersError(`Обязательный заголовок ${key_hedears} в headers не является строкой в кодировке base64`); 

            confirm_cred = Buffer.from(confirm_cred, "base64").toString();
            confirm_cred = confirm_cred?.split(":");

            //под 0 индексом находится code_id
            if(!confirm_cred[0])
                throw new VAlidationHeadersError(`Не указан code_id`);
            
            //под 1 индексом находится сам код
            const code = Number(confirm_cred[1]); 
            
            if(!code)
                throw new VAlidationHeadersError(`Код подтверждения должен состоять только из цифр`);

            if(code?.toString().length != 6)
                throw new VAlidationHeadersError(`Код подтверждения должен состоять из 6 цифр`);

            next();
        }catch(err){
            next(err);
        }
    }

    static async article_id_validate(req, res, next){
        try{
            let article_id = Number(req?.params?.article_id);

            if(!article_id)
                throw new ValidationParamsError("Обязательный параметр article_id должен быть целым числом");

            if(article_id < 0 || article_id == 0)
                throw new ValidationParamsError("Обязательный параметр article_id должен быть больше 0");

            next();            
        }catch(err){
            next(err);
        }
    }

    static async comment_owner_id_validate(req, res, next){
        try{
            let comment_owner_id = Number(req?.params?.comment_owner_id);

            if(!comment_owner_id)
                throw new ValidationParamsError("Обязательный параметр comment_owner_id должен быть целым числом");

            if(comment_owner_id < 0 || comment_owner_id == 0)
                throw new ValidationParamsError("Обязательный параметр comment_owner_id должен быть больше 0");

            next();            
        }catch(err){
            next(err);
        }
    }

    static async body_article_validate(req, res, next){
        try{
            const title = req?.body?.title;
            const note = req?.body?.note;

        if(!title)
            throw new ValidationBodyArticleError("Обязательное поле title не указано, у статьи обязательно должно быть название");

        if(title === "")
            throw new ValidationBodyArticleError("title не может быть пустой строкой");

        if(title.length > 256)
            throw new ValidationBodyArticleError("title не может быть длиннее 256 символов");

        if(!note)
            throw new ValidationBodyArticleError("Обязательное поле note не указано, статья не может быть пустой");

        if(note === "")
            throw new ValidationBodyArticleError("note не может быть пустой строкой");

        next();
        }catch(err){
            next(err);
        }     
    }

    static async body_article_comment_validate(req, res, next){
        try{
            const note = req?.body?.note;

            if(!note)
                throw new ValidationBodyArticleCommentError("Обязательное поле note не может быть пустым");

            if(note?.length > 2000)
                throw new ValidationBodyArticleCommentError("Обязательное поле note не может быть длинее 2000 символов");
            
            next();
        }catch(err){
            next(err);
        }
    }

    static async article_comments_is_only_my_validate(req, res, next){
        try{              
            let is_only_my = req?.query?.is_only_my;  
            
            if(is_only_my){
                is_only_my = Number(is_only_my);
                if(is_only_my !== 1)
                    throw new ValidationQueryParamsError("Необязательный query-параметр is_only_my может принимает только 1");
            }           
            next();
        }catch(err){
            next(err);
        }
    }
}
