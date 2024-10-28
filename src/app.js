import express from "express";
import article_router from "./routes/article/article.routes.js"
import registration_router from "./routes/registration/registration.routes.js"
import authentication_router from "./routes/authentication/authentication.routes.js";
import { authorize } from "./middlewares/authorization.js";
import {create_instance} from "./db/create_instance.js"

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

app.use("/api/v1/registration", registration_router);
app.use("/api/v1/authentication", authentication_router);

app.use("/", authorize);
app.use("/api/v1/articles", article_router);

app.use(async (err, req, res, next)=>{
    console.log(err.stack);    
    res.status(err.status_code || 500).json({error_code: err.error_code || -1, error_msg: err.message});
});

app.use("/", (req, res)=> {
    res.status(404).json({errorCode: -1, errorMsg: "Route not found"});
});

app.listen(http_port, ()=>{
    global.instance = create_instance();
    console.log("create instance");
    console.log(`server started, port: ${http_port}`);
});