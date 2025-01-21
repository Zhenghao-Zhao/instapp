drop trigger if exists "posts_tsvectorupdate" on "public"."posts";

drop function if exists "public"."handle_new_user"();

drop function if exists "public"."handle_sign_up"();

CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION tsvector_update_trigger('search_params', 'pg_catalog.english', 'description');


