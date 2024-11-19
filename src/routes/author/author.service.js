import Users from "../../db/models/users.js";

const get_authors = async (limit, offset)=>{
    const instance = global.instance;
    return await Users.get_authors(instance, limit, offset);
}

export {get_authors}