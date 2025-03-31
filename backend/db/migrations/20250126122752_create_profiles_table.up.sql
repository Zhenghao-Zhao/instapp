CREATE TABLE profiles
(
    id            serial PRIMARY KEY,
    created_at    TIMESTAMP with time zone DEFAULT now() NOT NULL,
    name          varchar(100)                           NOT NULL,
    user_id       INT UNIQUE                             NOT NULL,
    profile_image UUID UNIQUE,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
)