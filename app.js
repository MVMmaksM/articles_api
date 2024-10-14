const express = require("express");
const app = express(express.json());

const port = 3000;
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

app.listen(port, ()=>{
    console.log(`server started, port: ${port}`);
});