const ERRORS = {
    ERR_OTHER_ARTICLE:{
        error_code: 500,
        error_message: ""
    },
    REQUIRED_START:{
        error_code: 501,
        error_message: "Не передан обязательный query-параметр start"
    },
    REQUIRED_COUNT:{
        error_code: 502,
        error_message: "Не передан обязательный query-параметр count"
    },
    NOT_VALID_START:{
        error_code: 503,
        error_message: "Невалидный обязательный query-параметр start"
    },
    NOT_VALID_COUNT:{
        error_code: 504,
        error_message: "Невалидный обязательный query-параметр count"
    },
    MIN_VALUE_START:{
        error_code: 505,
        error_message: "Минимальное значение обязательного query-параметра start равно 1"
    },
    MAX_VALUE_COUNT:{
        error_code: 506,
        error_message: "Максимальное значение обязательного query-параметра count равно 200"
    },
    MIN_VALUE_COUNT:{
        error_code: 507,
        error_message: "Минимальное значение обязательного query-параметра count равно 1"
    }
}

export default ERRORS;