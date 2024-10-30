const ERRORS = {
    ERR_OTHER_REG: {
        error_code: 100,
        error_message: ""
    },
    NOT_PHONE: {
        error_code: 101,
        error_message: "Ошибка регистрации: не указан номер телефона"
    },
    ERR_CONFIRM: {
        error_code: 102,
        error_message: "Ошибка регистрации: ошибка при подтверждении кода"
    },
    NOT_VALID_PHONE: {
        error_code: 103,
        error_message: "Ошибка регистрации: неверно указан номер телефона"
    },   
    EXIST_PHONE: {
        error_code: 104,
        error_message: "Ошибка регистрации: пользователь с таким номером телефона уже существует, аутентифицируйтесь"
    },
    NOT_CONFIRM_CODE: {
        error_code: 105,
        error_message: "Ошибка регистрации: не указан код подтверждения"
    },
    NOT_VALID_CONF_CODE:{
        error_code: 106,
        error_message: "Ошибка регистрации: неверно указан код подтверждения или идентификатор code_id"
    },   
    ERR_PHONE_LENGTH: {
        error_code: 107,
        error_message: "Ошибка регистрации: длина номера телефона должна быть равна 9"
    }   
}

export default ERRORS;