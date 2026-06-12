create type subscription_status as ENUM (
  'active',
  'trialing',
  'past_due',
  'canceled',
  'unpaid',
  'incomplete',
  'incomplete_expired',
  'paused'
);

create table users (
  id uuid references auth.users not null primary key,
  photo_url text,
  display_name text,
  onboarded bool not null,
  created_at timestamptz not null default now()
);

create table subscriptions (
  id text not null primary key,
  price_id text not null,
  status subscription_status not null,
  cancel_at_period_end bool not null,
  currency text,
  interval text,
  interval_count int,
  created_at timestamptz,
  period_starts_at timestamptz,
  period_ends_at timestamptz,
  trial_starts_at timestamptz,
  trial_ends_at timestamptz
);

create table organizations (
  id bigint generated always as identity primary key,
  name text not null,
  logo_url text,
  created_at timestamptz not null default now()
);

create table organizations_subscriptions (
  organization_id bigint not null references public.organizations (id) on delete cascade,
  subscription_id text unique references public.subscriptions (id) on delete set null,
  customer_id text not null unique,
  primary key (organization_id)
);

create table memberships (
  id bigint generated always as identity primary key,
  user_id uuid references public.users,
  organization_id bigint not null references public.organizations,
  role int not null,
  invited_email text,
  code text,
  created_at timestamptz not null default now(),
  unique (user_id, organization_id)
);

insert into storage.buckets (id, name, PUBLIC)
  values ('logos', 'logos', true);

insert into storage.buckets (id, name, PUBLIC)
  values ('avatars', 'avatars', true);

alter table organizations enable row level security;

alter table users enable row level security;

alter table memberships enable row level security;

alter table subscriptions enable row level security;

alter table organizations_subscriptions enable row level security;

create or replace function create_new_organization (org_name text, user_id uuid, create_user bool default true)
  returns bigint
  language PLPGSQL
  security definer
  as $$
declare
  organization bigint;
begin
  insert into organizations ("name")
    values (org_name)
  returning
    id into organization;
  if create_user then
    insert into users (id, onboarded)
      values (user_id, true);
  end if;
  insert into memberships (user_id, organization_id, role)
    values (user_id, organization, 2);
  return organization;
end;
$$;

create or replace function accept_invite_to_organization (invite_code text, invite_user_id uuid)
  returns json
  language PLPGSQL
  security definer
  as $$
declare
  organization bigint;
  membership bigint;
begin
  if not exists(select 1 from users where id = invite_user_id) then
    insert into users (id, onboarded)
      values (invite_user_id, true);
  end if;

  update
    memberships
  set
    user_id = invite_user_id,
    code = null,
    invited_email = null
  where
    code = invite_code
  returning
    id,
    organization_id into membership,
    organization;
  return json_build_object('organization', organization, 'membership', membership);
end;
$$;

create or replace function get_organizations_for_authenticated_user ()
  returns setof bigint
  language SQL
  security definer
  set search_path = PUBLIC stable
  as $$
  select
    organization_id
  from
    memberships
  where
    user_id = auth.uid ()
$$;

create or replace function get_role_for_authenticated_user (org_id bigint)
  returns int
  language PLPGSQL
  as $$
declare
  current_user_role int;
begin
  select
    role
  from
    memberships
  where
    user_id = auth.uid ()
    and memberships.organization_id = org_id into current_user_role;
  return current_user_role;
end;
$$;

create or replace function get_role_for_user (membership_id bigint)
  returns int
  language PLPGSQL
  as $$
declare
  current_user_role int;
begin
  select
    role
  from
    memberships
  where
    id = membership_id
  limit 1 into current_user_role;
  return current_user_role;
end;
$$;

create or replace function current_user_is_member_of_organization (organization_id bigint)
  returns bool
  language PLPGSQL
  as $$
begin
  return (organization_id in (
      select
        get_organizations_for_authenticated_user ()));
