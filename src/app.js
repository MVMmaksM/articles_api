import express from "express";
import article_router from "./routes/article/article.routes.js"
import registration_router from "./routes/registration/registration.routes.js"
import authentication_router from "./routes/authentication/authentication.routes.js";
import { authorize } from "./middlewares/authorization.js";


const app = express();
app.use(express.json());

const http_port = 5000;

//устанавливаем время начала запроса
app.use((req, res, next)=>{
    req.startTime = (new Date).getTime();
    //console.log(req.startTime);
    next();
});

//время выполнения запроса
app.use((req, res, next)=>{
    res.on("finish", ()=>{
        console.log(`${req.originalUrl} | time: ${((new Date).getTime() - req.startTime)/1000}s`);      
    });
    next();
});

app.use("/", authorize);
app.use("/api/v1/authentication", authentication_router);
app.use("/api/v1/registration", registration_router);
app.use("/api/v1/articles", article_router);

app.use((err, req, res, next)=>{
    console.log(err.stack);    
    res.status(500).json({errorCode: -1, errorMsg: err.message});
});

app.use("/", (req, res)=> {
    res.status(404).json({errorCode: -1, errorMsg: "Route not found"});
});

app.listen(http_port, ()=>{
    console.log(`server started, port: ${http_port}`);
});