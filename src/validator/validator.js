import ValidationQueryParamsError from "../errors/validation_query_params_error.js";

export default class Validator{
    static pagination_validate(req, res){
        const start = Number(req?.query?.start);
        const count = Number(req?.query?.count);

        if(!Number.isInteger(start) || Number.isNaN(start))
            throw new ValidationQueryParamsError('Обязательный query-параметр start принимает только целые числа');

        if(start < 0)
            throw new ValidationQueryParamsError('Обязательный query-параметр start принимает минимальное значение равное 1');

        if(!Number.isInteger(count) || Number.isNaN(count))
            throw new ValidationQueryParamsError('Обязательный query-параметр count принимает только целые числа');

        if(count > 200 || count < 0)
            throw new ValidationQueryParamsError('Обязательный query-параметр count принимает минимальное значение равное 1 и максимальное значение равное 200');
    }
}