end;
$$;

create or replace function can_update_user_role (organization_id bigint, membership_id bigint)
  returns bool
  language PLPGSQL
  as $$
declare
  current_user_role int;
begin
  select
    get_role_for_authenticated_user (organization_id) into current_user_role;
  return current_user_role > get_role_for_user (membership_id);
end;
$$;

create or replace function transfer_organization (org_id bigint, target_user_membership_id bigint)
  returns void
  security definer
  language PLPGSQL
  as $$
declare
  current_user_role int;
  current_user_membership_id int;
begin
  select id, role from memberships where user_id = auth.uid() into current_user_membership_id, current_user_role;

  if current_user_role != 2 then
    raise exception 'Only owners can transfer organizations';
  end if;

  if current_user_membership_id = target_user_membership_id then
    raise exception 'Cannot transfer organization to yourself';
  end if;

  update
    memberships
  set
    role = 2
  where
    id = target_user_membership_id;
  update
    memberships
  set
    role = 1
  where
    user_id = auth.uid ()
    and organization_id = org_id;
end;
$$;

create policy "Users can update data to only their records" on users
  for update
    using (auth.uid () = users.id)
    with check (auth.uid () = users.id);

create policy "Users can read the public data of users belonging to the same
  organization" on users
  for select
    using (exists (
      select
        1
      from
        memberships
      where
        organization_id in (
          select
            get_organizations_for_authenticated_user ())));

create policy "Organizations can only be selectable by the members of the
  organization" on organizations
  for select
    using (id in (
      select
        organization_id
      from
        memberships
      where
        auth.uid () = memberships.user_id));

create policy "Organizations can only be updated by the members of the
  organization" on organizations
  for update
    using (id in (
      select
        organization_id
      from
        memberships
      where
        auth.uid () = memberships.user_id))
      with check (id in (
        select
          organization_id
        from
          memberships
        where
          auth.uid () = memberships.user_id));

create policy "Memberships can only be read by members that belong to the
  organization" on memberships
  for select
    using (current_user_is_member_of_organization (organization_id));

create policy "Pending memberships can be read by members assigned to one" on memberships
  for select
    using (
        auth.email() = memberships.invited_email
        and memberships.code is not null
    );

create policy "Organizations can be read by invited members to that organization" on organizations
  for select
    using (
        exists (
            select 1 from memberships
            where organizations.id = memberships.organization_id
            and memberships.invited_email = auth.email()
            and memberships.code is not null
        )
    );

create policy "Memberships can be created by members that belong to the
  organization" on memberships
  for insert
    with check (current_user_is_member_of_organization (organization_id));

create policy "Memberships can only be updated if the user's role who updates
  the role is greater" on memberships
  for update
    using (can_update_user_role (organization_id, id));

create policy "Memberships can only be deleted if the user's role who updates
  the role is greater" on memberships
  for delete
    using (can_update_user_role (organization_id, id));

create policy "Subscriptions can only be selectable by members that belong to
  the organization" on subscriptions
  for select
    using (exists (
      select
        1
      from
        memberships
        join organizations_subscriptions on organizations_subscriptions.organization_id = memberships.organization_id
      where
        memberships.organization_id = organizations_subscriptions.organization_id and subscriptions.id = organizations_subscriptions.subscription_id and memberships.user_id = auth.uid ()));

create policy "Users can read subscriptions if they belong to the organization" on organizations_subscriptions
  for select
    using (exists (
      select
        1
      from
        memberships
      where
        user_id = auth.uid () and organization_id = memberships.organization_id));

create policy "Logos can be read and written by users that belong to the
  organization" on storage.objects
  for all
    using (bucket_id = 'logos'
      and (replace(storage.filename (name), concat('.', storage.extension (name)), '')::int) in (
        select
          get_organizations_for_authenticated_user ()))
        with check (bucket_id = 'logos'
        and (replace(storage.filename (name), concat('.', storage.extension (name)), '')::int) in (
          select
            get_organizations_for_authenticated_user ()));

