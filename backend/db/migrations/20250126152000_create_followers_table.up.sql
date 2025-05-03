CREATE TABLE followers (
    id bigint PRIMARY KEY DEFAULT next_id (),
    follower_id bigint NOT NULL,
    followee_id bigint NOT NULL,
    CONSTRAINT fk_follower FOREIGN KEY (follower_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_followee FOREIGN KEY (followee_id) REFERENCES users (id) ON DELETE CASCADE)
