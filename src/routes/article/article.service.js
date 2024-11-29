import Articles from "../../db/models/articles.js";
import ArticleViews from "../../db/models/article_views.js";
import ArticleFavorites from "../../db/models/article_favorites.js";
import ArticleComments from "../../db/models/article_comments.js";
import begin_transaction from "../../db/begin_transaction.js";
import commit_transaction from "../../db/commit_transaction.js";
import ArticleError from "../../errors/articles_error.js";
import ArticleFavoritesError from "../../errors/article_favorites_error.js";
import ArticleCommentsError from "../../errors/aerticle_comments_error.js";
import Users from "../../db/models/users.js";
import Tags from "../../db/models/tags.js";
import ArticleTags from "../../db/models/article_tags.js";

//детализация статьи
const get_article_detail = async (article_id, user_id)=>{
    const instance = global.instance;

    await begin_transaction(instance);
    //увеличиваем просмотры
    await ArticleViews.inc_view(instance, article_id);
    //получаем статью   
    const article = await Articles.get_detail_article(instance, article_id, user_id);
    await commit_transaction(instance);

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
const create_article = async({title, note, tag_ids, user})=>{    
    const instance = global.instance; 
   
    await begin_transaction(instance);
    //создаем статью
    const article_id = await Articles.create_article(instance, {title, note, author_id: user?.user_id});

    if(tag_ids?.length > 0){
        for (let tag_id of tag_ids){
             //проверяем существование тэга
            const tag = await Tags.get_tag_by_id(instance, tag_id);

            if(!tag)
                throw new ArticleError({
                    name: "Error article create",
                    status_code: 400,
                    error: "Bad request",
                    details: "Тэг с указанным tag_id не найден"});
        }

        for (let tag_id of tag_ids){
            //добавляем тэги
            await ArticleTags.add_article_tags(instance, article_id, tag_id);
        }
    }
   
    //добавляем кол-во просмотров
    await ArticleViews.create_view(instance, article_id);
    //если пользователь не автор, то делаем его автором
    if(!user?.is_author)
        await Users.set_is_author(instance, user?.user_id, true);
    //получаем созданную статью
    const article = await Articles.get_detail_article(instance, article_id, user?.user_id);     
    await commit_transaction(instance);

    return article;
}

const update_article = async({article_id, title, note, user_id}) => {
    const instance = global.instance;
    const article = await Articles.get_detail_article(instance, article_id, user_id);

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
            details: "У вас нет доступа к указанной статье, обновлять статью может только автор"
    });

    await begin_transaction(instance);
    //обновляем статью
    await Articles.update_article(instance, article_id, title, note);
    //получаем обновленную статью
    const updated_article = await Articles.get_detail_article(instance, article_id, user_id);
    await commit_transaction(instance);    
    
    return updated_article;
}

//удаление статьи
const delete_article = async(article_id, user_id)=>{
    const instance = global.instance;     
    const article = await Articles.get_detail_article(instance, article_id, user_id);

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
            details: "У вас нет доступа к указанной статье, удалить статью может только автор"
    });

    await begin_transaction(instance);
    //сначала очищаем просмотры
    await ArticleViews.delete_view(instance, article_id);
    //удалем статью
    await Articles.delete_article(instance, article_id);
    //смотрим на количество статей
    const count_articles_author = await Articles.get_count_articles(instance, user_id);  
    //если у автора становится 0 статей после удаления, то он перестает быть автором
    //не попадет в выборку авторов
    if(Number(count_articles_author) === 0)
        await Users.set_is_author(instance, user_id, false);
    
    await commit_transaction(instance); 
}

const add_favorites = async(article_id, user_id)=>{
    const instance = global.instance;
    
    const exists_article_favorites = await ArticleFavorites.exists(instance, article_id, user_id);

    if(exists_article_favorites)    
        throw new ArticleFavoritesError("Статья уже находится в избранном");

    await begin_transaction(instance); 
    await ArticleFavorites.add(instance, article_id, user_id);
    await commit_transaction(instance); 
} 

const remove_favorites = async(article_id, user_id)=>{
    const instance = global.instance;
    
    const exists_article_favorites = await ArticleFavorites.exists(instance, article_id, user_id);

    if(!exists_article_favorites)
        throw new ArticleFavoritesError("Статья не найдена в избранном");

    await begin_transaction(instance); 
    await ArticleFavorites.delete(instance, article_id, user_id);
    await commit_transaction(instance);
}

const add_comment = async(article_id, user_id, note)=>{
    const instance = global.instance;

    await begin_transaction(instance); 
    const comment_id = await ArticleComments.add_comment(instance, article_id, user_id, note);
    const comment = await ArticleComments.get_comment_by_id(instance, comment_id);
    await commit_transaction(instance);

    return comment;
}

const get_comments = async (article_id, limit, offset, is_only_my, user_id)=>{
    const instance = global.instance;

    const comments = is_only_my ? 
    await ArticleComments.get_comments(instance, article_id, limit, offset, user_id) :
    await ArticleComments.get_comments(instance, article_id, limit, offset);

    return comments;
}

const delete_comment = async (comment_id, article_id, user_id)=>{
    const instance = global.instance;

    const comment = await ArticleComments.get_comment_by_id(instance, comment_id);

    if(!comment || comment?.article_id != article_id)
        throw new ArticleCommentsError("Комментарий не найден", 404);

    if(comment?.user_id != user_id)
        throw new ArticleCommentsError("Вы не можете удалить чужой комментарий", 403, "Forbidden");

    await begin_transaction(instance); 
    await ArticleComments.delete_comment(instance, comment_id);
    await commit_transaction(instance);
}

export {
    get_article_detail, 
    get_articles, 
    create_article, 
    update_article, 
    delete_article, 
    add_favorites, 
    remove_favorites,
    add_comment,
    get_comments,
    delete_comment};