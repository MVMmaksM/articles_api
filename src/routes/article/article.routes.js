import {get_article_detail, get_articles, create_article, update_article, delete_article} from "./article.service.js"
import express from "express";
import Validator from "../../validator/validator.js";
const article_router = express.Router();

//получение всех статей
article_router.get("/", Validator.pagination_validate, async(req, res, next)=>{
    try{           
        const articles = await get_articles(req?.query?.limit, req?.query?.offset);
        res.json(articles);
    }catch(err){
        next(err);
    }
});

//получение детализации статьи
article_router.get("/:article_id", Validator.article_id_validate, async(req, res, next)=> {
    try{
        const article_id = Number(req.params.article_id);    
        const article = await get_article_detail(article_id);

        res.json(article);
    }catch(err){
        next(err);
    }
});

//создание статьи
article_router.post("/", Validator.body_article_validate, async(req, res, next) =>{
    try{
        const {title, note} = req.body;
        const user_id = req?.user?.user_id;        
         
        const article = await create_article({title, note, user_id});  
    
        res.status(201).json(article);
    }catch(err){
        next(err);
    }   
});

//обновление статьи
article_router.put("/:article_id", Validator.article_id_validate, Validator.body_article_validate, async(req, res, next) => {
    try{
        const article_id = Number(req.params.article_id);
        const {title, note} = req.body; 

        const article_pdated = await update_article({article_id, title, note, user_id: req?.user?.user_id});
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

export default article_router;