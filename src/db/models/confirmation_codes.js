import { v4 as uuidv4 } from 'uuid';

class ConfirmationCodes {

    static async add_code(instance, user_id, code){
        const code_id = uuidv4();    
        const result = await instance.raw(`INSERT INTO public.confirmation_codes (code_id, user_id, code) VALUES(?,?,?)`, [code_id, user_id ?? null, code ?? null]);
        
        if(result?.rowCount === 0)
            throw Error("Ошибка при добавлении записи в таблицу confirmation_codes");

        return code_id;
    } 

    static async find_code_code_id(instance, code_id, code){       
        const result = await instance.raw(`SELECT user_id FROM public.confirmation_codes WHERE code_id = ? AND code = ?`, [code_id ?? null, code ?? null]);
        return result?.rows[0].user_id;
    }
}

export default ConfirmationCodes;