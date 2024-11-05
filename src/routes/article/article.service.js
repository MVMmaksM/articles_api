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

//детализация статьи
const get_article_detail = async (article_id)=>{
    const instance = global.instance;
    return await Articles.get_detail_article(instance, article_id);
}

//список статей
const get_articles = async(limit, offset)=>{
    const instance = global.instance;
    return await Articles.get_articles(instance, limit, offset);
}

const create_article = async({title, note})=>{    
    const instance = global.instance;  
    return await Articles.create_article(instance, {title, note});
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