create policy "Avatars can be read and written only by the user that owns the
  avatar" on storage.objects
  for all
    using (bucket_id = 'avatars'
      and (replace(storage.filename (name), concat('.', storage.extension (name)), '')::uuid) = auth.uid ())
      with check (bucket_id = 'avatars'
      and (replace(storage.filename (name), concat('.', storage.extension (name)), '')::uuid) = auth.uid ());


alter table "public"."organizations" add column "uuid" uuid not null default gen_random_uuid();

CREATE UNIQUE INDEX organizations_uuid_key ON public.organizations USING btree (uuid);

alter table "public"."organizations" add constraint "organizations_uuid_key" UNIQUE using index "organizations_uuid_key";

DROP FUNCTION public.create_new_organization;

CREATE OR REPLACE FUNCTION public.create_new_organization(org_name text, user_id uuid, create_user boolean DEFAULT true)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  organization bigint;
  uid uuid;
begin
  insert into organizations ("name")
    values (org_name)
  returning
    id, uuid into organization, uid;
  if create_user then
    insert into users (id, onboarded)
      values (user_id, true);
  end if;
  insert into memberships (user_id, organization_id, role)
    values (user_id, organization, 2);
  return uid;
end;
$function$
;

drop policy "Memberships can be created by members that belong to the
  orga" on "public"."memberships";


create policy "Users can select data to their records" on users
  for select
    using (auth.uid () = users.id);

alter table memberships
drop constraint if exists memberships_organization_id_fkey,
add constraint memberships_organization_id_fkey
foreign key (organization_id)
references public.organizations
on delete cascade;

alter table memberships
drop constraint if exists memberships_user_id_fkey,
add constraint memberships_user_id_fkey
foreign key (user_id)
references public.users
on delete cascade;

alter table users
drop constraint if exists users_id_fkey,
add constraint users_id_fkey
foreign key (id)
references auth.users
on delete cascade;

create or replace function assert_service_role()
  returns void
  as $$
begin
  if current_setting('role') != 'authenticated' and
    current_setting('role') != 'service_role' then
    raise exception 'authentication required';
  end if;
end;
$$
language plpgsql;

create or replace function get_organizations_for_authenticated_user()
  returns setof bigint
  as $$
begin
  return query
  select
    organization_id
  from
    memberships
  where
    user_id = auth.uid()
    and code is null;
end;
$$
language plpgsql
security definer set search_path = public;

create or replace function accept_invite_to_organization(invite_code text,
  invite_user_id uuid)
  returns json
  language PLPGSQL
  security definer
  set search_path = public
  as $$
declare
  organization bigint;
  membership bigint;
  target_role int;
begin
  perform
    assert_service_role();

  if not exists (
    select
      1
    from
      users
    where
      id = invite_user_id) then
  insert into users(
    id,
    onboarded)
  values (
    invite_user_id,
    true);
end if;

  select
    "role"
  from
    memberships
  where
    code = invite_code into target_role;

  if target_role is null then
    raise exception 'Invite code not found';
  end if;

  if target_role = 2 then
    raise exception 'Owner cannot be invited';
  end if;

  update
    memberships
  set
    user_id = invite_user_id,
    code = null,
    invited_email = null
  where
    code = invite_code
  returning
    id,
    organization_id into membership,
    organization;
  return json_build_object('organization', organization, 'membership', membership);
end;
$$;

create or replace function transfer_organization(org_id bigint,
  target_user_membership_id bigint)
  returns void
  security definer
  set search_path = public
  language PLPGSQL
  as $$
declare
  current_user_role int;
  current_user_membership_id int;
