import express from "express";
import article_router from "./routes/article/article.routes.js"
import registration_router from "./routes/registration/registration.routes.js"


const app = express();
app.use(express.json());

const port = 5000;

app.use("/v1/registration", registration_router);
app.use("/v1/articles", article_router);

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