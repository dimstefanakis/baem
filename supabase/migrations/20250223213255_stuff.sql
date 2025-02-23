create policy "Only admins can delete categories"
on "public"."categories"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));


create policy "Only admins can insert categories"
on "public"."categories"
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));


create policy "Only admins can update categories"
on "public"."categories"
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));



