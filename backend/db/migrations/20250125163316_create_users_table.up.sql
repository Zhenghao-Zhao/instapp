CREATE TABLE users (
    id serial PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    uid uuid DEFAULT gen_random_uuid () NOT NULL UNIQUE,
    email varchar(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    username varchar(100) NOT NULL UNIQUE
);

