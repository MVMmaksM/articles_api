import Users from "../../db/models/users.js";

const get_profile = async(user_id)=>{
    const instance = global?.instance;
    return await Users.get_profile(instance, user_id);
}

export default get_profile;