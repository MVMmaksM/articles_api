import {get_article_detail, get_articles, create_article, update_article, delete_article} from "./article.service.js"
import express from "express";
import AppError from "../../errors/app_error.js"
import ERRORS from "../../errors/error_codes/error_codes_article.js"
import { start_count_validation } from "../../validator/article_validation.js";
import { validate } from "express-validation";
const article_router = express.Router();

//получение всех статей
article_router.get("/", validate(start_count_validation, {keyByField: true}), async(req, res, next)=>{
    try{           
        const articles = await get_articles(req?.query?.start, req?.query?.count);
        res.json(articles);
    }catch(err){
        next(err);
    }
});

//полчуние детализации статьи
article_router.get("/:article_id", (req, res)=> {
    const article_id = parseInt(req.params.article_id);

    if(!article_id || article_id < 0)
        throw Error("article_id parametr is not valid");
    
    const article = get_article_detail(article_id);

    if(!article)
        throw Error(`article with article_id: ${article_id} not found`);

    res.json(article);
});

//создание статьи
article_router.post("/", async(req, res) =>{
    try{
        const {title, author, note} = req.body;
        const article = await create_article({title, author, note});  
    
        res.json(article);
    }catch(err){
        next(err);
    }   
});

article_router.put("/:article_id", (req, res) => {
    const article_id = parseInt(req.params.article_id);
    const {title, note} = req.body;

    if(!article_id || article_id < 0)
        throw Error("article_id parametr is not valid");

    const article = get_article_detail(article_id);

    if(!article)
        throw Error(`article with article_id: ${article_id} not found`);

    const articleUpdate = update_article({article_id, title, note});
    res.json(articleUpdate);
});

article_router.delete("/:article_id", (req, res) => {
    const article_id = parseInt(req.params.article_id);

    if(!article_id || article_id < 0)
        throw Error("article_id parametr is not valid");

    const article = get_article_detail(article_id);

    if(!article)
        throw Error(`article with article_id: ${article_id} not found`);

    const result = delete_article(article_id);

    res.json({result: true});
});

export default article_router;