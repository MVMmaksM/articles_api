import {db_config} from "../config/db.config.js"
import knex from "knex"

const create_instance = (cb)=> {
    new knex(db_config);
    cb();
}

export {create_instance}