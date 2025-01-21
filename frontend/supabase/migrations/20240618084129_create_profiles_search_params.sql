alter table profiles
  add column if not exists search_params tsvector;
update profiles
set search_params = to_tsvector(username || ' ' || name);
create index profiles_search_params on profiles using gin(search_params);
