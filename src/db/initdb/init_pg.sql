
CREATE TABLE public.confirmation_codes (
	code_id uuid NOT NULL,
	user_id int4 NOT NULL,
	code int4 NOT NULL,
	created_on_tz timestamp DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
	used_on_tz timestamp NULL,
	CONSTRAINT confirmation_codes_pkey PRIMARY KEY (code_id)
);
CREATE INDEX ix_confirmation_code ON public.confirmation_codes USING btree (code);

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