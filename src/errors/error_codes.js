const ERRORS = {
    ERR_OTHER_REG: {
        error_code: 100,
        error_message: ""
    },
    NOT_PHONE: {
        error_code: 101,
        error_message: "Не указан номер телефона"
    },
    ERR_CONFIRM: {
        error_code: 102,
        error_message: "Ошибка при подтверждении кода"
    },
    NOT_VALID_PHONE: {
        error_code: 103,
        error_message: "Неверно указан номер телефона"
    },
    EXIST_PHONE: {
        error_code: 104,
        error_message: "Пользователь с таким номером телефона уже существует, аутентифицируйтесь"
    },
    NOT_CONFIRM_CODE: {
        error_code: 105,
        error_message: "Не указан код подтверждения"
    },
    NOT_VALID_CONF_CODE:{
        error_code: 106,
        error_message: "Неверно указан код подтверждения или идентификатор code_id"
    },
    ROUTE_NOT_FOUND: {
        error_code: 404,
        error_message: "Роут не найден"
    }
}

export default ERRORS;