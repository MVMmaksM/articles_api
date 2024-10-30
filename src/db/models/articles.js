class Articles{
    static table_name = 'public.articles';

    static async get_articles(instance, start, count){
        return (await instance.raw(`SELECT article_id, created_by, name, created_on_tz, updated_on_tz
                                  FROM ${this.table_name}
                                  LIMIT ?
                                  OFFSET ?`, [count ?? 200, start ?? 1]))?.rows;
    }
}

export default Articles;