
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE OR REPLACE FUNCTION "public"."get_paginated_comments"("arg_post_uid" "uuid", "arg_from_uid" "uuid", "arg_from" integer, "arg_limit" integer) RETURNS TABLE("ret_created_at" timestamp with time zone, "ret_username" "text", "ret_name" "text", "ret_profile_image" "uuid", "ret_profile_uid" "uuid", "ret_comment" "text", "ret_comment_uid" "uuid", "ret_like_count" bigint, "ret_has_liked" boolean)
    LANGUAGE "plpgsql"
    AS $$
begin
  return query
  select 
  comments.created_at as ret_created_at,
  username as ret_username, 
  name as ret_name, 
  image_filename as ret_profile_image, 
  profiles.uid as ret_profile_uid,
  comment as ret_comment,
  comments.uid as ret_comment_uid,
  coalesce(t1.like_count, 0) as ret_like_count,
  t2.comment_uid is not null as ret_has_liked
  from comments 
  left join 
  profiles on comments.from_uid = profiles.uid
  left join
  (select comment_uid, count(*) as like_count from comment_likes group by comment_uid) t1 on t1.comment_uid = comments.uid
  left join
  (select comment_uid from comment_likes where liked_by = arg_from_uid) t2 on t2.comment_uid = comments.uid
  where comments.post_uid = arg_post_uid order by comments.from_uid=arg_from_uid desc, ret_like_count desc, comments.created_at desc limit arg_limit offset arg_from;
end;
$$;

