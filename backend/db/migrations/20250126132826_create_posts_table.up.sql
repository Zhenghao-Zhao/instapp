CREATE TABLE posts (
    id bigint PRIMARY KEY DEFAULT next_id (),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    content text,
    user_id bigint NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

