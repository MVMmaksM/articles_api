import express from "express";
import article_router from "./routes/article/article.routes.js"
import registration_router from "./routes/registration/registration.routes.js"
import authentication_router from "./routes/authentication/authentication.routes.js";
import { authorize } from "./middlewares/authorization.js";
import {create_instance} from "./db/create_instance.js"
import error_handler from "./middlewares/errors_handler.js";
import route_not_found from "./middlewares/route_not_found.js"
import {res_start_time, res_end_time} from "./middlewares/responce_time.js"

const app = express();
app.use(express.json());

const http_port = 5000;

//устанавливаем время начала запроса
app.use(res_start_time);
//время выполнения запроса
app.use(res_end_time);

app.use("/api/v1/registration", registration_router);
app.use("/api/v1/authentication", authentication_router);

app.use("/", authorize);
app.use("/api/v1/articles", article_router);

//обработчик ошибок
app.use("/", error_handler);
//не найден роут
app.use("/", route_not_found);

app.listen(http_port, ()=>{
    global.instance = create_instance();
    console.log("create instance");
    console.log(`server started, port: ${http_port}`);
});