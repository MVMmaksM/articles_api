class Users {

    static table = "public.users";

    static async find_user_phone(instance, phone){
        const users = await instance.raw(`SELECT user_id,
                                                 login,
                                                 password,
                                                 phone,
                                                 to_char(a.created_on_tz, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ') AS created_on_tz,
                                                 first_name,
                                                 last_name,
                                                 is_confirm,
                                                 is_author 
                                          FROM ${table} 
                                          WHERE phone = ?`, [phone]);
        return users?.rows[0];
    }

    static async create_user(instance, user){   
        const user_id = await this.get_sequence(instance);
        const result = await instance.raw(`INSERT INTO ${this.table} (user_id, login, password, phone, first_name, last_name, is_confirm) 
                                           VALUES(?,?,?,?,?,?, false)`, 
                                           [user_id, user?.login, user?.password, user?.phone, user?.firstname ?? `user_${user_id}`, user?.lastname]); 

        return user_id;
    }

    static async confirm_user(instance, user_id){
        const result = await instance.raw(`UPDATE ${this.table}
                                           SET is_confirm = true
                                           WHERE user_id = ?`,
                                           [user_id]);

        return result?.rowCount;
    }

    static async get_sequence(instance){
        return (await instance.raw(`SELECT nextval('users_user_id_seq')`))?.rows[0]?.nextval;
    }
    
    static async get_user_by_id(instance, user_id){
        return (await instance.raw(`SELECT user_id,
                             login,
                             password,
                             phone,
                             to_char(created_on_tz, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ') AS created_on_tz,
                             first_name,
                             last_name,
                             is_confirm,
                             is_author 
                      FROM ${this.table}
                      WHERE user_id = ?`, [user_id]))?.rows[0];
    }

    static async set_is_author(instance, user_id){
        return (await instance.raw(`UPDATE ${this.table}
                                    SET is_author = true
                                    WHERE user_id = ?;`, [user_id]))?.rowCount;
    }

    static async get_authors(instance, limit, offset){
        return (await instance.raw(`SELECT u.user_id AS author_id,
                                           u.first_name,
                                           u.last_name,
                                           (SELECT COUNT(*) FROM articles a WHERE a.author_id = u.user_id) AS count_articles                                        
                                    FROM ${this.table} u
                                    WHERE u.is_author = true
                                    ORDER BY u.user_id DESC
                                    LIMIT ?
                                    OFFSET ?`, [limit, offset]))?.rows;
    }
}

export default Users;