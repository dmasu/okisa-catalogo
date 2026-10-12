# Panel de administración · Puesta en marcha

Con esto, quien administre el catálogo puede crear, editar, ocultar y reordenar productos, marcar
agotados y subir fotos desde `admin.html`, y los cambios se ven al instante en el catálogo, sin
volver a publicar nada.

Se necesita una cuenta gratuita en [supabase.com](https://supabase.com). Son unos 10 minutos.

## 1. Crear el proyecto

1. Entrá a Supabase → **New project**. Elegí una región cercana (por ejemplo *South America (São Paulo)*).
2. Guardá la contraseña de la base de datos en un lugar seguro (no se usa en este proyecto, pero no se puede recuperar).

## 2. Crear las tablas y las reglas de seguridad

1. En el menú lateral abrí **SQL Editor → New query**.
2. Abrí `supabase/schema.sql`, **cambiá `TU-EMAIL@ejemplo.com`** (última línea) por el email de quien va a administrar, pegá todo y tocá **Run**.
3. Se puede ejecutar más de una vez sin romper nada. Para sumar otro administrador, agregá su email a la tabla `admins` con otro `insert`.

## 3. Crear el usuario administrador

1. **Authentication → Users → Add user → Create new user**.
2. Usá **el mismo email** del paso anterior, una contraseña, y tildá la opción de confirmar el email automáticamente.
3. Recomendado: en **Authentication** desactivá los registros públicos (la opción se llama algo como
   *Allow new users to sign up*; el nombre exacto puede variar). Aunque queden activados, solo pueden
   escribir los emails de la tabla `admins`.

## 4. Conectar el sitio

1. **Project Settings → API**. Copiá la **Project URL** y la clave pública (`anon` o `publishable`).
2. Pegalas en `js/supabase-config.js`.
3. **Nunca** pegues la clave `service_role` / `secret`: esa se salta todas las protecciones.
4. Subí los cambios a GitHub como siempre.

## 5. Primer ingreso

1. Abrí `https://TU-SITIO/admin.html` e ingresá con el email y la contraseña del paso 3.
2. Con la base vacía aparece **Importar catálogo actual**: trae los productos y las fotos de
   `data/productos.js` tal cual están. Hacelo una sola vez, desde el sitio publicado (no desde un archivo local).
3. Listo: desde ahora se edita todo desde el panel.

## Cómo se usa

- **Disponible / Agotado** y **Ocultar / Mostrar** son botones directos en cada producto.
- **Flechas ↑ ↓**: cambian el orden en el catálogo (con la búsqueda vacía). Los productos nuevos aparecen primero.
- **Fotos**: se achican y convierten a WebP solas (hasta 800 × 1000 px, cerca de 100 KB). Si un producto tiene colores,
  cada color lleva su foto y la principal se toma del primero. Al reemplazar o quitar una foto, la anterior se borra.
- **Categorías y talles**: se administran en su pestaña. Renombrar una categoría actualiza todos sus productos.
  Una categoría con productos no se puede eliminar.

## Qué pasa si Supabase no responde

El catálogo muestra la última copia que ese navegador guardó y, si no hay ninguna, usa `data/productos.js`.
Ese archivo es una **foto del momento de la importación**: no se actualiza solo. Además guarda la
configuración (`CONFIG`: Instagram, WhatsApp, productos por tanda), que sigue editándose ahí.

> **Importante, plan gratuito:** Supabase pausa los proyectos gratuitos después de una semana sin actividad.
> Mientras esté pausado, el catálogo cae en la copia del navegador o en `data/productos.js` (datos viejos).
> Se reactiva desde el panel de Supabase. Si el catálogo es clave para el negocio, el plan Pro lo evita.

## Archivos nuevos o modificados

| Archivo | Qué es |
|---|---|
| `admin.html`, `css/admin.css`, `js/admin.js` | El panel |
| `js/supabase-config.js` | URL y clave pública de tu proyecto |
| `js/datos.js` | Carga los datos desde Supabase, con copia y respaldo |
| `js/app.js`, `index.html` | Ajustes mínimos para cargar los datos de forma asíncrona |
| `supabase/schema.sql` | Tablas, reglas de seguridad y bucket de fotos |
