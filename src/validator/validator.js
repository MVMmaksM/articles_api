import ValidationQueryParamsError from "../errors/validation_query_params_error.js";

export default class Validator{
    static pagination_validate(req, res, next){
        const offset = Number(req?.query?.offset);
        const limit = Number(req?.query?.limit);      

        if(!Number.isInteger(offset) || Number.isNaN(offset))
            throw new ValidationQueryParamsError('Обязательный query-параметр offset принимает только целые числа');

        if(offset < 0)
            throw new ValidationQueryParamsError('Обязательный query-параметр offset принимает минимальное значение равное 1');

        if(!Number.isInteger(limit) || Number.isNaN(limit))
            throw new ValidationQueryParamsError('Обязательный query-параметр limit принимает только целые числа');

        if(limit > 200 || limit < 0)
            throw new ValidationQueryParamsError('Обязательный query-параметр limit принимает минимальное значение равное 1 и максимальное значение равное 200');

        next();
    }
}
