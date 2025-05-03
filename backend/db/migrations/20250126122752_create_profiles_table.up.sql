CREATE TABLE profiles (
    id bigint PRIMARY KEY DEFAULT next_id (),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    name varchar(100) NOT NULL,
    user_id bigint UNIQUE NOT NULL,
    profile_image uuid UNIQUE,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE)

