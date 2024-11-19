import express from "express";
import Validator from "../../validator/validator.js";
import {get_authors} from "./author.service.js";
const author_router = express.Router();

author_router.get("/", Validator.pagination_validate, async(req, res, next)=>{
    try{
        const authors = await get_authors(req?.query?.limit, req?.query?.offset);
        res.json(authors);
    }catch(err){
        next(err);
    }
});

export default author_router;