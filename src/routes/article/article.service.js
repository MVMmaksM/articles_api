import Articles from "../../db/models/articles.js"
import AppError from "../../errors/app_error.js";
import ERRORS from "../../errors/error_codes/error_codes_article.js";

let articles = [
    {
        article_id: 1,
        title: "Тестовая статья один",
        author: "Тестовый автор один",
        create_on_tz: new Date().toISOString(),
        note: "Teststststst",
        update_on_tz: null,
        is_delete: false
    },
    {
        article_id: 2,
        title: "Тестовая статья два",
        author: "Тестовый автор два",
        create_on_tz: new Date().toISOString(),
        note: "Teststs",
        update_on_tz: null,
        is_delete: false
    },
    {
        article_id: 3,
        title: "Тестовая статья три",
        author: "Тестовый автор три",
        create_on_tz: new Date().toISOString(),
        note: "testststsst",
        update_on_tz: null,
        is_delete: false
    },
]

let seq_article = 3;

const get_article_detail = (article_id)=>{
    return articles.find(a => a.article_id === article_id);
}

const get_articles = async(query_start, query_count)=>{
    const start = parseInt(query_start);
    const count = parseInt(query_count);

    if(!start)
        throw new AppError(ERRORS.NOT_VALID_START.error_message, 500, ERRORS.NOT_VALID_START.error_code);

    if(!count)
        throw new AppError(ERRORS.NOT_VALID_COUNT.error_message, 500, ERRORS.NOT_VALID_COUNT.error_code);

    if(start < 1)
        throw new AppError(ERRORS.MIN_VALUE_START.error_message, 500, ERRORS.MIN_VALUE_START.error_code);

    if(count > 200)
        throw new AppError(ERRORS.MAX_VALUE_COUNT.error_message, 500, ERRORS.MAX_VALUE_COUNT.error_code);

    if(count < 1)
        throw new AppError(ERRORS.MIN_VALUE_COUNT.error_message, 500, ERRORS.MIN_VALUE_COUNT.error_code);

    const instance = global.instance;
    return await Articles.get_articles(instance, start, count);
}

const create_article = ({title, author, note})=>{
    seq_article = seq_article + 1;
    
    const new_article = {
        article_id: seq_article,
        title: title,
        author: author,
        note: note,
        date_create: new Date().toISOString()
    }

    articles.push(new_article);
    return articles.find(a => a.article_id === seq_article);
}

const update_article = ({article_id, title, note}) => {
    const index_article_updated = articles.indexOf(articles.find(a => a.article_id === article_id));  
    
    articles[index_article_updated].note = note;
    articles[index_article_updated].title = title;
    articles[index_article_updated].update_on_tz = new Date().toISOString()

    return articles[index_article_updated];
}

const delete_article = (article_id)=>{
    const index_article_deleted = articles.indexOf(articles.find(a => a.article_id === article_id));

    articles[index_article_deleted].is_delete = true;

    return true;
}

export {get_article_detail, get_articles, create_article, update_article, delete_article};