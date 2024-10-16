import {get_article_detail, get_articles, create_article, update_article, delete_article} from "./article.service.js"
import express from "express";
const article_router = express.Router();

//получение всех статей
article_router.get("/", (req, res)=>{
    const is_delete = req.query.is_delete === "1" ? true : false;   

    const articles = get_articles(is_delete);
    res.json(articles);
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
article_router.post("/", (req, res) =>{
    const {title, author, note} = req.body;

    if(title === undefined || title === "")
        throw Error("title is not valid");

    if(author === undefined || author === "")
        throw Error("author is not valid");

    if(note === undefined || note === "")
        throw Error("note is not valid");

    const article = create_article({title, author, note});
    if(!article)
        throw Error("error for create article");

    res.json(article);
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