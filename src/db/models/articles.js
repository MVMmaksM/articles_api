class Articles{
    static table_name = 'public.articles';

    static async get_articles(instance){
        return (await instance.raw(`SELECT article_id, created_by, name, created_on_tz, updated_on_tz
                                  FROM ${this.table_name}`))?.rows;
    }
}

export default Articles;