begin
  perform
    assert_service_role();

  select
    id,
    role
  from
    memberships
  where
    user_id = auth.uid() into current_user_membership_id,
    current_user_role;

  if current_user_role != 2 then
    raise exception 'Only owners can transfer organizations';
  end if;

  if current_user_membership_id = target_user_membership_id then
    raise exception 'Cannot transfer organization to yourself';
  end if;

  update
    memberships
  set
    role = 2
  where
    id = target_user_membership_id;
  update
    memberships
  set
    role = 1
  where
    user_id = auth.uid()
    and organization_id = org_id;
end;
$$;

create or replace function create_new_organization(org_name text, user_id uuid,
  create_user boolean default true)
  returns uuid
  language plpgsql
  security definer
  set search_path = public
  as $function$
declare
  organization bigint;
  uid uuid;
begin
  perform
    assert_service_role();

  insert into organizations(
    "name")
  values (
    org_name)
returning
  id,
  uuid into organization,
  uid;
  if create_user then
    insert into users(
      id,
      onboarded)
    values (
      user_id,
      true);
  end if;
  insert into memberships(
    user_id,
    organization_id,
    role)
  values (
    user_id,
    organization,
    2);
  return uid;
end;
$function$;

create or replace function can_update_user_role(membership_id bigint)
  returns bool
  language PLPGSQL
  as $$
declare
  current_user_role int;
  org_id bigint;
begin
  select
    organization_id
  from
    memberships
  where
    id = membership_id into org_id;

  select
    get_role_for_authenticated_user(org_id) into current_user_role;

  return current_user_role > get_role_for_user(membership_id);
end;
$$;

drop policy "Memberships can only be deleted if the user's role who updates
" on "public"."memberships";

drop policy "Memberships can only be read by members that belong to the
  or" on "public"."memberships";

drop policy "Memberships can only be updated if the user's role who updates
" on "public"."memberships";

drop policy "Pending memberships can be read by members assigned to one" on
  "public"."memberships";

drop policy "Organizations can be read by invited members to that organizati"
  on "public"."organizations";

drop policy "Organizations can only be selectable by the members of the
  or" on "public"."organizations";

drop policy "Organizations can only be updated by the members of the
  organ" on "public"."organizations";

drop policy "Users can read subscriptions if they belong to the organization"
  on "public"."organizations_subscriptions";

drop policy "Users can read the public data of users belonging to the same
 " on "public"."users";

drop policy "Users can select data to their records" on "public"."users";

drop policy "Users can update data to only their records" on "public"."users";

create policy "Memberships can only be deleted if the user's role who updates
" on "public"."memberships" as permissive
  for delete to authenticated
    using (can_update_user_role(organization_id, id));

create policy "Memberships can only be read by Org members" on
  "public"."memberships" as permissive
  for select to authenticated
    using (current_user_is_member_of_organization(organization_id));

create policy "Organizations can only be selectable by Org members" on
  "public"."organizations" as permissive
  for select to authenticated
    using (current_user_is_member_of_organization(id));

create policy "Organizations can only be updated by the members of the
  organization" on "public"."organizations" as permissive
  for update to authenticated
    using (current_user_is_member_of_organization(id))
    with check (current_user_is_member_of_organization(id));

create policy "Users can read subscriptions if they belong to the organization"
  on "public"."organizations_subscriptions" as permissive
  for select to authenticated
    using ((exists (
      select
        1
      from
        memberships
      where ((memberships.user_id = auth.uid()) and
	(memberships.organization_id = memberships.organization_id)))));

create policy "Users can read the public data of users belonging to the same"
  on "public"."users" as permissive
  for select to authenticated
    using ((exists (
      select
        1
      from
        memberships
      where (memberships.organization_id in (
        select
	  get_organizations_for_authenticated_user() as
	    get_organizations_for_authenticated_user)))));

create policy "Users can select data to their records" on "public"."users" as permissive
  for select to authenticated
    using ((auth.uid() = id));

create policy "Users can update data to only their records" on "public"."users"
  as permissive
  for update to authenticated
    using ((auth.uid() = id))
    with check ((auth.uid() = id));

