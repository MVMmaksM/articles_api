class ArticleTags{
    static table = `public.article_tags`;

    static async add_article_tags(instance, article_id, tag_id){
        return (await instance.raw(`INSERT INTO ${this.table} (article_id, tag_id)
                                    VALUES (?,?)`, [article_id, tag_id]))?.rowCount;
    }

    static async get_article_tags(instance, article_id){
        return (await instance.raw(`SELECT t.tag_id,
                                           at.note
                                    FROM ${this.table} at 
                                    INNER JOIN tags t ON at.tag_id = t.tag_id
                                    WHERE at.article_id = ?`, [article_id]))?.rows;
    }

    static async delete(instance, article_id){
            return (await instance.raw(`DELETE FROM ${this.table} 
                                        WHERE article_id = ?`, [article_id]))?.rowCount
    }
}

export default ArticleTags;