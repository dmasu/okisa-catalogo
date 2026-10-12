-- ============================================================
-- OKISA · Esquema de base de datos para Supabase
-- Pegalo completo en: Supabase -> SQL Editor -> New query -> Run
-- Se puede ejecutar más de una vez sin romper nada.
-- ANTES de ejecutarlo, cambiá el email de la última sección
-- por el de la persona que va a administrar el catálogo.
-- ============================================================


-- ---------- 1. Tablas ----------

create table if not exists public.categorias (
  nombre text primary key check (length(trim(nombre)) > 0),
  orden  integer not null default 0
);

create table if not exists public.talles (
  nombre text primary key check (length(trim(nombre)) > 0),
  orden  integer not null default 0
);

create table if not exists public.productos (
  id             bigint generated always as identity primary key,
  nombre         text    not null check (length(trim(nombre)) > 0),
  descripcion    text    not null default '',
  precio         integer not null check (precio >= 0),
  -- Si se renombra una categoría, sus productos se actualizan solos.
  -- Una categoría con productos no se puede borrar.
  categoria      text    not null references public.categorias (nombre)
                         on update cascade on delete restrict,
  talles         text[]  not null default '{}',
  foto           text    not null default '',
  -- [{ "nombre": "Rosa", "hex": "#E0A9A0", "foto": "https://..." }]
  colores        jsonb   not null default '[]'::jsonb
                         check (jsonb_typeof(colores) = 'array'),
  nuevo          boolean not null default false,
  agotado        boolean not null default false,
  visible        boolean not null default true,
  orden          integer not null default 0,
  creado_en      timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create index if not exists productos_visible_orden_idx
  on public.productos (visible, orden, id);

create or replace function public.tocar_actualizado_en()
returns trigger language plpgsql as $$
begin
  new.actualizado_en = now();
  return new;
end;
$$;

drop trigger if exists productos_actualizado on public.productos;
create trigger productos_actualizado
  before update on public.productos
  for each row execute function public.tocar_actualizado_en();


-- ---------- 2. Quién puede administrar ----------
-- Solo los emails de esta tabla pueden crear, editar o borrar.
-- La tabla no es accesible desde la API: se edita solo desde el SQL Editor.

create table if not exists public.admins (
  email text primary key
);
alter table public.admins enable row level security;
-- (sin políticas a propósito: nadie puede leerla desde el navegador)

create or replace function public.es_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins a
    where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.es_admin() from public;
grant execute on function public.es_admin() to anon, authenticated;


-- ---------- 3. Permisos de la API ----------

grant usage on schema public to anon, authenticated;
grant select on public.productos, public.categorias, public.talles to anon, authenticated;
grant insert, update, delete on public.productos, public.categorias, public.talles to authenticated;


-- ---------- 4. Reglas de seguridad (RLS) ----------

alter table public.productos  enable row level security;
alter table public.categorias enable row level security;
alter table public.talles     enable row level security;

-- Productos: cualquiera ve los visibles; solo admins ven los ocultos y escriben.
drop policy if exists "productos_leer"      on public.productos;
drop policy if exists "productos_insertar"  on public.productos;
drop policy if exists "productos_editar"    on public.productos;
drop policy if exists "productos_borrar"    on public.productos;

create policy "productos_leer" on public.productos
  for select to anon, authenticated
  using (visible or public.es_admin());
create policy "productos_insertar" on public.productos
  for insert to authenticated
  with check (public.es_admin());
create policy "productos_editar" on public.productos
  for update to authenticated
  using (public.es_admin()) with check (public.es_admin());
create policy "productos_borrar" on public.productos
  for delete to authenticated
  using (public.es_admin());

-- Categorías
drop policy if exists "categorias_leer"     on public.categorias;
drop policy if exists "categorias_insertar" on public.categorias;
drop policy if exists "categorias_editar"   on public.categorias;
drop policy if exists "categorias_borrar"   on public.categorias;

create policy "categorias_leer" on public.categorias
  for select to anon, authenticated using (true);
create policy "categorias_insertar" on public.categorias
  for insert to authenticated with check (public.es_admin());
create policy "categorias_editar" on public.categorias
  for update to authenticated
  using (public.es_admin()) with check (public.es_admin());
create policy "categorias_borrar" on public.categorias
  for delete to authenticated using (public.es_admin());

-- Talles
drop policy if exists "talles_leer"     on public.talles;
drop policy if exists "talles_insertar" on public.talles;
drop policy if exists "talles_editar"   on public.talles;
drop policy if exists "talles_borrar"   on public.talles;

create policy "talles_leer" on public.talles
  for select to anon, authenticated using (true);
create policy "talles_insertar" on public.talles
  for insert to authenticated with check (public.es_admin());
create policy "talles_editar" on public.talles
  for update to authenticated
  using (public.es_admin()) with check (public.es_admin());
create policy "talles_borrar" on public.talles
  for delete to authenticated using (public.es_admin());


-- ---------- 5. Almacenamiento de fotos ----------
-- Bucket público: cualquiera puede VER las fotos; solo admins suben o borran.
-- Límite de 1 MB por archivo (el panel las comprime a ~100 KB antes de subirlas).

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('productos', 'productos', true, 1048576,
        array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "fotos_ver"      on storage.objects;
drop policy if exists "fotos_subir"    on storage.objects;
drop policy if exists "fotos_cambiar"  on storage.objects;
drop policy if exists "fotos_borrar"   on storage.objects;

create policy "fotos_ver" on storage.objects
  for select to authenticated
  using (bucket_id = 'productos' and public.es_admin());
create policy "fotos_subir" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'productos' and public.es_admin());
create policy "fotos_cambiar" on storage.objects
  for update to authenticated
  using (bucket_id = 'productos' and public.es_admin())
  with check (bucket_id = 'productos' and public.es_admin());
create policy "fotos_borrar" on storage.objects
  for delete to authenticated
  using (bucket_id = 'productos' and public.es_admin());


-- ---------- 6. Administradores (CAMBIÁ EL EMAIL) ----------
-- Tiene que ser el mismo email con el que creás el usuario en
-- Authentication -> Users. Podés agregar más filas.

insert into public.admins (email) values ('TU-EMAIL@ejemplo.com')
on conflict do nothing;
