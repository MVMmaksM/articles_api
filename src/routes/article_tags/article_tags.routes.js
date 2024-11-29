import express from "express";
import Validator from "../../validator/validator.js";
import { get_tags } from "./article_tags.service.js";
const article_tags_router = express.Router();


//получение списка тэгов для статей
article_tags_router.get("/", Validator.pagination_validate, async(req, res, next)=>{
    try{     
       const tags = await get_tags(req?.query?.limit, req?.query?.offset);
       res.json(tags);
    }catch(err){
        next(err);
    }
});

export default article_tags_router;