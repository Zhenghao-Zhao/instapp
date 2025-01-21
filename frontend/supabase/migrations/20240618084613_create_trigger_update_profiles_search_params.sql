CREATE TRIGGER profiles_tsvectorupdate BEFORE INSERT OR UPDATE
ON public.profiles FOR EACH ROW EXECUTE FUNCTION
tsvector_update_trigger(search_params, 'pg_catalog.english', username, name);