alter table "public"."organizations"
  add constraint "organizations_name_check" check ((length(name) < 50)) not valid;

alter table "public"."organizations" validate constraint "organizations_name_check";

alter table "public"."users"
  add constraint "users_display_name_check" check ((length(display_name) <
    100)) not valid;

alter table "public"."users" validate constraint "users_display_name_check";


drop policy "Users can read subscriptions if they belong to the organization"  on "public"."organizations_subscriptions";

create policy "Users can read subscriptions if they belong to the organization"
on "public"."organizations_subscriptions"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM memberships
  WHERE ((memberships.user_id = auth.uid()) AND (organizations_subscriptions.organization_id = memberships.organization_id)))));

create or replace function transfer_organization (org_id bigint, target_user_membership_id bigint)
  returns void
  security definer
  set search_path = public
  language PLPGSQL
  as $$
declare
  current_user_role int;
  current_user_membership_id int;
begin
  perform assert_service_role();

  select id, role from memberships
  where user_id = auth.uid() and
  organization_id = org_id
  into current_user_membership_id, current_user_role;

  if current_user_membership_id is null then
    raise exception 'User is not a member of the organization';
  end if;

  if current_user_role is null then
    raise exception 'User is not a member of the organization';
  end if;

  if current_user_role != 2 then
    raise exception 'Only owners can transfer organizations';
  end if;

  if current_user_membership_id = target_user_membership_id then
    raise exception 'Cannot transfer organization to yourself';
  end if;

  update
    memberships
  set
    role = 2
  where
    id = target_user_membership_id
    and organization_id = org_id;
  update
    memberships
  set
    role = 1
  where
    user_id = auth.uid ()
    and organization_id = org_id
    and id = current_user_membership_id;
end;
$$;

-- force checking user is service role key
create or replace function assert_service_role()
  returns void
  as $$
begin
  if current_setting('role') != 'service_role' then
    raise exception 'authentication required';
  end if;
end;
$$
language plpgsql;

drop function create_new_organization;

create or replace function create_new_organization(org_name text, create_user
  boolean default true)
  returns uuid
  language plpgsql
  security definer
  set search_path = public
  as $function$
declare
  organization bigint;
  uid uuid;
begin
  insert into organizations(
    "name")
  values (
    org_name)
returning
  id,
  uuid into organization,
  uid;

  if create_user then
    insert into users(
      id,
      onboarded)
    values (
      auth.uid(),
      true);
  end if;
  insert into memberships(
    user_id,
    organization_id,
    role)
  values (
    auth.uid(),
    organization,
    2);
  return uid;
end;
$function$;

revoke all on function create_new_organization from public, anon;

drop function accept_invite_to_organization;

create or replace function accept_invite_to_organization(invite_code text,
  invite_user_id uuid)
  returns json
  language PLPGSQL
  security definer
  set search_path = public
  as $$
declare
  organization bigint;
  membership bigint;
  target_role int;
begin
  if not exists (
    select
      1
    from
      users
    where
      id = invite_user_id) then
  insert into users(
    id,
    onboarded)
  values (
    invite_user_id,
    true);
end if;

  select
    "role"
  from
    memberships
  where
    code = invite_code into target_role;

  if target_role is null then
    raise exception 'Invite code not found';
  end if;

  if target_role = 2 then
    raise exception 'Owner cannot be invited';
  end if;

  update
    memberships
  set
    user_id = invite_user_id,
    code = null,
    invited_email = null
  where
    code = invite_code
  returning
    id,
    organization_id into membership,
    organization;
  return json_build_object('organization', organization, 'membership', membership);
end;
$$;

revoke all on function accept_invite_to_organization(text, uuid) from public,
  authenticated;

drop function transfer_organization;

create or replace function transfer_organization(org_id bigint,
  target_user_membership_id bigint)
  returns void
  security definer
  set search_path = public
  language PLPGSQL
  as $$
