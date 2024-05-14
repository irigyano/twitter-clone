grant delete on table "storage"."s3_multipart_uploads" to "postgres";

grant insert on table "storage"."s3_multipart_uploads" to "postgres";

grant references on table "storage"."s3_multipart_uploads" to "postgres";

grant select on table "storage"."s3_multipart_uploads" to "postgres";

grant trigger on table "storage"."s3_multipart_uploads" to "postgres";

grant truncate on table "storage"."s3_multipart_uploads" to "postgres";

grant update on table "storage"."s3_multipart_uploads" to "postgres";

grant delete on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant insert on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant references on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant select on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant trigger on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant truncate on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant update on table "storage"."s3_multipart_uploads_parts" to "postgres";

create policy "CRUD covers a0ed7c_0"
on "storage"."objects"
as permissive
for insert
to authenticated
with check ((bucket_id = 'background-cover'::text));


create policy "CRUD covers a0ed7c_1"
on "storage"."objects"
as permissive
for select
to authenticated
using ((bucket_id = 'background-cover'::text));


create policy "CRUD covers a0ed7c_2"
on "storage"."objects"
as permissive
for update
to authenticated
using ((bucket_id = 'background-cover'::text));


create policy "CRUD covers a0ed7c_3"
on "storage"."objects"
as permissive
for delete
to authenticated
using ((bucket_id = 'background-cover'::text));


create policy "crud avatar 1bs1gex_0"
on "storage"."objects"
as permissive
for select
to authenticated
using ((bucket_id = 'avatar'::text));


create policy "crud avatar 1bs1gex_1"
on "storage"."objects"
as permissive
for insert
to authenticated
with check ((bucket_id = 'avatar'::text));


create policy "crud avatar 1bs1gex_2"
on "storage"."objects"
as permissive
for update
to authenticated
using ((bucket_id = 'avatar'::text));


create policy "crud avatar 1bs1gex_3"
on "storage"."objects"
as permissive
for delete
to authenticated
using ((bucket_id = 'avatar'::text));


create policy "crud post image 21vog_0"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'post'::text));


create policy "crud post image 21vog_1"
on "storage"."objects"
as permissive
for insert
to public
with check ((bucket_id = 'post'::text));


create policy "crud post image 21vog_2"
on "storage"."objects"
as permissive
for update
to public
using ((bucket_id = 'post'::text));


create policy "crud post image 21vog_3"
on "storage"."objects"
as permissive
for delete
to public
using ((bucket_id = 'post'::text));



