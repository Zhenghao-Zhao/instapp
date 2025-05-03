CREATE TABLE post_images (
    id bigint PRIMARY KEY DEFAULT next_id (),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    uid uuid UNIQUE NOT NULL,
    post_id bigint NOT NULL,
    CONSTRAINT fk_post FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
);


