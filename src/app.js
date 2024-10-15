import express from "express";
import article_router from "./routes/article/article.routes.js"



const app = express();
app.use(express.json());

const port = 5000;

app.use("/v1/articles", article_router);

/*app.get("/articles", (req, res)=>{
    res.json(articles);
});

app.get("/articles/:id", (req, res) =>{
    const article_id = parseInt(req.params.id);

    if(!article_id)
        throw Error("article_id is not valid");

    const article = articles.find(a => a.article_id === article_id);

    if(!article)
        throw Error(`article with article_id: ${article_id} not exist`);

    res.json(article);
});

app.put("/articles/:id", (req, res)=>{
    const article_id = parseInt(req.params.id);

    if(!article_id)
        throw Error("article_id is not valid");

    if(!articles[article_id])
        throw Error(`article with article_id: ${article_id} not exist`);

    const updatedArticle = req.body;
    articles[article_id] = updatedArticle;   

    res.json(articles[article_id]);
});

app.delete("/articles/:id", (req, res)=>{
    const article_id = parseInt(req.params.id);    
    
    if(!article_id)
        throw Error("article_id is not valid");
        
    if(!articles.find(a => a.article_id === article_id))
        throw Error(`article with article_id: ${article_id} not exist`)
    
    articles = articles.filter(a => a.article_id !== article_id);
    res.json(articles);    
});

app.post("/articles", (req, res)=>{
    const {title, note, author } = req.body;

    if(title === undefined || title === "")
        throw Error("title is not valid");
    if(author === undefined || author === "")
        throw Error("author is not valid");
    if(note === undefined || note === "")
        throw Error("note is not valid");

    seq_article = seq_article + 1;    
    let article_id = seq_article; 

    const new_article = {
        article_id: article_id,
        title: title,
        note: note,
        author: author,
        date_create: new Date().toISOString()
    }

    articles.push(new_article);

    const article = articles.find(a => a.article_id === article_id);
    res.json(article);
});*/

app.use((err, req, res, next)=>{
    console.log(err.stack);    
    res.status(500).json({errorCode: -1, errorMsg: err.message});
});

app.use("/", (req, res)=> {
    res.status(404).json({errorCode: -1, errorMsg: "Route not found"});
});

app.listen(port, ()=>{
    console.log(`server started, port: ${port}`);
});