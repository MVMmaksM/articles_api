class UserTokens {
    static users = 'public.users';
    static user_tokens = 'public.user_tokens';

    static async add_token(instance, user_id, token){
        const user_token_id = await this.get_sequence(instance);
        console.log(user_token_id)
        const user_token = await instance.raw(`INSERT INTO ${this.user_tokens} (user_token_id, user_id, token)
                                               VALUES(?,?,?)`, [user_token_id, user_id, token]);
        return user_token_id;
    }

    static async get_sequence(instance){
        return (await instance.raw(`SELECT nextval('user_tokens_user_token_id_seq')`))?.rows[0]?.nextval;
    }

    static async find_user_token(instance, token){
        return (await instance.raw(`SELECT u.user_id, u.login, u.phone, u.created_on_tz 
                                    FROM ${this.user_tokens} ut
                                    INNER JOIN ${this.users} u ON ut.user_id = u.user_id
                                    WHERE ut.token = ?`, [token]))?.rows[0];
    }
}

export default UserTokens;