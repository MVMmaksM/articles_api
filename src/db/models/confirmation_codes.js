import { v4 as uuidv4 } from 'uuid';

class ConfirmationCodes {
    static table = "public.confirmation_codes";

    static async add_code(instance, user_id, code){
        const code_id = uuidv4();    
        const result = await instance.raw(`INSERT INTO ${this.table} (code_id, user_id, code)
                                           VALUES(?,?,?)`, [code_id, user_id ?? null, code ?? null]);

        return code_id;
    } 

    static async find_code(instance, code_id, code){       
        const result = await instance.raw(`SELECT code_id, 
                                                  user_id, 
                                                  code, 
                                                  to_char(created_on_tz, 'YYYY-MM-DD"T"HH24:MM:SS.MS') AS created_on_tz, 
                                                  to_char(used_on_tz, 'YYYY-MM-DD"T"HH24:MM:SS.MS') AS used_on_tz
                                           FROM ${this.table}
                                           WHERE code_id = ? AND code = ?`, 
                                           [code_id ?? null, code ?? null]);
        return result?.rows[0];
    }

    static async used_confirm_code(instance, code_id){
        const result = await instance.raw(`UPDATE ${this.table} 
                                           SET used_on_tz = timestamp
                                           WHERE code_id = ?`, [code_id]);

        return result;
    }

    static async get_latest_user_code(instance, user_id){
        const result = await instance.raw(`SELECT code_id,
                                                  user_id,
                                                  code,
                                                  to_char(created_on_tz, 'YYYY-MM-DD"T"HH24:MM:SS.MS') AS created_on_tz, 
                                                  to_char(used_on_tz, 'YYYY-MM-DD"T"HH24:MM:SS.MS') AS used_on_tz
                                           FROM ${this.table}
                                           WHERE user_id = ?
                                           ORDER BY created_on_tz DESC`,
                                           [user_id]);

        return result?.rows[0];
    }
}

export default ConfirmationCodes;