ALTER FUNCTION "public"."get_paginated_comments"("arg_post_uid" "uuid", "arg_from_uid" "uuid", "arg_from" integer, "arg_limit" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_paginated_explore_posts"("arg_from_uid" "uuid", "arg_from" integer, "arg_limit" integer) RETURNS TABLE("ret_post_uid" "uuid", "ret_created_at" timestamp with time zone, "ret_description" "text", "ret_comment_count" bigint, "ret_owner_username" "text", "ret_owner_name" "text", "ret_owner_uid" "uuid", "ret_owner_profile_image" "uuid", "ret_follows_owner" boolean, "ret_like_count" bigint, "ret_has_liked" boolean, "ret_post_images" "uuid"[])
    LANGUAGE "plpgsql"
    AS $$
begin
  return query
  select 
  posts.uid as ret_post_uid, 
  posts.created_at as ret_created_at, 
  posts.description as ret_description, 
  t5.comment_count as ret_comment_count,
  profiles.username as ret_owner_username, 
  profiles.name as ret_owner_name, 
  profiles.uid as ret_owner_uid,
  profiles.image_filename as ret_owner_profile_image,
  t4.followee_uid is not null as ret_follows_owner,
  coalesce(t1.like_count, 0) as ret_like_count, 
  t2.from_uid is not null as ret_has_liked, 
  t3.filenames as ret_post_images
  from posts 
  left join 
  profiles on posts.from_uid = profiles.uid 
  left join 
  (select post_uid, count(*) as like_count from likes group by post_uid) t1 on posts.uid = t1.post_uid 
  left join 
  (select * from likes where likes.from_uid = arg_from_uid) t2 on posts.uid = t2.post_uid
  left join 
  (select post_uid, array_agg(filename) as filenames from images group by post_uid) t3 on t3.post_uid = posts.uid
  left join 
  (select followee_uid from friends where follower_uid = arg_from_uid) t4 on t4.followee_uid = profiles.uid 
  left join
  (select post_uid, count(post_uid) as comment_count from comments group by post_uid) t5 on t5.post_uid = posts.uid
  where profiles.uid != arg_from_uid order by posts.created_at desc limit arg_limit offset arg_from;
end;
$$;

ALTER FUNCTION "public"."get_paginated_explore_posts"("arg_from_uid" "uuid", "arg_from" integer, "arg_limit" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_paginated_followee_posts"("arg_from_uid" "uuid", "arg_from" integer, "arg_limit" integer) RETURNS TABLE("ret_post_uid" "uuid", "ret_created_at" timestamp with time zone, "ret_description" "text", "ret_comment_count" bigint, "ret_owner_username" "text", "ret_owner_name" "text", "ret_owner_uid" "uuid", "ret_owner_profile_image" "uuid", "ret_follows_owner" boolean, "ret_like_count" bigint, "ret_has_liked" boolean, "ret_post_images" "uuid"[])
    LANGUAGE "plpgsql"
    AS $$
begin
  return query
  select 
  posts.uid as ret_post_uid, 
  posts.created_at as ret_created_at, 
  posts.description as ret_description, 
  t5.comment_count as ret_comment_count,
  profiles.username as ret_owner_username, 
  profiles.name as ret_owner_name, 
  profiles.uid as ret_owner_uid,
  profiles.image_filename as ret_owner_profile_image, 
  profiles.uid is not null as ret_follows_owner,
  t1.like_count as ret_like_count, 
  t2.from_uid is not null as ret_has_liked, 
  t3.filenames as ret_post_images
  from posts
  left join 
  friends on friends.followee_uid = posts.from_uid 
  left join 
  profiles on profiles.uid = friends.followee_uid
  left join 
  (select post_uid, count(*) as like_count from likes group by post_uid) t1 on posts.uid = t1.post_uid
  left join 
  (select * from likes where likes.from_uid = arg_from_uid) t2 on posts.uid = t2.post_uid
  left join 
  (select post_uid, array_agg(filename) as filenames from images group by post_uid) t3 on t3.post_uid = posts.uid
  left join
  (select post_uid, count(post_uid) as comment_count from comments group by post_uid) t5 on t5.post_uid = posts.uid
  where friends.follower_uid = arg_from_uid order by friends.followee_uid, posts.created_at desc limit arg_limit offset arg_from;
end;
$$;

ALTER FUNCTION "public"."get_paginated_followee_posts"("arg_from_uid" "uuid", "arg_from" integer, "arg_limit" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_paginated_user_followees"("arg_from_uid" "uuid", "arg_uid" "uuid", "arg_from" integer, "arg_limit" integer) RETURNS TABLE("ret_uid" "uuid", "ret_username" "text", "ret_name" "text", "ret_profile_image" "uuid", "ret_has_followed" boolean)
    LANGUAGE "plpgsql"
    AS $$
begin
  return query
  select
  profiles.uid as ret_uid,
  profiles.username as ret_username, 
  profiles.name as ret_name, 
  profiles.image_filename as ret_profile_image,
  f1.followee_uid is not null as ret_has_followed
  from friends 
  left join 
  profiles on friends.followee_uid = profiles.uid
  left join
  friends f1 on f1.followee_uid = friends.followee_uid and f1.follower_uid = arg_from_uid
  where friends.follower_uid = arg_uid 
  order by friends.created_at desc limit arg_limit offset arg_from;
end;
$$;

ALTER FUNCTION "public"."get_paginated_user_followees"("arg_from_uid" "uuid", "arg_uid" "uuid", "arg_from" integer, "arg_limit" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_paginated_user_followers"("arg_from_uid" "uuid", "arg_uid" "uuid", "arg_from" integer, "arg_limit" integer) RETURNS TABLE("ret_uid" "uuid", "ret_username" "text", "ret_name" "text", "ret_profile_image" "uuid", "ret_has_followed" boolean)
    LANGUAGE "plpgsql"
    AS $$
begin
  return query
  select 
  profiles.uid as ret_uid,
  profiles.username as ret_username, 
  profiles.name as ret_name, 
  profiles.image_filename as ret_profile_image,
  f1.followee_uid is not null as ret_has_followed
  from friends 
  left join 
  profiles on friends.follower_uid = profiles.uid
  left join
  friends f1 on f1.followee_uid = friends.follower_uid and f1.follower_uid = arg_from_uid
  where friends.followee_uid = arg_uid 
  order by friends.created_at desc limit arg_limit offset arg_from;
end;
$$;

ALTER FUNCTION "public"."get_paginated_user_followers"("arg_from_uid" "uuid", "arg_uid" "uuid", "arg_from" integer, "arg_limit" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_paginated_user_posts"("arg_uid" "uuid", "arg_from_uid" "uuid", "arg_from" integer, "arg_limit" integer) RETURNS TABLE("ret_post_uid" "uuid", "ret_created_at" timestamp with time zone, "ret_description" "text", "ret_comment_count" bigint, "ret_owner_username" "text", "ret_owner_name" "text", "ret_owner_uid" "uuid", "ret_owner_profile_image" "uuid", "ret_follows_owner" boolean, "ret_like_count" bigint, "ret_has_liked" boolean, "ret_post_images" "uuid"[])
    LANGUAGE "plpgsql"
    AS $$
begin
  return query
  select 
  posts.uid as ret_post_uid, 
  posts.created_at as ret_created_at, 
  posts.description as ret_description, 
  t5.comment_count as ret_comment_count,
  profiles.username as ret_owner_username, 
  profiles.name as ret_owner_name, 
  profiles.uid as ret_owner_uid,
  profiles.image_filename as ret_owner_profile_image,
  t4.followee_uid is not null as ret_follows_owner,
  coalesce(t1.like_count, 0) as ret_like_count, 
  t2.from_uid is not null as ret_has_liked, 
  t3.filenames as ret_post_images
  from posts 
  left join 
  profiles on posts.from_uid = profiles.uid 
  left join 
  (select post_uid, count(*) as like_count from likes group by post_uid) t1 on posts.uid = t1.post_uid 
  left join 
  (select * from likes where likes.from_uid = arg_from_uid) t2 on posts.uid = t2.post_uid
  left join 
  (select post_uid, array_agg(filename) as filenames from images group by post_uid) t3 on t3.post_uid = posts.uid
  left join 
  (select followee_uid from friends where follower_uid = arg_from_uid) t4 on t4.followee_uid = profiles.uid 
  left join
  (select post_uid, count(post_uid) as comment_count from comments group by post_uid) t5 on t5.post_uid = posts.uid
  where posts.from_uid = arg_uid order by posts.created_at desc limit arg_limit offset arg_from;
end;
$$;

ALTER FUNCTION "public"."get_paginated_user_posts"("arg_uid" "uuid", "arg_from_uid" "uuid", "arg_from" integer, "arg_limit" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_post"("arg_from_uid" "uuid", "arg_post_uid" "uuid") RETURNS TABLE("ret_post_uid" "uuid", "ret_created_at" timestamp with time zone, "ret_description" "text", "ret_comment_count" bigint, "ret_owner_username" "text", "ret_owner_name" "text", "ret_owner_uid" "uuid", "ret_owner_profile_image" "uuid", "ret_follows_owner" boolean, "ret_like_count" bigint, "ret_has_liked" boolean, "ret_post_images" "uuid"[])
    LANGUAGE "plpgsql"
    AS $$
begin
  return query
  select
  posts.uid as ret_post_uid, 
  posts.created_at as ret_created_at, 
  posts.description as ret_description, 
  t5.comment_count as ret_comment_count,
  profiles.username as ret_owner_username, 
  profiles.name as ret_owner_name, 
  profiles.uid as ret_owner_uid,
  profiles.image_filename as ret_owner_profile_image,
  t4.followee_uid is not null as ret_follows_owner,
  coalesce(t1.like_count, 0) as ret_like_count, 
  t2.from_uid is not null as ret_has_liked, 
  t3.filenames as ret_post_images
  from posts 
  left join 
  profiles on posts.from_uid = profiles.uid 
  left join 
  (select post_uid, count(*) as like_count from likes group by post_uid) t1 on posts.uid = t1.post_uid 
  left join 
  (select * from likes where likes.from_uid = arg_from_uid) t2 on posts.uid = t2.post_uid
  left join 
  (select post_uid, array_agg(filename) as filenames from images group by post_uid) t3 on t3.post_uid = posts.uid
  left join 
  (select followee_uid from friends where follower_uid = arg_from_uid) t4 on t4.followee_uid = profiles.uid 
  left join
  (select post_uid, count(post_uid) as comment_count from comments group by post_uid) t5 on t5.post_uid = posts.uid
  where posts.uid = arg_post_uid;
end;
$$;

ALTER FUNCTION "public"."get_post"("arg_from_uid" "uuid", "arg_post_uid" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_test_comments"("arg_from_uid" "uuid") RETURNS TABLE("rtn_id" bigint, "rtn_from_uid" "uuid", "rtn_created_at" timestamp with time zone)
    LANGUAGE "plpgsql"
    AS $$
begin
  return query
  select id as rtn_id, from_uid as rtn_from_uid, created_at as rtn_created_at from comments order by from_uid=arg_from_uid desc, created_at asc;
end;
$$;

ALTER FUNCTION "public"."get_test_comments"("arg_from_uid" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_user_profile"("arg_username" "text", "arg_from_uid" "uuid") RETURNS TABLE("ret_username" "text", "ret_name" "text", "ret_profile_image" "uuid", "ret_uid" "uuid", "ret_follower_count" bigint, "ret_followee_count" bigint, "ret_post_count" bigint, "ret_has_followed" boolean)
    LANGUAGE "plpgsql"
    AS $$
begin
  return query
  select 
  profiles.username as ret_username, 
  profiles.name as ret_name, 
  profiles.image_filename as ret_profile_image, 
  profiles.uid as ret_uid,
  coalesce(t1.count, 0) as ret_follower_count,
  coalesce(t3.count, 0) as ret_followee_count,
  coalesce(t2.count, 0) as ret_post_count, 
  t4.followee_uid is not null as ret_has_followed 
  from profiles 
  left join 
  (select followee_uid, count(*) from friends group by followee_uid) t1 on profiles.uid = followee_uid
  left join
  (select follower_uid, count(*) from friends group by follower_uid) t3 on profiles.uid = follower_uid
  left join 
  (select from_uid, count(*) from posts group by from_uid) t2 on profiles.uid = t2.from_uid 
  left join 
  (select followee_uid from friends where follower_uid = arg_from_uid) t4 on t4.followee_uid = profiles.uid where profiles.username = arg_username;
end;
$$;

ALTER FUNCTION "public"."get_user_profile"("arg_username" "text", "arg_from_uid" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  insert into public."profiles" (uid, username, name)
  values (new.id, new.raw_user_meta_data ->> 'username', new.raw_user_meta_data ->> 'name');
  return new;
end;
$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_sign_up"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  insert into public."Profiles" (user_id, username)
  values (new.id, new.raw_user_meta_data ->> 'username');
  return new;
end;
$$;

ALTER FUNCTION "public"."handle_sign_up"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."search_followees"("arg_uid" "uuid", "arg_query" "text", "arg_offset" integer, "arg_limit" integer) RETURNS TABLE("ret_uid" "uuid", "ret_username" "text", "ret_name" "text", "ret_profile_image" "uuid", "ret_has_followed" boolean)
    LANGUAGE "plpgsql"
    AS $$
begin
  return query
  select 
  uid as ret_uid, 
  username as ret_username, 
  name as ret_name, 
  image_filename as ret_profile_image, 
  uid is not null as ret_has_followed
  from profiles
  inner join 
  friends on followee_uid = profiles.uid 
  where follower_uid = arg_uid and profiles.search_params @@ to_tsquery(arg_query || ':*') limit arg_limit offset arg_offset;
end;
$$;

ALTER FUNCTION "public"."search_followees"("arg_uid" "uuid", "arg_query" "text", "arg_offset" integer, "arg_limit" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."search_followers"("arg_uid" "uuid", "arg_query" "text", "arg_offset" integer, "arg_limit" integer) RETURNS TABLE("ret_uid" "uuid", "ret_username" "text", "ret_name" "text", "ret_profile_image" "uuid", "ret_has_followed" boolean)
    LANGUAGE "plpgsql"
    AS $$
begin
  return query
  select 
  uid as ret_uid, 
  username as ret_username, 
  name as ret_name, 
  image_filename as ret_profile_image,
  f2.followee_uid is not null as ret_has_followed
  from profiles
  left join 
  friends on follower_uid = profiles.uid
  left join
  friends f2 on f2.follower_uid = friends.followee_uid and f2.followee_uid = friends.follower_uid
  where friends.followee_uid = arg_uid and profiles.search_params @@ to_tsquery(arg_query || ':*') limit arg_limit offset arg_offset;
end;
$$;

ALTER FUNCTION "public"."search_followers"("arg_uid" "uuid", "arg_query" "text", "arg_offset" integer, "arg_limit" integer) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."images" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "filename" "uuid" NOT NULL,
    "post_uid" "uuid"
);

ALTER TABLE "public"."images" OWNER TO "postgres";

ALTER TABLE "public"."images" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Images_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."posts" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "description" "text",
    "uid" "uuid" NOT NULL,
    "from_uid" "uuid" DEFAULT "auth"."uid"() NOT NULL
);

ALTER TABLE "public"."posts" OWNER TO "postgres";

ALTER TABLE "public"."posts" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Post_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "uid" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "username" "text" NOT NULL,
    "name" "text" NOT NULL,
    "image_filename" "uuid",
    "search_params" "tsvector"
);

ALTER TABLE "public"."profiles" OWNER TO "postgres";

COMMENT ON TABLE "public"."profiles" IS 'user profiles that contain user meta data which include username, profile image etc. ';

COMMENT ON COLUMN "public"."profiles"."name" IS 'display name of an user';

ALTER TABLE "public"."profiles" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Users_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."comment_likes" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "liked_by" "uuid" NOT NULL,
    "comment_uid" "uuid" NOT NULL
);

ALTER TABLE "public"."comment_likes" OWNER TO "postgres";

ALTER TABLE "public"."comment_likes" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."comment_likes_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."comments" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "from_uid" "uuid" NOT NULL,
    "post_uid" "uuid" NOT NULL,
    "comment" "text" NOT NULL,
    "uid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);

ALTER TABLE "public"."comments" OWNER TO "postgres";

ALTER TABLE "public"."comments" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."comments_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."friends" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "followee_uid" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "follower_uid" "uuid" NOT NULL
);

ALTER TABLE "public"."friends" OWNER TO "postgres";

ALTER TABLE "public"."friends" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."followers_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."likes" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "post_uid" "uuid" NOT NULL,
    "from_uid" "uuid" DEFAULT "auth"."uid"() NOT NULL
);

ALTER TABLE "public"."likes" OWNER TO "postgres";

COMMENT ON TABLE "public"."likes" IS 'user likes posts';

ALTER TABLE "public"."likes" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."likes_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE ONLY "public"."images"
    ADD CONSTRAINT "Images_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "Post_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "Posts_post_id_key" UNIQUE ("uid");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "Profiles_user_id_key" UNIQUE ("uid");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "Profiles_username_key" UNIQUE ("username");

ALTER TABLE ONLY "public"."comment_likes"
    ADD CONSTRAINT "comment_likes_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_uid_key" UNIQUE ("uid");

ALTER TABLE ONLY "public"."friends"
    ADD CONSTRAINT "friends_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."likes"
    ADD CONSTRAINT "likes_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_image_filename_key" UNIQUE ("image_filename");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");

CREATE UNIQUE INDEX "commentlikeship" ON "public"."comment_likes" USING "btree" ("comment_uid", "liked_by");

CREATE INDEX "comments_post_uid_idx" ON "public"."comments" USING "btree" ("post_uid");

CREATE INDEX "friends_created_at_idx" ON "public"."friends" USING "btree" ("created_at");

CREATE INDEX "friends_followee_uid_idx" ON "public"."friends" USING "btree" ("followee_uid");

CREATE INDEX "friends_follower_uid_idx" ON "public"."friends" USING "btree" ("follower_uid");

CREATE UNIQUE INDEX "friendship" ON "public"."friends" USING "btree" ("followee_uid", "follower_uid");

CREATE UNIQUE INDEX "likeship" ON "public"."likes" USING "btree" ("from_uid", "post_uid");

CREATE INDEX "profiles_name_idx" ON "public"."profiles" USING "btree" ("name");

CREATE INDEX "profiles_username_idx" ON "public"."profiles" USING "btree" ("username");

CREATE INDEX "search_params" ON "public"."profiles" USING "gin" ("search_params");

ALTER TABLE ONLY "public"."comment_likes"
    ADD CONSTRAINT "comment_likes_comment_uid_fkey" FOREIGN KEY ("comment_uid") REFERENCES "public"."comments"("uid") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."comment_likes"
    ADD CONSTRAINT "comment_likes_liked_by_fkey" FOREIGN KEY ("liked_by") REFERENCES "public"."profiles"("uid") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."friends"
    ADD CONSTRAINT "friends_followee_uid_fkey" FOREIGN KEY ("followee_uid") REFERENCES "public"."profiles"("uid") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."friends"
    ADD CONSTRAINT "friends_follower_uid_fkey" FOREIGN KEY ("follower_uid") REFERENCES "public"."profiles"("uid") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "public_comments_from_uid_fkey" FOREIGN KEY ("from_uid") REFERENCES "public"."profiles"("uid") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "public_comments_post_id_fkey" FOREIGN KEY ("post_uid") REFERENCES "public"."posts"("uid") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."images"
    ADD CONSTRAINT "public_images_post_id_fkey" FOREIGN KEY ("post_uid") REFERENCES "public"."posts"("uid") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."likes"
    ADD CONSTRAINT "public_likes_from_uid_fkey" FOREIGN KEY ("from_uid") REFERENCES "public"."profiles"("uid") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."likes"
    ADD CONSTRAINT "public_likes_post_id_fkey" FOREIGN KEY ("post_uid") REFERENCES "public"."posts"("uid") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "public_posts_from_uid_fkey" FOREIGN KEY ("from_uid") REFERENCES "public"."profiles"("uid") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "public_profiles_user_id_fkey" FOREIGN KEY ("uid") REFERENCES "auth"."users"("id");

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."get_paginated_comments"("arg_post_uid" "uuid", "arg_from_uid" "uuid", "arg_from" integer, "arg_limit" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_paginated_comments"("arg_post_uid" "uuid", "arg_from_uid" "uuid", "arg_from" integer, "arg_limit" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_paginated_comments"("arg_post_uid" "uuid", "arg_from_uid" "uuid", "arg_from" integer, "arg_limit" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_paginated_explore_posts"("arg_from_uid" "uuid", "arg_from" integer, "arg_limit" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_paginated_explore_posts"("arg_from_uid" "uuid", "arg_from" integer, "arg_limit" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_paginated_explore_posts"("arg_from_uid" "uuid", "arg_from" integer, "arg_limit" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_paginated_followee_posts"("arg_from_uid" "uuid", "arg_from" integer, "arg_limit" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_paginated_followee_posts"("arg_from_uid" "uuid", "arg_from" integer, "arg_limit" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_paginated_followee_posts"("arg_from_uid" "uuid", "arg_from" integer, "arg_limit" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_paginated_user_followees"("arg_from_uid" "uuid", "arg_uid" "uuid", "arg_from" integer, "arg_limit" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_paginated_user_followees"("arg_from_uid" "uuid", "arg_uid" "uuid", "arg_from" integer, "arg_limit" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_paginated_user_followees"("arg_from_uid" "uuid", "arg_uid" "uuid", "arg_from" integer, "arg_limit" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_paginated_user_followers"("arg_from_uid" "uuid", "arg_uid" "uuid", "arg_from" integer, "arg_limit" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_paginated_user_followers"("arg_from_uid" "uuid", "arg_uid" "uuid", "arg_from" integer, "arg_limit" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_paginated_user_followers"("arg_from_uid" "uuid", "arg_uid" "uuid", "arg_from" integer, "arg_limit" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_paginated_user_posts"("arg_uid" "uuid", "arg_from_uid" "uuid", "arg_from" integer, "arg_limit" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_paginated_user_posts"("arg_uid" "uuid", "arg_from_uid" "uuid", "arg_from" integer, "arg_limit" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_paginated_user_posts"("arg_uid" "uuid", "arg_from_uid" "uuid", "arg_from" integer, "arg_limit" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_post"("arg_from_uid" "uuid", "arg_post_uid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_post"("arg_from_uid" "uuid", "arg_post_uid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_post"("arg_from_uid" "uuid", "arg_post_uid" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_test_comments"("arg_from_uid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_test_comments"("arg_from_uid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_test_comments"("arg_from_uid" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_user_profile"("arg_username" "text", "arg_from_uid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_profile"("arg_username" "text", "arg_from_uid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_profile"("arg_username" "text", "arg_from_uid" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_sign_up"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_sign_up"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_sign_up"() TO "service_role";

GRANT ALL ON FUNCTION "public"."search_followees"("arg_uid" "uuid", "arg_query" "text", "arg_offset" integer, "arg_limit" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."search_followees"("arg_uid" "uuid", "arg_query" "text", "arg_offset" integer, "arg_limit" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_followees"("arg_uid" "uuid", "arg_query" "text", "arg_offset" integer, "arg_limit" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."search_followers"("arg_uid" "uuid", "arg_query" "text", "arg_offset" integer, "arg_limit" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."search_followers"("arg_uid" "uuid", "arg_query" "text", "arg_offset" integer, "arg_limit" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_followers"("arg_uid" "uuid", "arg_query" "text", "arg_offset" integer, "arg_limit" integer) TO "service_role";

GRANT ALL ON TABLE "public"."images" TO "anon";
GRANT ALL ON TABLE "public"."images" TO "authenticated";
GRANT ALL ON TABLE "public"."images" TO "service_role";

GRANT ALL ON SEQUENCE "public"."Images_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Images_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Images_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."posts" TO "anon";
GRANT ALL ON TABLE "public"."posts" TO "authenticated";
GRANT ALL ON TABLE "public"."posts" TO "service_role";

GRANT ALL ON SEQUENCE "public"."Post_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Post_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Post_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";

GRANT ALL ON SEQUENCE "public"."Users_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Users_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Users_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."comment_likes" TO "anon";
GRANT ALL ON TABLE "public"."comment_likes" TO "authenticated";
GRANT ALL ON TABLE "public"."comment_likes" TO "service_role";

GRANT ALL ON SEQUENCE "public"."comment_likes_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."comment_likes_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."comment_likes_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."comments" TO "anon";
GRANT ALL ON TABLE "public"."comments" TO "authenticated";
GRANT ALL ON TABLE "public"."comments" TO "service_role";

GRANT ALL ON SEQUENCE "public"."comments_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."comments_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."comments_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."friends" TO "anon";
GRANT ALL ON TABLE "public"."friends" TO "authenticated";
GRANT ALL ON TABLE "public"."friends" TO "service_role";

GRANT ALL ON SEQUENCE "public"."followers_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."followers_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."followers_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."likes" TO "anon";
GRANT ALL ON TABLE "public"."likes" TO "authenticated";
GRANT ALL ON TABLE "public"."likes" TO "service_role";

GRANT ALL ON SEQUENCE "public"."likes_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."likes_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."likes_id_seq" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
