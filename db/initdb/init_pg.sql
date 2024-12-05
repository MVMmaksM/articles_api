-- public.users определение

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	user_id serial4 NOT NULL,
	login varchar(255) NULL,
	"password" varchar(255) NULL,
	phone int8 NOT NULL,
	created_on_tz timestamp DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
	first_name varchar(255) NULL,
	last_name varchar(255) NULL,
	is_confirm bool DEFAULT false NOT NULL,
	is_author bool DEFAULT false NOT NULL,
	CONSTRAINT uq_phone UNIQUE (phone),
	CONSTRAINT users_pkey PRIMARY KEY (user_id)
);
CREATE INDEX ix_users_phone ON public.users USING btree (phone);

-- public.confirmation_codes определение

-- Drop table

DROP table if exists public.confirmation_codes;

CREATE TABLE public.confirmation_codes (
	code_id uuid NOT NULL,
	user_id int4 NOT NULL,
	code int4 NOT NULL,
	created_on_tz timestamp DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
	used_on_tz timestamp NULL,
	CONSTRAINT confirmation_codes_pkey PRIMARY KEY (code_id)
);
CREATE INDEX ix_confirmation_code ON public.confirmation_codes USING btree (code);

-- public.user_tokens определение

-- Drop table

DROP table if exists  public.user_tokens;

CREATE TABLE public.user_tokens (
	user_token_id serial4 NOT NULL,
	user_id int4 NOT NULL,
	"token" varchar(255) NOT NULL,
	created_on_tz timestamp DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
	CONSTRAINT uq_token UNIQUE (token),
	CONSTRAINT user_tokens_pkey PRIMARY KEY (user_token_id)
);
CREATE INDEX ix_user_tokens ON public.user_tokens USING btree (user_id);
CREATE INDEX ix_user_tokens_token ON public.user_tokens USING btree (token);


-- public.user_tokens внешние включи

ALTER TABLE public.user_tokens ADD CONSTRAINT user_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


-- public.articles определение

-- Drop table

-- DROP TABLE public.articles;

CREATE TABLE public.articles (
	article_id serial4 NOT NULL,
	author_id int4 NOT NULL,
	title varchar(256) NULL,
	created_on_tz timestamp DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
	updated_on_tz timestamp NULL,
	is_published bool DEFAULT false NULL,
	is_moderated bool DEFAULT false NULL,
	CONSTRAINT articles_pkey PRIMARY KEY (article_id)
);
CREATE INDEX ix_articles_author_id ON public.articles USING btree (author_id);


-- public.articles внешние включи

ALTER TABLE public.articles ADD CONSTRAINT articles_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(user_id);


-- public.article_notes определение

-- Drop table

DROP table if exists public.article_notes;

CREATE TABLE public.article_notes (
	article_id int4 NOT NULL,
	note text NOT NULL,
	CONSTRAINT article_notes_pkey PRIMARY KEY (article_id)
);


-- public.article_notes внешние включи

ALTER TABLE public.article_notes ADD CONSTRAINT article_notes_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.articles(article_id);

-- public.article_views определение

-- Drop table

-- DROP TABLE public.article_views;

CREATE TABLE public.article_views (
	article_id int4 NOT NULL,
	count int4 DEFAULT 0 NULL,
	CONSTRAINT article_views_pkey PRIMARY KEY (article_id)
);

-- public.article_views внешние включи

ALTER TABLE public.article_views ADD CONSTRAINT article_views_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.articles(article_id);

-- public.article_favorites определение

-- Drop table

-- DROP TABLE public.article_favorites;

CREATE TABLE public.article_favorites (
	article_id int4 NOT NULL,
	user_id int4 NOT NULL,
	CONSTRAINT article_favorites_pkey PRIMARY KEY (article_id, user_id)
);


-- public.article_favorites внешние включи

ALTER TABLE public.article_favorites ADD CONSTRAINT article_favorites_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.articles(article_id);
ALTER TABLE public.article_favorites ADD CONSTRAINT article_favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);

-- public.article_comments определение

-- Drop table

-- DROP TABLE public.article_comments;

CREATE TABLE public.article_comments (
	comment_id serial4 NOT NULL,
	article_id int4 NOT NULL,
	user_id int4 NOT NULL,
	note text NULL,
	created_on_tz timestamp DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
	comment_owner_id int4 NULL,
	CONSTRAINT article_comments_pkey PRIMARY KEY (comment_id)
);
CREATE INDEX ix_article_comments_article_id ON public.article_comments USING btree (article_id);
CREATE INDEX ix_article_comments_user_id ON public.article_comments USING btree (user_id);


-- public.article_comments внешние включи

ALTER TABLE public.article_comments ADD CONSTRAINT article_comments_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.articles(article_id);
ALTER TABLE public.article_comments ADD CONSTRAINT article_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);
ALTER TABLE public.article_comments ADD CONSTRAINT fk_comment_owner_id FOREIGN KEY (comment_owner_id) REFERENCES public.article_comments(comment_id);