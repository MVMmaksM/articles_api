import Articles from "../../db/models/articles.js";
import begin_transaction from "../../db/begin_transaction.js"
import commit_transaction from "../../db/commit_transaction.js"

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

const create_article = async({title, note, created_by})=>{    
    const instance = global.instance; 

    await begin_transaction(instance);
    const result = await Articles.create_article(instance, {title, note, created_by});
    await commit_transaction(instance);

    return result;
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