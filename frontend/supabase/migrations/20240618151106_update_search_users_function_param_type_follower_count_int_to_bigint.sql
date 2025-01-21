drop function if exists search_users;

create or replace function search_users (arg_query text, arg_offset int, arg_limit int) returns table (
  ret_uid uuid,
  ret_username text,
  ret_name text,
  ret_profile_image uuid,
  ret_follower_count bigint
) 
language plpgsql 
as
$$
begin
  return query
  select 
  uid as ret_uid, 
  username as ret_username, 
  name as ret_name, 
  image_filename as ret_profile_image,
  t.follower_count as ret_follower_count
  from profiles
  left join (select count(*) as follower_count, followee_uid from friends group by friends.followee_uid) t on t.followee_uid = profiles.uid
  where profiles.search_params @@ to_tsquery(arg_query || ':*') limit arg_limit offset arg_offset;
end;
$$;
