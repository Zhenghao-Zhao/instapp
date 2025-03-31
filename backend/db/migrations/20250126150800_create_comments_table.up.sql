CREATE TABLE comments (
    id serial PRIMARY KEY,
    uid uuid DEFAULT gen_random_uuid () NOT NULL UNIQUE,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    content text NOT NULL,
    user_id int NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    post_id int NOT NULL,
    CONSTRAINT fk_post FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
);

