class ArticleFavorites {
    static table = 'public.article_favorites';

    static async exists(instance, article_id, user_id){
        return (await instance.raw(`SELECT EXISTS (SELECT null 
                                                   FROM ${this.table} 
                                                   WHERE article_id = ? AND user_id = ?)`, 
                                                   [article_id, user_id]))?.rows[0]?.exists;
    }

    static async delete(instance, article_id, user_id){
        return (await instance.raw(`DELETE FROM ${this.table}
                            WHERE article_id = ?  AND user_id = ?`, [article_id, user_id]))?.rowCount;
    }

    static async add(instance, article_id, user_id){
        return (await instance.raw(`INSERT INTO ${this.table}(article_id, user_id)
                                    VALUES(?,?)`, [article_id, user_id]))?.rowCount;
    }
}

export default ArticleFavorites;