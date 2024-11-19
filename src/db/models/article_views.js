class ArticleViews{
    static table = 'public.article_views';

    static async create_view(instance, article_id){
        await instance.raw(`INSERT INTO ${this.table} (article_id)
                            VALUES (?)`, [article_id]);
    }

    static async delete_view(instance, article_id){
        await instance.raw(`DELETE FROM ${this.table}
                            WHERE article_id = ?`, [article_id]);
    }

    static async inc_view(instance, article_id){
        await instance.raw(`UPDATE ${this.table}
                            SET count = count + 1
                            WHERE article_id = ?;`, [article_id]);
    }
}

export default ArticleViews;