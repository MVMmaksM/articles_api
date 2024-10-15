let articles = [
    {
        article_id: 1,
        title: "Тестовая статья один",
        author: "Тестовый автор один",
        date_create: new Date().toISOString(),
        note: "Teststststst"
    },
    {
        article_id: 2,
        title: "Тестовая статья два",
        author: "Тестовый автор два",
        date_create: new Date().toISOString(),
        note: "Teststs"
    },
    {
        article_id: 3,
        title: "Тестовая статья три",
        author: "Тестовый автор три",
        date_create: new Date().toISOString(),
        note: "testststsst"
    },
]

let seq_article = 3;

const get_article_detail = (article_id)=>{
    return articles.find(a => a.article_id === article_id);
}

const get_articles = ()=>{
    return articles;
}

const create_article = ({title, author, note})=>{
    seq_article = seq_article + 1;
    
    const new_article = {
        article_id: seq_article,
        title: title,
        author: author,
        note: note,
        date_create: new Date().toISOString()
    }

    articles.push(new_article);
    return articles.find(a => a.article_id === seq_article);
}

export {get_article_detail, get_articles, create_article};