import { v4 as uuidv4 } from 'uuid';

class ConfirmationCodes {

    static async add_code(instance, user_id, code){
        const code_id = uuidv4();    
        const result = await instance.raw(`INSERT INTO public.confirmation_codes (code_id, user_id, code)
                                           VALUES(?,?,?)`, [code_id, user_id ?? null, code ?? null]);

        return code_id;
    } 

    static async find_code(instance, code_id, code){       
        const result = await instance.raw(`SELECT code_id, 
                                           user_id, 
                                           code, 
                                           to_char(created_on_tz, 'YYYY-MM-DD"T"HH24:MM:SS.MS') AS created_on_tz, 
                                           to_char(used_on_tz, 'YYYY-MM-DD"T"HH24:MM:SS.MS') AS used_on_tz
                                           FROM public.confirmation_codes 
                                           WHERE code_id = ? AND code = ?`, 
                                           [code_id ?? null, code ?? null]);
        return result?.rows[0];
    }

    static async used_confirm_code(instance, code_id){
        const result = await instance.raw(`UPDATE public.confirmation_codes 
                                           SET used_on_tz = timestamp
                                           WHERE code_id = `)
    }
}

export default ConfirmationCodes;