import {db_config} from "../config/db.config.js"
import knex from "knex"

const create_instance = ()=> {
    return new knex(db_config);   
}

export {create_instance}