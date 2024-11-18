import Articles from "../../db/models/articles.js";
import begin_transaction from "../../db/begin_transaction.js"
import commit_transaction from "../../db/commit_transaction.js"
import ArticleError from "../../errors/articles_error.js";

let seq_article = 3;

//детализация статьи
const get_article_detail = async (article_id)=>{
    const instance = global.instance;
    const article = await Articles.get_detail_article(instance, article_id);

    if(!article)
        throw new ArticleError({
            name: "Error article not found",
            status_code: 404,
            error: "Not found",
            details: "Статья с указанным article_id не найдена"
    });

    return article;
}

//список статей
const get_articles = async(limit, offset)=>{
    const instance = global.instance;
    return await Articles.get_articles(instance, limit, offset);
}

//создание статьи
const create_article = async({title, note, user_id})=>{    
    const instance = global.instance; 

    await begin_transaction(instance);
    const result = await Articles.create_article(instance, {title, note, author_id: user_id});
    await commit_transaction(instance);

    return result;
}

const update_article = async({article_id, title, note, user_id}) => {
    const instance = global.instance;
    const article = await Articles.get_detail_article(instance, article_id);

    if(!article)
        throw new ArticleError({
            name: "Error article not found",
            status_code: 404,
            error: "Not found",
            details: "Статья с указанным article_id не найдена"
    });

    if(article?.author_id != user_id)
        throw new ArticleError({
            name: "Error article update",
            status_code: 403,
            error: "Forbidden",
            details: "У вас нет доступа к указанной статье, изменять статью может только автор"
    });

    await begin_transaction(instance);
    const updated_article = await Articles.update_article(instance, article_id, title, note);
    await commit_transaction(instance);    
    
    return updated_article;
}

//удаление статьи
const delete_article = async(article_id, user_id)=>{
    const article = await Articles.get_detail_article(instance, article_id); 
    
    if(!article)
        throw new ArticleError(ERRORS.NOT_FOUND);

    if(article.created_by != user_id)
        throw new ArticleError(ERRORS.FORBIDDEN_DELETE);

    return true;
}

export {get_article_detail, get_articles, create_article, update_article, delete_article};