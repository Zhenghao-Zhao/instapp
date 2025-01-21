drop function if exists search_post;

create or replace function search_post (arg_query text, arg_from_uid uuid, arg_from int, arg_limit int) returns table (
  ret_post_uid uuid,
  ret_created_at timestamptz,
  ret_description text,
  ret_comment_count bigint, 
  ret_owner_username text,
  ret_owner_name text,
  ret_owner_uid uuid,
  ret_owner_profile_image uuid,
  ret_follows_owner boolean,
  ret_like_count bigint,
  ret_has_liked boolean,
  ret_post_images uuid[]
)
language plpgsql
as
$$
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
where posts.search_params @@ to_tsquery(arg_query || ':*') order by posts.created_at desc limit arg_limit offset arg_from;
end;
$$;
