import Tags from "../../db/models/tags.js";


const get_tags = async (limit, offset,)=>{
    const instance = global.instance;
    return await Tags.get_tags(instance, limit, offset); 
}

export {get_tags}