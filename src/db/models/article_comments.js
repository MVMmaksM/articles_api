class ArticleComments {
    static table = 'public.article_comments';

    static async add_comment(instance, article_id, user_id, note, comment_owner_id){
        const comment_id = await this.get_seq(instance);
        await instance.raw(`INSERT INTO ${this.table} (comment_id, article_id, user_id, note, comment_owner_id)
                            VALUES (?,?,?,?,?)`, [comment_id, article_id, user_id, note, comment_owner_id]);
                            
        return comment_id;
    }

    static async get_comment_by_id(instance, comment_id){
        return (await instance.raw(`SELECT comment_id,
                                           article_id,
                                           user_id,
                                           note,
                                           comment_owner_id
                                    FROM ${this.table}
                                    WHERE comment_id = ?`, [comment_id]))?.rows[0];
    }

    static async get_seq(instance){
        return (await instance.raw(`SELECT nextval('article_comments_comment_id_seq')`))?.rows[0]?.nextval;
    }

    static async get_comments(instance, article_id, limit, offset, user_id){
        let where = "";
        let parameters = [];

        if(article_id){
            where += " AND article_id = ?";
            parameters.push(article_id);
        }

        if(user_id){
            where += " AND user_id = ?";
            parameters.push(user_id);
        }

        parameters.push(limit, offset);

        return (await instance.raw(`SELECT comment_id,
                                           article_id,
                                           user_id,
                                           note,
                                           comment_owner_id
                                    FROM ${this.table}
                                    WHERE 1=1 ${where}
                                    LIMIT ?
                                    OFFSET ?`, parameters))?.rows;
    }

    static async delete_comment(instance, comment_id){
        (await instance.raw(`DELETE FROM ${this.table} 
                            WHERE comment_id = ?`, 
                            [comment_id]))?.rowCount;
    }
}

export default ArticleComments;