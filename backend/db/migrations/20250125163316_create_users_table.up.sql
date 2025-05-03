CREATE TABLE users (
    id bigint PRIMARY KEY DEFAULT next_id (),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    email varchar(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    username varchar(100) NOT NULL UNIQUE
);

