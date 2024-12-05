import {
    get_article_detail, 
    get_articles, 
    create_article, 
    update_article, 
    delete_article, 
    add_favorites, 
    remove_favorites,
    add_comment,
    get_comments,
    delete_comment,
    article_publish,
    remove_publish } from "./article.service.js"
import express from "express";
import Validator from "../../validator/validator.js";
const article_router = express.Router();

//получение всех статей
article_router.get("/", Validator.pagination_validate, async(req, res, next)=>{
    try{           
        const user_id = req?.user?.user_id;  
        const limit = req?.query?.limit;
        const offset = req?.query?.offset;
        const is_only_my = req?.query?.is_only_my;      
        
        const articles = await get_articles(limit, offset, user_id, is_only_my);
        res.json(articles);
    }catch(err){
        next(err);
    }
});

//получение детализации статьи
article_router.get("/:article_id", Validator.article_id_validate, async(req, res, next)=> {
    try{       
        const article_id = Number(req.params.article_id);    
        const article = await get_article_detail(article_id, req?.user?.user_id);

        res.json(article);
    }catch(err){
        next(err);
    }
});

//создание статьи
article_router.post("/", Validator.body_article_validate, async(req, res, next) =>{
    try{
        const {title, note, tag_ids} = req.body;
        const user = req?.user;        
         
        const article = await create_article({title, note, tag_ids, user});  
    
        res.status(201).json(article);
    }catch(err){
        next(err);
    }   
});

//обновление статьи
article_router.put("/:article_id", Validator.article_id_validate, Validator.body_article_validate, async(req, res, next) => {
    try{
        const article_id = Number(req.params.article_id);
        const {title, note, tag_ids} = req.body; 

        const article_pdated = await update_article({article_id, title, note, tag_ids, user_id: req?.user?.user_id});
    res.json(article_pdated);
    }catch(err){
        next(err);
    }
});

//удаление статьи
article_router.delete("/:article_id", Validator.article_id_validate, async(req, res, next) => {
    try{
        const article_id = Number(req.params.article_id);
        await delete_article(article_id, req?.user?.user_id);
        
        res.json({details: "Статья успешно удалена"});
    }catch(err){
        next(err);
    }    
});

//опубликовать статью
article_router.post("/:article_id/publish", Validator.article_id_validate, async(req, res, next) =>{
    try{
        const article_id = Number(req.params.article_id);
        const user_id = req?.user?.user_id;

        const article = await article_publish(article_id, user_id);
        res.json(article);
    }catch(err){
        next(err);
    }
});

//снять статью с публикации
article_router.post("/:article_id/remove_publish", Validator.article_id_validate, async(req, res, next) => {
    try{
        const article_id = Number(req.params.article_id);
        const user_id = req?.user?.user_id;
        const article = await remove_publish(article_id, user_id);

        res.json(article);
    }catch(err){
        next(err);
    }
});

//добавление статьи в избранное
article_router.post("/favorites/:article_id", Validator.article_id_validate, async(req, res, next)=>{
    try{
        const article_id = Number(req.params.article_id);
        await add_favorites(article_id, req?.user?.user_id);
        
        res.json({details: "Статья добавлена в избранное"});
    }catch(err){
        next(err);
    }
});

//удаление статьи из избранного
article_router.delete("/favorites/:article_id", Validator.article_id_validate, async(req, res, next)=>{
    try{
        const article_id = Number(req.params.article_id);
        await remove_favorites(article_id, req?.user?.user_id);
        
        res.json({details: "Статья удалена из избранного"});
    }catch(err){
        next(err);
    }
});

//добавление комментария к статье
article_router.post("/:article_id/comments", Validator.article_id_validate, Validator.body_article_comment_validate, async(req, res, next)=>{
    try{
        const article_id = Number(req.params.article_id);
        const {note} = req?.body;

        const comment = await add_comment(article_id, req?.user?.user_id, note);
        res.status(201).json(comment);
    }catch(err){
        next(err);
    }
});

//добавление ответа на комментарий
article_router.post("/:article_id/comments/:comment_owner_id", 
    Validator.article_id_validate,
    Validator.comment_owner_id_validate, 
    Validator.body_article_comment_validate, async(req, res, next)=>{
    try{
        const article_id = Number(req.params.article_id);
        const comment_owner_id = Number(req.params.comment_owner_id);
        const {note} = req?.body;

        const comment = await add_comment(article_id, req?.user?.user_id, note, comment_owner_id);
        res.status(201).json(comment);
    }catch(err){
        next(err);
    }
});

//список комментариев к статье
article_router.get("/:article_id/comments", 
    Validator.article_id_validate, 
    Validator.pagination_validate, 
    Validator.article_comments_is_only_my_validate, async(req, res, next)=>{
    try{
        const article_id = Number(req.params.article_id);
        const comments = await get_comments(article_id, req?.query?.limit, req?.query?.offset, req?.query?.is_only_my, req?.user?.user_id);

        res.json(comments);
    }catch(err){
        next(err);
    }
});

//удаление комментария
article_router.delete("/:article_id/comments/:comment_id", Validator.article_id_validate, async(req, res, next)=>{
    try{
        const article_id = Number(req?.params?.article_id);
        const comment_id = Number(req?.params?.comment_id);

        await delete_comment(comment_id, article_id, req?.user?.user_id);
        res.json({details: "Комментарий успешно удален"});
    }catch(err){
        next(err);
    }
});

export default article_router;