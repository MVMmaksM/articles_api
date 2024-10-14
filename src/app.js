const express = require("express");
const app = express();
app.use(express.json());

const port = 5000;
const articles = [
    {
        article_id: 1,
        title: "Тестовая статья один",
        author: "Тестовый автор один",
        date_create: new Date().toISOString()
    },
    {
        article_id: 2,
        title: "Тестовая статья два",
        author: "Тестовый автор два",
        date_create: new Date().toISOString()
    },
    {
        article_id: 3,
        title: "Тестовая статья три",
        author: "Тестовый автор три",
        date_create: new Date().toISOString()
    },
]

app.get("/articles", (req, res)=>{
    res.json(articles);
});

app.get("/articles/:id", (req, res) =>{
    const article_id = req.params.id;
    const article = articles[article_id];

    if(!article)
        throw Error("Article not found");

    res.json(article);
});

app.put("/articles/:id", (req, res)=>{
    const article_id = req.params.id;

    if(!articles[article_id])
        res.json({    
        errorCode: -1,
        errorMsg: "Article not found"
    });

    const updatedArticle = req.body;
    articles[article_id] = updatedArticle;   

    res.json(articles[article_id]);
});

app.delete("/articles/:id", (req, res)=>{
    const article_id = req.params.id;
    
    if(!article_id)
        throw Error("Article id not found");
    
    if(!articles[article_id])
        throw Error("Article not found")

    delete articles[article_id];
    res.json({result: true});
});

app.use((err, req, res, next)=>{
    console.log(err);
    res.status(500).json({error: err.stack});
});

app.use("/", (req, res)=> {
    res.status(404).json({errorCode: -1, errorMsg: "Route not found"});
});

app.listen(port, ()=>{
    console.log(`server started, port: ${port}`);
});