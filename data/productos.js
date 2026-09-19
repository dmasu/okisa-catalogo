/* ==========================================================
   OKISA · Datos del catálogo
   Este es el ÚNICO archivo que necesitás editar para cambiar
   precios, agregar productos o modificar categorías.
   ========================================================== */

window.OKISA = {

  /* ---------- Datos del emprendimiento ---------- */
  CONFIG: {
    nombre: "Okisa",

    // Cuántos productos se cargan por tanda. Al bajar por la página se van
    // sumando solos; así las fotos se descargan solo cuando hacen falta.
    productosPorPagina: 6,

    // Canales de contacto. Podés usar uno, otro o los dos.
    // Si dejás un canal vacío ("") no aparece en el sitio.

    // Instagram: usuario sin @. Los clientes te escriben por mensaje directo.
    instagram: "okisa_ropita_infantil",

    // WhatsApp (opcional): con código de país, sin +, espacios ni guiones.
    // Ejemplo Paraná: 54 9 343 1234567 -> "5493431234567"
    // OJO: este número queda visible en el código de la página.
    whatsapp: ""
  },

  /* ---------- Categorías (en el orden en que aparecen) ---------- */
  // Cada producto debe usar EXACTAMENTE uno de estos nombres.
  CATEGORIAS: ["Bebés", "Nenas", "Nenes", "Pijamas", "Abrigos", "Accesorios"],

  /* ---------- Talles (define el orden del filtro) ---------- */
  TALLES: ["RN", "0-3m", "3-6m", "6-9m", "9-12m", "12-18m", "2", "4", "6", "8", "10", "12", "Único"],

  /* ---------- Productos ----------
     nombre       Título del producto
     descripcion  Texto corto (1 o 2 líneas)
     precio       Número sin puntos ni símbolo (ej: 12900)
     categoria    Una de las CATEGORIAS de arriba
     talles       Lista de talles disponibles
     foto         Ruta de la imagen principal (carpeta img/productos/)
     colores      (opcional) Lista de colores. Cada uno con nombre, hex y su foto:
                  colores: [
                    { nombre: "Rosa",  hex: "#E0A9A0", foto: "img/productos/vestido-rosa.jpg" },
                    { nombre: "Arena", hex: "#E9D6B5", foto: "img/productos/vestido-arena.jpg" }
                  ]
                  Al elegir un color cambia la foto del producto.
                  Si usás colores, "foto" es opcional (se usa la del primer color).
     nuevo        (opcional) true -> muestra la etiqueta "Nuevo"
     agotado      (opcional) true -> muestra "Agotado" y desactiva el botón
  ------------------------------------------------------- */
  PRODUCTOS: [
    {
      nombre: "Body manga larga de algodón",
      descripcion: "Suave y elástico, con broches en la entrepierna. Ideal para usar solo o como base de abrigo.",
      precio: 9500,
      categoria: "Bebés",
      talles: ["RN", "0-3m", "3-6m", "6-9m"],
      foto: "img/productos/body-bebe.svg",
      colores: [
        { nombre: "Durazno", hex: "#EBBCAC", foto: "img/productos/body-bebe.svg" },
        { nombre: "Arena", hex: "#E9D6B5", foto: "img/productos/body-bebe-arena.svg" },
        { nombre: "Hueso", hex: "#F4EBDD", foto: "img/productos/body-bebe-hueso.svg" }
      ]
    },
    {
      nombre: "Enterito osito de peluche",
      descripcion: "Enterito con capucha y orejitas. Interior abrigado y cierre frontal para cambiar pañales sin complicaciones.",
      precio: 24900,
      categoria: "Bebés",
      talles: ["0-3m", "3-6m", "6-9m", "9-12m"],
      foto: "img/productos/enterito-osito.svg",
      nuevo: true
    },
    {
      nombre: "Vestido de lino con volados",
      descripcion: "Liviano y fresco, con breteles anchos y volado en la pollera. Para días de calor y salidas especiales.",
      precio: 22500,
      categoria: "Nenas",
      talles: ["2", "4", "6", "8"],
      foto: "img/productos/vestido-lino.svg",
      colores: [
        { nombre: "Rosa", hex: "#E0A9A0", foto: "img/productos/vestido-lino.svg" },
        { nombre: "Arena", hex: "#E9D6B5", foto: "img/productos/vestido-lino-arena.svg" },
        { nombre: "Salvia", hex: "#A29B89", foto: "img/productos/vestido-lino-salvia.svg" }
      ]
    },
    {
      nombre: "Remera estampada corazón",
      descripcion: "Algodón peinado con estampa de corazón. Cuello redondo y costuras suaves que no molestan.",
      precio: 12900,
      categoria: "Nenas",
      talles: ["2", "4", "6", "8", "10"],
      foto: "img/productos/remera-corazon.svg"
    },
    {
      nombre: "Jogging rústico",
      descripcion: "Cintura elastizada con cordón y puño en el tobillo. Resistente para jugar todo el día.",
      precio: 18700,
      categoria: "Nenes",
      talles: ["2", "4", "6", "8", "10", "12"],
      foto: "img/productos/jogging-rustico.svg",
      colores: [
        { nombre: "Salvia", hex: "#A29B89", foto: "img/productos/jogging-rustico.svg" },
        { nombre: "Moca", hex: "#8D7267", foto: "img/productos/jogging-rustico-moca.svg" },
        { nombre: "Arena", hex: "#E9D6B5", foto: "img/productos/jogging-rustico-arena.svg" }
      ]
    },
    {
      nombre: "Remera básica de algodón",
      descripcion: "Un básico que combina con todo. Algodón peinado, no se deforma con los lavados.",
      precio: 11500,
      categoria: "Nenes",
      talles: ["2", "4", "6", "8", "10", "12"],
      foto: "img/productos/remera-basica.svg",
      colores: [
        { nombre: "Moca", hex: "#8D7267", foto: "img/productos/remera-basica.svg" },
        { nombre: "Arena", hex: "#E9D6B5", foto: "img/productos/remera-basica-arena.svg" },
        { nombre: "Salvia", hex: "#A29B89", foto: "img/productos/remera-basica-salvia.svg" }
      ]
    },
    {
      nombre: "Pijama de algodón dos piezas",
      descripcion: "Remera y pantalón largo en algodón suave. Sin etiquetas que pinchen.",
      precio: 19900,
      categoria: "Pijamas",
      talles: ["2", "4", "6", "8"],
      foto: "img/productos/pijama-algodon.svg"
    },
    {
      nombre: "Pijama polar con estrellas",
      descripcion: "Polar liviano y calentito para las noches frías. Estampa de estrellas en todo el conjunto.",
      precio: 26500,
      categoria: "Pijamas",
      talles: ["2", "4", "6", "8", "10"],
      foto: "img/productos/pijama-polar.svg",
      agotado: true
    },
    {
      nombre: "Buzo con capucha de frisa",
      descripcion: "Frisa suave por dentro, capucha con cordón y bolsillo canguro.",
      precio: 28900,
      categoria: "Abrigos",
      talles: ["4", "6", "8", "10", "12"],
      foto: "img/productos/buzo-capucha.svg",
      colores: [
        { nombre: "Terracota", hex: "#A67A5F", foto: "img/productos/buzo-capucha.svg" },
        { nombre: "Crema", hex: "#F0E4D3", foto: "img/productos/buzo-capucha-crema.svg" },
        { nombre: "Salvia", hex: "#A29B89", foto: "img/productos/buzo-capucha-salvia.svg" }
      ]
    },
    {
      nombre: "Campera de abrigo inflable",
      descripcion: "Liviana y cálida, con cierre y bolsillos. Repele el viento y la llovizna.",
      precio: 42000,
      categoria: "Abrigos",
      talles: ["2", "4", "6", "8", "10"],
      foto: "img/productos/campera-abrigo.svg"
    },
    {
      nombre: "Gorro de lana con pompón",
      descripcion: "Tejido a punto jersey con forro interior suave. Talle único elástico.",
      precio: 8900,
      categoria: "Accesorios",
      talles: ["Único"],
      foto: "img/productos/gorro-lana.svg"
    },
    {
      nombre: "Pack x3 medias antideslizantes",
      descripcion: "Con suela de silicona para que no resbalen. Vienen en tonos tierra.",
      precio: 7500,
      categoria: "Accesorios",
      talles: ["Único"],
      foto: "img/productos/medias-pack.svg",
      nuevo: true
    }
  ]
};
