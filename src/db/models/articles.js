class Articles{
    static articles = 'public.articles';
    static article_notes = 'public.article_notes';

    static async get_articles(instance, limit, offset){
        return (await instance.raw(`SELECT article_id, created_by, title, created_on_tz, updated_on_tz
                                  FROM ${this.articles}
                                  LIMIT ?
                                  OFFSET ?`, [limit ?? 200, offset ?? 0]))?.rows;
    }

    static async get_detail_article(instance, article_id){
        return (await instance.raw(`SELECT a.article_id, 
                                           a.created_by, 
                                           u.first_name AS created_by_first_name, 
                                           u.last_name AS created_by_last_name, 
                                           a.title, 
                                           a.created_on_tz, 
                                           a.updated_on_tz, an.note
                                    FROM ${this.articles} a
                                    INNER JOIN ${this.article_notes} an ON a.article_id = an.article_id
                                    INNER JOIN users u ON u.user_id = a.created_by
                                    WHERE a.article_id = ?`, [article_id]))?.rows;
    }

    static async get_seq(instance){
        return (await instance.raw(`SELECT nextval('articles_article_id_seq')`))?.rows[0]?.nextval;
    }

    static async create_article(instance, {title, note, created_by}){
        const article_id = await this.get_seq(instance);

        await instance.raw(`INSERT INTO ${this.articles} (article_id, title, created_by)
                                           VALUES(?,?,?);`, [article_id, title, created_by]);

        await instance.raw(`INSERT INTO ${this.article_notes} (article_id, note)
                            VALUES(?, ?);`, [article_id, note]);
                                           
        return await this.get_detail_article(instance, article_id);
    }
}

export default Articles;