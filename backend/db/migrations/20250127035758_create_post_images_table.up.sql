CREATE TABLE post_images (
    id serial PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    uid uuid UNIQUE NOT NULL,
    post_id int NOT NULL,
    CONSTRAINT fk_post FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
);