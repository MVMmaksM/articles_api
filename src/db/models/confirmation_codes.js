import { v4 as uuidv4 } from 'uuid';

class ConfirmationCodes {
    static table = "public.confirmation_codes";

    static async add_code(instance, user_id, code, is_reg, is_auth){
        const code_id = uuidv4();    
        const result = await instance.raw(`INSERT INTO ${this.table} (code_id, user_id, code, is_reg, is_auth)
                                           VALUES(?,?,?,?,?)`, [code_id, user_id ?? null, code ?? null, is_reg ?? null, is_auth ?? null]);

        return code_id;
    } 

    static async find_code(instance, code_id, code){       
        const result = await instance.raw(`SELECT code_id, 
                                                  user_id, 
                                                  code, 
                                                  to_char(created_on_tz, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ') AS created_on_tz, 
                                                  to_char(used_on_tz, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ') AS used_on_tz
                                           FROM ${this.table}
                                           WHERE code_id = ? AND code = ?`, 
                                           [code_id ?? null, code ?? null]);
        return result?.rows[0];
    }

    static async used_confirm_code(instance, code_id){
        const result = await instance.raw(`UPDATE ${this.table} 
                                           SET used_on_tz =  now() at time zone 'utc'
                                           WHERE code_id = ?`, [code_id]);

        return result?.rowCount;
    }

    static async get_latest_code(instance, user_id, is_reg, is_auth){
        const result = await instance.raw(`SELECT code_id,
                                                  user_id,
                                                  code,
                                                  to_char(created_on_tz, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ') AS created_on_tz, 
                                                  to_char(used_on_tz, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ') AS used_on_tz
                                           FROM ${this.table}
                                           WHERE user_id = ? AND is_reg = ? AND is_auth = ?
                                           ORDER BY created_on_tz DESC`,
                                           [user_id, is_reg ?? null, is_auth ?? null]);

        return result?.rows[0];
    }
}

export default ConfirmationCodes;