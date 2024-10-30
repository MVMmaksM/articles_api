-- public.users определение

-- Drop table
DROP table if EXISTS public.users;

CREATE TABLE public.users (
	user_id serial4 NOT NULL,
	login varchar(255) NULL,
	"password" varchar(255) NULL,
	phone int8 NOT NULL,
	created_on_tz timestamp DEFAULT (now() AT TIME ZONE 'utc'::text) NULL,
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

DROP table if exists  public.articles;

CREATE TABLE public.articles (
	article_id serial4 NOT NULL,
	created_by int4 NOT NULL,
	"name" varchar(256) NULL,
	created_on_tz timestamp DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
	updated_on_tz timestamp NULL,
	CONSTRAINT articles_pkey PRIMARY KEY (article_id)
);
CREATE INDEX ix_articles_created_by ON public.articles USING btree (created_by);


-- public.articles внешние включи

ALTER TABLE public.articles ADD CONSTRAINT articles_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(user_id);

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