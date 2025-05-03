DROP TABLE IF EXISTS likes;

CREATE TABLE comment_likes (
    id bigint PRIMARY KEY DEFAULT next_id (),
    comment_id bigint NOT NULL,
    CONSTRAINT fk_comment FOREIGN KEY (comment_id) REFERENCES comments (id) ON DELETE CASCADE,
    user_id bigint NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE post_likes (
    id bigint PRIMARY KEY DEFAULT next_id (),
    post_id bigint NOT NULL,
    CONSTRAINT fk_comment FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
    user_id bigint NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE)

