class Users {

    static users = "public.users";

    static async find_user_phone(instance, phone){
        const users = await instance.raw('SELECT user_id FROM public.users WHERE phone = ?', [phone]);
        return users?.rows[0]?.user_id;
    }

    static async create_user(instance, user){   
        const user_id = await this.get_sequence(instance);
        const result = await instance.raw(`INSERT INTO ${this.users} (USER_ID, LOGIN, PASSWORD, PHONE, FIRST_NAME, LAST_NAME) 
                                           VALUES(?,?,?,?,?,?)`, 
                                           [user_id, user?.login, user?.password, user?.phone, user?.firstname ?? `user_${user_id}`, user?.lastname]); 

        return user_id;
    }

    static async get_sequence(instance){
        return (await instance.raw(`SELECT nextval('users_user_id_seq')`))?.rows[0]?.nextval;
    }
}

export default Users;