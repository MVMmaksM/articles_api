import get_profile from "../profile/profile.service.js";
import express from "express";
const profile_router = express.Router();

profile_router.get("/", async(req, res, next)=>{
    try{
        const user_id = req?.user?.user_id;
        const profile = await get_profile(user_id);

        res.json(profile);
    }catch(err){
        next(err);
    }
});

export default profile_router;