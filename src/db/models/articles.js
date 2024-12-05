class Articles{
    static articles = 'public.articles';
    static article_notes = 'public.article_notes';
    static article_views = 'public.article_views';
    static article_favorites = 'public.article_favorites';

    static async get_articles(instance, limit, offset, is_published){
        let where = "1=1";

        if(is_published === true){
            where += " AND is_published=true";
        }else if(is_published === false){
            where += " AND is_published=false";
        }

        return (await instance.raw(`SELECT a.article_id,                                             
                                           a.title, 
                                           to_char(a.created_on_tz, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ') AS created_on_tz, 
                                           to_char(a.updated_on_tz, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ') AS updated_on_tz,
                                           a.author_id,
                                           CONCAT(u.first_name, '',u.last_name) AS author_str,
                                           to_char(a.published_on_tz, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ') AS published_on_tz
                                    FROM ${this.articles} a
                                    INNER JOIN users u ON u.user_id = a.author_id
                                    WHERE ${where}
                                    ORDER BY a.created_on_tz DESC
                                    LIMIT ?
                                    OFFSET ?`, [limit ?? 200, offset ?? 0]))?.rows;
    }

    static async get_detail_article(instance, article_id, user_id){
        let article = (await instance.raw(`SELECT a.article_id,                                                                                       
                                           to_char(a.created_on_tz, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ') AS created_on_tz, 
                                           to_char(a.updated_on_tz, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ') AS updated_on_tz,
                                           a.title, 
                                           an.note,
                                           a.author_id, 
                                           u.first_name AS author_first_name, 
                                           u.last_name AS author_last_name,                                       
                                           av.count AS count_view,
                                           EXISTS (SELECT 1 FROM ${this.article_favorites} WHERE article_id = a.article_id AND user_id = ?) AS is_favorites,                                           
                                           to_char(a.published_on_tz, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ') AS published_on_tz,
                                           to_char(a.remove_published_on_tz, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ') AS remove_published_on_tz,
                                           a.is_published                                                            
                                    FROM ${this.articles} a
                                    INNER JOIN ${this.article_notes} an ON a.article_id = an.article_id
                                    INNER JOIN users u ON u.user_id = a.author_id
                                    INNER JOIN article_views av ON a.article_id = av.article_id
                                    WHERE a.article_id = ?`, [user_id, article_id]))?.rows[0];

        //тэги
        article.tags = (await instance.raw(`SELECT t.tag_id AS tag_id,
                                   t.note AS note
                            FROM article_tags at
                            INNER JOIN tags t ON at.tag_id = t.tag_id
                            WHERE at.article_id = ?`, [article_id]))?.rows;

        return article;
    }

    static async get_seq(instance){
        return (await instance.raw(`SELECT nextval('articles_article_id_seq')`))?.rows[0]?.nextval;
    }

    static async create_article(instance, {title, note, author_id}){      
        const article_id = await this.get_seq(instance);

        await instance.raw(`INSERT INTO ${this.articles} (article_id, title, author_id)
                                           VALUES(?,?,?);`, [article_id, title, author_id]);

        await instance.raw(`INSERT INTO ${this.article_notes} (article_id, note)
                            VALUES(?, ?);`, [article_id, note]);       
                                           
        return article_id;
    }

    static async delete_article(instance, article_id){                     
        await instance.raw(`DELETE FROM ${this.article_notes}
                            WHERE article_id = ?`,
                            [article_id]);

        return (await instance.raw(`DELETE FROM ${this.articles}
                            WHERE article_id = ?`,
                            [article_id])).rowCount;                        
    }

    static async update_article(instance, article_id, title, note){
        await instance.raw(`UPDATE ${this.articles}
                            SET title = ?, updated_on_tz = NOW() AT TIME ZONE 'UTC'
                            WHERE article_id = ?`,
                            [title, article_id]);

        await instance.raw(`UPDATE ${this.article_notes}
                            SET note = ?
                            WHERE article_id = ?`,
                            [note, article_id]);
    }

    static async get_count_publish_articles(instance, user_id){
        return (await instance.raw(`SELECT COUNT(*)
                                    FROM ${this.articles}
                                    WHERE author_id = ? AND is_published = true`, [user_id]))?.rows[0]?.count; 
    }

    static async get_article_by_id(instance, article_id){
        return (await instance.raw(`SELECT a.article_id,                                                                                       
                                            to_char(a.created_on_tz, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ') AS created_on_tz, 
                                            to_char(a.updated_on_tz, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ') AS updated_on_tz,
                                            a.title,
                                            a.author_id,
                                            a.is_published                                                                                                                                                       
                                    FROM ${this.articles} a                           
                                    INNER JOIN users u ON u.user_id = a.author_id                           
                                    WHERE a.article_id = ?`, [article_id]))?.rows[0];
    }

    static async article_publish(instance, article_id){
        return (await instance.raw(`UPDATE ${this.articles}
                                    SET is_published = true, published_on_tz = now() AT TIME ZONE 'utc'::text, remove_published_on_tz = NULL
                                    WHERE article_id = ?`, [article_id]))?.rowCount;
    }

    static async get_articles_is_only_my(instance, limit, offset, user_id){
        return (await instance.raw(`SELECT  a.article_id,                                             
                                            a.title, 
                                            to_char(a.created_on_tz, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ') AS created_on_tz, 
                                            to_char(a.updated_on_tz, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ') AS updated_on_tz,
                                            a.author_id,
                                            CONCAT(u.first_name, '',u.last_name) AS author_str,
                                            a.is_published,
                                            to_char(a.published_on_tz, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ') AS published_on_tz
                                    FROM ${this.articles} a
                                    INNER JOIN users u ON u.user_id = a.author_id
                                    WHERE a.author_id = ?
                                    ORDER BY a.created_on_tz DESC
                                    LIMIT ?
                                    OFFSET ?`, [user_id, limit ?? 200, offset ?? 0]))?.rows;
    }

    static async article_remove_publish(instance, article_id){
        return (await instance.raw(`UPDATE ${this.articles}
                                    SET is_published = false, remove_published_on_tz = now() AT TIME ZONE 'utc'::text
                                    WHERE article_id = ?`, [article_id]))?.rowCount;
    }
}

export default Articles;