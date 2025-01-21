alter table posts
  add column search_params tsvector;
update posts
set search_params = to_tsvector(description);
create index posts_search_params on posts using gin(search_params);
