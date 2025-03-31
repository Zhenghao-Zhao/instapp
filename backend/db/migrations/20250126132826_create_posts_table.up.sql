CREATE TABLE posts (
    id serial PRIMARY KEY,
    uid uuid DEFAULT gen_random_uuid () NOT NULL UNIQUE,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    content text,
    user_id int NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);


