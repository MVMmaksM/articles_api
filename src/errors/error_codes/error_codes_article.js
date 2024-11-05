const ERRORS = {
    NOT_FOUND: {
        name: "Error Article",
        status_code: 404,
        error: "Article Not Found",
        details: "Статьи с указанным article_id не существует"
    },
    FORBIDDEN_DELETE: {
        name: "Error Article",
        status_code: 403,
        error: "Forbidden",
        details: "Удалить статью может только автор статьи"
    }
}

export default ERRORS;