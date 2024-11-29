class Tags{
    static table = 'public.tags';

    static async get_tags(instance, limit, offset){
        return (await instance.raw(`SELECT tag_id,
                                           note
                                    FROM ${this.table}
                                    LIMIT ?
                                    OFFSET ?`, [limit, offset]))?.rows;
    }

    static async get_tag_by_id(instance, tag_id){
        return (await instance.raw(`SELECT tag_id,
                                           note
                                    FROM ${this.table}
                                    WHERE tag_id = ?`, [tag_id]))?.rows[0];
    }
} 

export default Tags;