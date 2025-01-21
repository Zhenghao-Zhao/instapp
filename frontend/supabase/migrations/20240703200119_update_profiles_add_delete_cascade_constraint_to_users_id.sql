alter table profiles drop constraint public_profiles_user_id_fkey;

alter table profiles add constraint public_profiles_user_id_fkey foreign key (uid) references auth.users (id) on delete cascade;
