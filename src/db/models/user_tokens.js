class UserTokens {
    static async add_token(instance, user_id, token){
        const user_token_id = await this.get_sequence(instance);
        const user_token = await instance.raw(`INSERT INTO public.user_tokens (user_token_id, user_id, token)
                                               VALUES(?,?,?)`, [user_token_id, user_id, token]);
        return user_token_id;
    }

    static async get_sequence(instance){
        return (await instance.raw(`SELECT nextval('user_tokens_user_token_id_seq')`))?.rows[0]?.nextval;
    }
}

export default UserTokens;