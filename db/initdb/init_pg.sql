-- public.confirmation_codes определение

-- Drop table

-- DROP TABLE public.confirmation_codes;

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

-- DROP TABLE public.user_tokens;

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



-- public.users определение

-- Drop table

-- DROP TABLE public.users;

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


-- public.articles определение

-- Drop table

-- DROP TABLE public.articles;

CREATE TABLE public.articles (
	article_id serial4 NOT NULL,
	author_id int4 NOT NULL,
	"name" varchar(256) NULL,
	created_on_tz timestamp DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
	update_on_tz timestamp NULL,
	CONSTRAINT articles_pkey PRIMARY KEY (article_id)
);
CREATE INDEX ix_articles_author_id ON public.articles USING btree (author_id);


-- public.articles внешние включи

ALTER TABLE public.articles ADD CONSTRAINT articles_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(user_id);