import {get_article_detail, get_articles, create_article} from "./article.service.js"
import express from "express";
const article_router = express.Router();

article_router.get("/", (req, res)=>{
    const articles = get_articles();
    res.json(articles);
});

article_router.get("/:article_id", (req, res)=> {
    const article_id = req.params.article_id;

    if(article_id === undefined || article_id === "")
        throw Error("parametr article_id is not valid");
    
    const article = get_article_detail(article_id);

    if(!article)
        throw Error(`article with article_id: ${article_id} not found`);

    res.json(article);
});

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

export default article_router;