import { v4 as uuidv4 } from 'uuid';

class ConfirmationCodes {
    static table = "public.confirmation_codes";

    static async add_code(instance, user_id, code, is_reg, is_auth){
        const code_id = uuidv4();    
        const result = await instance.raw(`INSERT INTO ${this.table} (code_id, user_id, code, is_reg, is_auth)
                                           VALUES(?,?,?,?,?)`, [code_id, user_id ?? null, code ?? null, is_reg ?? null, is_auth ?? null]);

        return code_id;
    } 

    static async find_code(instance, code_id, code, is_reg = undefined, is_auth = undefined){   
        let where = "code_id = ? AND code = ?";
        let parameters = [code_id, code];

        if(is_reg == null)
            where += " AND is_reg IS NULL";
        
        if(is_reg){
            where += " AND is_reg = ?";
            parameters.push(is_reg);
        }

        if(is_auth == null)
            where += " AND is_auth IS NULL";

        if(is_auth){
            where += " AND is_auth = ?";
            parameters.push(is_auth);
        }               

        const result = await instance.raw(`SELECT code_id, 
                                                  user_id, 
                                                  code, 
                                                  to_char(created_on_tz, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ') AS created_on_tz, 
                                                  to_char(used_on_tz, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ') AS used_on_tz,
                                                  is_reg,
                                                  is_auth
                                           FROM ${this.table}
                                           WHERE ${where}`, 
                                           parameters);
        return result?.rows[0];
    }

    static async used_confirm_code(instance, code_id){
        const result = await instance.raw(`UPDATE ${this.table} 
                                           SET used_on_tz =  now() at time zone 'utc'
                                           WHERE code_id = ?`, [code_id]);

        return result?.rowCount;
    }

    static async get_latest_code(instance, user_id, is_reg = undefined, is_auth = undefined){
        let where = "user_id = ?";
        let parameters = [user_id];
        
        if(is_reg == null)
            where += " AND is_reg IS NULL";
        
        if(is_reg){
            where += " AND is_reg = ?";
            parameters.push(is_reg);
        }

        if(is_auth == null)
            where += " AND is_auth IS NULL";

        if(is_auth){
            where += " AND is_auth = ?";
            parameters.push(is_auth);
        }

        const result = await instance.raw(`SELECT code_id,
                                                  user_id,
                                                  code,
                                                  to_char(created_on_tz, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ') AS created_on_tz, 
                                                  to_char(used_on_tz, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ') AS used_on_tz,
                                                  is_reg,
                                                  is_auth
                                           FROM ${this.table}
                                           WHERE ${where}
                                           ORDER BY created_on_tz DESC
                                           LIMIT 1;`,
                                           parameters);

        return result?.rows[0];
    }
}

export default ConfirmationCodes;