declare
  current_user_role int;
  current_user_membership_id bigint;
begin
  select
    id,
    role
  from
    memberships
  where (memberships.user_id = auth.uid()
    and memberships.organization_id = org_id) into current_user_membership_id,
  current_user_role;

  if current_user_role != 2 then
    raise exception 'Only owners can transfer organizations';
  end if;

  if current_user_membership_id = target_user_membership_id then
    raise exception 'Cannot transfer organization to yourself';
  end if;

  if not exists (
    select
      1
    from
      memberships
    where
      id = target_user_membership_id
      and organization_id = org_id) then
  raise exception 'Target user is not a member of this organization';
end if;

  update
    memberships
  set
    role = 1
  where
    memberships.id = current_user_membership_id
    and memberships.organization_id = org_id;

  update
    memberships
  set
    role = 2
  where
    memberships.id = target_user_membership_id
    and memberships.organization_id = org_id;
end;
$$;

revoke all on function transfer_organization(bigint, bigint) from public, anon;

create unique index unique_owner on memberships(organization_id, role)
where (role = 2);


alter table "public"."organizations" add constraint "organizations_logo_url_check" CHECK ((length(logo_url) < 500)) not valid;

alter table "public"."organizations" validate constraint "organizations_logo_url_check";

alter table "public"."users" add constraint "users_photo_url_check" CHECK ((length(photo_url) < 500)) not valid;

alter table "public"."users" validate constraint "users_photo_url_check";




drop policy "Users can read the public data of users belonging to the same" on "public"."users";

create policy "Users can read the public data of users belonging to the same"
on "public"."users"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM memberships
  WHERE (users.id = memberships.user_id and memberships.organization_id IN ( SELECT get_organizations_for_authenticated_user() AS get_organizations_for_authenticated_user)))));

revoke all on table "public"."users" from anon;
revoke all on table "public"."organizations" from anon;
revoke all on table "public"."organizations_subscriptions" from anon;
revoke all on table "public"."subscriptions" from anon;
revoke all on table "public"."memberships" from anon;


-- ============================================================
-- Email Signature Builder — Supabase Migration
-- ============================================================
-- Run with: supabase db push
-- Or paste into the Supabase SQL Editor.
-- ============================================================

-- ── Table: email_signatures ──────────────────────────────────

CREATE TABLE IF NOT EXISTS public.email_signatures (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id    uuid        NOT NULL,
  employee_name text        NOT NULL DEFAULT '',
  template_id   text        NOT NULL DEFAULT 'the-opensend',
  fields        jsonb       NOT NULL DEFAULT '{}',
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS email_signatures_account_id_idx
  ON public.email_signatures (account_id);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_email_signatures_updated_at ON public.email_signatures;
CREATE TRIGGER set_email_signatures_updated_at
  BEFORE UPDATE ON public.email_signatures
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.email_signatures ENABLE ROW LEVEL SECURITY;

-- Allow all users during development
-- TODO: Tighten these once accounts_memberships is available
CREATE POLICY "Allow all read"
    ON public.email_signatures
    FOR SELECT
    USING (true);

CREATE POLICY "Allow all insert"
    ON public.email_signatures
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow all update"
    ON public.email_signatures
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all delete"
    ON public.email_signatures
    FOR DELETE
    USING (true);


-- ── Table: public_signature_links ────────────────────────────

CREATE TABLE IF NOT EXISTS public.public_signature_links (
  token       text        PRIMARY KEY,
  html        text        NOT NULL,
  account_id  uuid,
  expires_at  timestamptz NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS public_signature_links_expires_at_idx
  ON public.public_signature_links (expires_at);

ALTER TABLE public.public_signature_links ENABLE ROW LEVEL SECURITY;

-- No public policies for share links.
-- These rows should be accessed only by server-side code using the
-- SUPABASE_SERVICE_ROLE_KEY, not via anon/public Data API.


