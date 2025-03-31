CREATE TABLE followers (
    id serial PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    follower_id int NOT NULL,
    followee_id int NOT NULL,
    CONSTRAINT fk_follower FOREIGN KEY (follower_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_followee FOREIGN KEY (followee_id) REFERENCES users (id) ON DELETE CASCADE)

