CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
ON public.posts FOR EACH ROW EXECUTE FUNCTION
tsvector_update_trigger(search_params, 'pg_catalog.english', description);
