# Okisa · Catálogo online

Catálogo estático de ropa para niños. Sin base de datos ni instalación: solo HTML, CSS y JavaScript.

## Estructura

```
index.html          Página principal
css/style.css       Estilos (paleta del logo)
js/app.js           Lógica de filtros, buscador y WhatsApp
data/productos.js   ⭐ Productos, categorías, talles y datos de contacto
img/logo.jpg        Logo
img/productos/      Fotos de los productos
```

## 1. Personalizar (5 minutos)

Abrí `data/productos.js` con cualquier editor de texto (Bloc de notas, VS Code, etc.):

1. **Contacto:** en `CONFIG` completá los canales que quieras usar. Los que dejes vacíos (`""`) no aparecen.
   - `instagram`: tu usuario sin @. El botón "Consultar" abre tu chat de mensajes directos.
   - `whatsapp` (opcional): con código de país, sin `+`, espacios ni guiones. Ej. `5493431234567`.
   - Si completás los dos, al tocar "Consultar" el cliente elige por cuál escribir.
2. **Productos:** reemplazá los de ejemplo. Copiá y pegá un bloque `{ ... }` por cada prenda nueva.
3. **Categorías:** el `categoria` de cada producto tiene que coincidir con uno de la lista `CATEGORIAS`.
   Si agregás una categoría nueva, sumala también a esa lista.
4. **Agotado / Nuevo:** agregá `agotado: true` o `nuevo: true` al producto.

Para ver el resultado, abrí `index.html` con doble clic. No necesitás servidor.

### Sobre Instagram y WhatsApp

- **WhatsApp** permite abrir el chat con el mensaje ya escrito. Pero el número queda visible en el código de la página.
- **Instagram** no permite mensajes prellenados. Por eso, al tocar "Consultar", el sitio **copia la consulta**
  (producto, talle y color) y abre tu chat; el cliente solo tiene que pegar el mensaje.
  El botón es un enlace real (no un script), así el celular puede abrir la app de Instagram. Tu número no aparece en ningún lado. Para que cualquiera pueda escribirte, la cuenta tiene que estar abierta a mensajes.

### Carga por tandas

El catálogo muestra `productosPorPagina` productos (12 por defecto, en `CONFIG`) y va sumando más a medida
que se baja por la página. Las fotos de los productos que todavía no se muestran no se descargan.
Si el navegador no soporta el scroll automático, queda el botón "Ver más productos".
Cambiar de categoría o usar el buscador reinicia el listado desde la primera tanda.

### Colores por prenda

Agregá `colores` a un producto para que aparezcan los círculos de color. Al elegir uno cambia la foto:

```js
colores: [
  { nombre: "Rosa",  hex: "#E0A9A0", foto: "img/productos/vestido-rosa.jpg" },
  { nombre: "Arena", hex: "#E9D6B5", foto: "img/productos/vestido-arena.jpg" }
]
```

`hex` es el color del círculo; `foto` es la imagen de esa variante. El color elegido se incluye en la consulta.
Si un producto no tiene `colores`, simplemente no muestra el selector.

## 2. Fotos

- Guardalas en `img/productos/` y poné la ruta en `foto:` (ej. `img/productos/vestido-rosa.jpg`).
- Formato recomendado: **JPG o WebP, vertical 4:5, 800 × 1000 px**, menos de 150 KB cada una.
  Para achicarlas rápido: https://squoosh.app
- Los nombres de archivo sin espacios ni tildes (`vestido-rosa.jpg`, no `Vestido Rosa.jpg`).
- Las imágenes `.svg` que vienen son solo de ejemplo: podés borrarlas.

## 3. Publicar

### GitHub Pages
1. Creá un repositorio nuevo en GitHub (por ejemplo `catalogo`).
2. Subí **el contenido** de esta carpeta (que `index.html` quede en la raíz del repo).
3. Andá a **Settings → Pages**. En *Source* elegí **Deploy from a branch**, rama **main**, carpeta **/ (root)** y guardá.
4. En 1 o 2 minutos el sitio queda en `https://TU-USUARIO.github.io/catalogo/`.

### Netlify (lo más rápido)
Entrá a https://app.netlify.com/drop y arrastrá la carpeta completa. Te da el link al instante.

### Vercel
Importá el repositorio de GitHub desde https://vercel.com/new. No hace falta configurar nada
(*Framework Preset: Other*, dejá vacíos el build command y el output directory).

## 4. Actualizar

Editá `data/productos.js` (y sumá fotos si hay), y volvé a subir los archivos. En GitHub, Netlify
y Vercel conectados al repo, el sitio se actualiza solo con cada cambio.

Si no ves el cambio: esperá 1 o 2 minutos (GitHub Pages tarda en publicar) y refrescá sin caché
(`Ctrl + F5` en la compu; en el celular, cerrá la pestaña y abrila de nuevo). Asegurate de subir
**todos** los archivos del zip, no solo alguno: `index.html`, `css/`, `js/` y `data/` tienen que ser de la misma versión.

## Tip: link directo a una categoría

Podés compartir una categoría específica agregando `#` y el nombre al final del link:
`https://TU-SITIO/#Pijamas`
