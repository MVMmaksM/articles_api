class Users {

    static users = "public.users";

    static async find_user_phone(instance, phone){
        const users = await instance.raw(`SELECT user_id,
                                                 login,
                                                 password,
                                                 phone,
                                                 to_char(a.created_on_tz, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ') AS created_on_tz,
                                                 first_name,
                                                 last_name,
                                                 is_confirm 
                                          FROM public.users 
                                          WHERE phone = ?`, [phone]);
        return users?.rows[0];
    }

    static async create_user(instance, user){   
        const user_id = await this.get_sequence(instance);
        const result = await instance.raw(`INSERT INTO ${this.users} (user_id, login, password, phone, first_name, last_name, is_confirm) 
                                           VALUES(?,?,?,?,?,?, false)`, 
                                           [user_id, user?.login, user?.password, user?.phone, user?.firstname ?? `user_${user_id}`, user?.lastname]); 

        return user_id;
    }

    static async confirm_user(instance, user_id){
        const result = await instance.raw(`UPDATE ${this.users}
                                           SET is_confirm = true
                                           WHERE user_id = ?`,
                                           [user_id]);

        return result?.rowCount;
    }

    static async get_sequence(instance){
        return (await instance.raw(`SELECT nextval('users_user_id_seq')`))?.rows[0]?.nextval;
    }
}

export default Users;