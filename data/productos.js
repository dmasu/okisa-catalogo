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
  CATEGORIAS: ["Ajuares", "Bodies", "Conjuntos", "Ranitas", "Jardineros", "Bermudas", "Remeras", "Abrigos", "Accesorios"],

  /* ---------- Talles (define el orden del filtro) ---------- */
  TALLES: ["RN", "RN1", "RN2", "1", "2", "3M", "6M", "9M", "12M", "18M", "24M", "4", "6", "Único"],

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
      nombre: "Ajuares hilo",
      descripcion: "",
      precio: 25000,
      categoria: "Ajuares",
      talles: ["1", "2"],
      foto: "img/productos/ajuares-hilo-marfil.webp",
      colores: [
        { nombre: "Marfil", hex: "#F2EBDC", foto: "img/productos/ajuares-hilo-marfil.webp" }
      ]
    },
    {
      nombre: "Trío body",
      descripcion: "Body + pantalón + babero.",
      precio: 23000,
      categoria: "Conjuntos",
      talles: ["3M", "6M", "9M", "12M"],
      foto: "img/productos/trio-body-rosa.webp",
      colores: [
        { nombre: "Rosa", hex: "#E0A9A0", foto: "img/productos/trio-body-rosa.webp" },
        { nombre: "Celeste", hex: "#B2FFFF", foto: "img/productos/trio-body-celeste.webp" }
      ]
    },
    {
      nombre: "Body trencito",
      descripcion: "",
      precio: 14000,
      categoria: "Bodies",
      talles: ["RN", "3M", "6M", "9M"],
      foto: "img/productos/body-trencito.webp",
      colores: []
    },
    {
      nombre: "Body patito",
      descripcion: "",
      precio: 14000,
      categoria: "Bodies",
      talles: ["3M", "6M", "9M"],
      foto: "img/productos/body-patito.webp",
      colores: []
    },
    {
      nombre: "Body animalitos",
      descripcion: "",
      precio: 10000,
      categoria: "Bodies",
      talles: ["RN", "3M", "6M"],
      foto: "img/productos/body-animalitos-mostaza.webp",
      colores: [
        { nombre: "Mostaza", hex: "#D9A93B", foto: "img/productos/body-animalitos-mostaza.webp" },
        { nombre: "Bordó", hex: "#7B2D3A", foto: "img/productos/body-animalitos-bordo.webp" },
        { nombre: "Verde militar", hex: "#5B6B45", foto: "img/productos/body-animalitos-verde-militar.webp" },
        { nombre: "Oso rosa", hex: "#E7B3B8", foto: "img/productos/body-animalitos-oso-rosa.webp" }
      ]
    },
    {
      nombre: "Recibidores",
      descripcion: "",
      precio: 16000,
      categoria: "Accesorios",
      talles: ["Único"],
      foto: "img/productos/recibidores-crema.webp",
      colores: [
        { nombre: "Crema", hex: "#F0E4D3", foto: "img/productos/recibidores-crema.webp" },
        { nombre: "Celeste", hex: "#B2FFFF", foto: "img/productos/recibidores-celeste.webp" }
      ]
    },
    {
      nombre: "Ajuares 3 piezas",
      descripcion: "",
      precio: 20000,
      categoria: "Ajuares",
      talles: ["1", "2"],
      foto: "img/productos/ajuares-3-piezas-blanco-liso.webp",
      colores: [
        { nombre: "Blanco liso", hex: "#FFFFFF", foto: "img/productos/ajuares-3-piezas-blanco-liso.webp" },
        { nombre: "Arena", hex: "#E9D6B5", foto: "img/productos/ajuares-3-piezas-arena.webp" },
        { nombre: "Beige", hex: "#D9C3A5", foto: "img/productos/ajuares-3-piezas-beige.webp" },
        { nombre: "Blanco con ositos", hex: "#F6EFE6", foto: "img/productos/ajuares-3-piezas-blanco-con-ositos.webp" }
      ]
    },
    {
      nombre: "Ranitas rib",
      descripcion: "",
      precio: 9000,
      categoria: "Ranitas",
      talles: ["RN2", "3M", "6M"],
      foto: "img/productos/ranitas-rib-verde-agua.webp",
      colores: [
        { nombre: "Verde agua", hex: "#A8D5C2", foto: "img/productos/ranitas-rib-verde-agua.webp" },
        { nombre: "Beige", hex: "#D9C3A5", foto: "img/productos/ranitas-rib-beige.webp" },
        { nombre: "Gris claro", hex: "#C9C6C0", foto: "img/productos/ranitas-rib-gris-claro.webp" }
      ]
    },
    {
      nombre: "Ranitas interlock",
      descripcion: "",
      precio: 9500,
      categoria: "Ranitas",
      talles: ["RN1", "1", "6M"],
      foto: "img/productos/ranitas-interlock-beige.webp",
      colores: [
        { nombre: "Beige", hex: "#D9C3A5", foto: "img/productos/ranitas-interlock-beige.webp" },
        { nombre: "Gris claro", hex: "#C9C6C0", foto: "img/productos/ranitas-interlock-gris-claro.webp" },
        { nombre: "Blanco", hex: "#FFFFFF", foto: "img/productos/ranitas-interlock-gris-blanco.webp" }
      ]
    },
    {
      nombre: "Ranitas interlock ositos",
      descripcion: "",
      precio: 9500,
      categoria: "Ranitas",
      talles: ["RN1", "1", "6M"],
      foto: "img/productos/ranitas-interlock-ositos-beige.webp",
      colores: [
        { nombre: "Beige", hex: "#D9C3A5", foto: "img/productos/ranitas-interlock-ositos-beige.webp" },
        { nombre: "Celeste", hex: "#B2FFFF", foto: "img/productos/ranitas-interlock-ositos-celeste.webp" },
      ]
    },
    {
      nombre: "Jardinero gabardina",
      descripcion: "",
      precio: 24000,
      categoria: "Jardineros",
      talles: ["9M", "12M", "18M"],
      foto: "img/productos/jardinero-gabardina-vison.webp",
      colores: [
        { nombre: "Visón", hex: "#A89080", foto: "img/productos/jardinero-gabardina-vison.webp" },
        { nombre: "Verde militar", hex: "#5B6B45", foto: "img/productos/jardinero-gabardina-verde-militar.webp" },
        { nombre: "Azul marino", hex: "#1F2F4F", foto: "img/productos/jardinero-gabardina-azul-marino.webp" }
      ]
    },
    {
      nombre: "Bermudas jeans",
      descripcion: "",
      precio: 19000,
      categoria: "Bermudas",
      talles: ["18M", "24M", "4", "6"],
      foto: "img/productos/bermudas-jeans.webp",
      colores: []
    },
    {
      nombre: "Bermudas gabardina",
      descripcion: "",
      precio: 20000,
      categoria: "Bermudas",
      talles: ["9M", "12M", "18M", "4"],
      foto: "img/productos/bermudas-gabardina-azul-marino.webp",
      colores: [
        { nombre: "Azul marino", hex: "#1F2F4F", foto: "img/productos/bermudas-gabardina-azul-marino.webp" },
        { nombre: "Beige", hex: "#D9C3A5", foto: "img/productos/bermudas-gabardina-beige.webp" },
        { nombre: "Verde militar", hex: "#5B6B45", foto: "img/productos/bermudas-gabardina-verde-militar.webp" },
        { nombre: "Mostaza", hex: "#D9A93B", foto: "img/productos/bermudas-gabardina-mostaza.webp" },
        { nombre: "Visón", hex: "#A89080", foto: "img/productos/bermudas-gabardina-vison.webp" }
      ]
    },
    {
      nombre: "Remera lisa",
      descripcion: "",
      precio: 8500,
      categoria: "Remeras",
      talles: ["12M", "18M", "24M"],
      foto: "img/productos/remera-lisa-gris.webp",
      colores: [
        { nombre: "Gris", hex: "#9A9A9A", foto: "img/productos/remera-lisa-gris.webp" },
        { nombre: "Beige", hex: "#D9C3A5", foto: "img/productos/remera-lisa-beige.webp" },
        { nombre: "Crema", hex: "#F0E4D3", foto: "img/productos/remera-lisa-crema.webp" },
        { nombre: "Verde militar", hex: "#5B6B45", foto: "img/productos/remera-lisa-verde-militar.webp" },
        { nombre: "Negra", hex: "#2B2B2B", foto: "img/productos/remera-lisa-negra.webp" },
        { nombre: "Bordó", hex: "#7B2D3A", foto: "img/productos/remera-lisa-bordo.webp" },
        { nombre: "Verde petróleo", hex: "#1F5F63", foto: "img/productos/remera-lisa-verde-petroleo.webp" },
        { nombre: "Lila", hex: "#C8A2C8", foto: "img/productos/remera-lisa-lila.webp" },
        { nombre: "Gris clara", hex: "#C9C6C0", foto: "img/productos/remera-lisa-gris-clara.webp" }
      ]
    },
    {
      nombre: "Buzo hilo",
      descripcion: "",
      precio: 21000,
      categoria: "Abrigos",
      talles: ["12M", "18M"],
      foto: "img/productos/buzo-hilo-crema.webp",
      colores: [
        { nombre: "Crema", hex: "#F0E4D3", foto: "img/productos/buzo-hilo-crema.webp" },
        { nombre: "Celeste", hex: "#B2FFFF", foto: "img/productos/buzo-hilo-celeste.webp" }
      ]
    },
    {
      nombre: "Campera rib",
      descripcion: "",
      precio: 20000,
      categoria: "Abrigos",
      talles: ["12M", "18M", "24M"],
      foto: "img/productos/campera-rib-azul.webp",
      colores: [
        { nombre: "Azul", hex: "#3B6EA5", foto: "img/productos/campera-rib-azul.webp" },
        { nombre: "Crema", hex: "#F0E4D3", foto: "img/productos/campera-rib-crema.webp" },
        { nombre: "Gris claro", hex: "#C9C6C0", foto: "img/productos/campera-rib-gris-claro.webp" }
      ]
    },
    {
      nombre: "Body Any",
      descripcion: "",
      precio: 15500,
      categoria: "Bodies",
      talles: ["1", "2", "3", "4", "5"],
      foto: "img/productos/body-any-rosa-coquett.webp",
      colores: [
        { nombre: "Rosa coquett", hex: "#E8AFC0", foto: "img/productos/body-any-rosa-coquett.webp" },
        { nombre: "Natural", hex: "#EAD9C0", foto: "img/productos/body-any-natural.webp" },
        { nombre: "Beige", hex: "#D9C3A5", foto: "img/productos/body-any-beige.webp" },
      ]
    },
    {
      nombre: "Body Vaitiere",
      descripcion: "",
      precio: 16000,
      categoria: "Bodies",
      talles: ["1", "2", "3", "4", "5"],
      foto: "img/productos/body-vaitiere-rosa-flores.webp",
      colores: [
        { nombre: "Rosa flores", hex: "#E6B8C4", foto: "img/productos/body-vaitiere-rosa-flores.webp" }
      ]
    },
    {
      nombre: "Body Amalia",
      descripcion: "",
      precio: 15000,
      categoria: "Bodies",
      talles: ["1", "2", "3", "4", "5"],
      foto: "img/productos/body-amalia-beige.webp",
      colores: [
        { nombre: "Beige", hex: "#D9C3A5", foto: "img/productos/body-amalia-beige.webp" },
        { nombre: "Natural", hex: "#EAD9C0", foto: "img/productos/body-amalia-natural.webp" },
        { nombre: "Rosa coquett", hex: "#E8AFC0", foto: "img/productos/body-amalia-rosa-coquett.webp" }
      ]
    },
    {
      nombre: "Body Luken",
      descripcion: "",
      precio: 12500,
      categoria: "Bodies",
      talles: ["1", "2", "3", "4", "5"],
      foto: "img/productos/body-luken-blanco-1.webp",
      colores: [
        { nombre: "Blanco 1", hex: "#FFFFFF", foto: "img/productos/body-luken-blanco-1.webp" },
        { nombre: "Blanco 2", hex: "#FFFFFF", foto: "img/productos/body-luken-blanco-2.webp" },
        { nombre: "Menta", hex: "#B9E4D0", foto: "img/productos/body-luken-menta.webp" }
      ]
    },
    {
      nombre: "Body Mao",
      descripcion: "",
      precio: 13500,
      categoria: "Bodies",
      talles: ["1", "2", "3", "4", "5"],
      foto: "img/productos/body-mao-menta.webp",
      colores: [
        { nombre: "Menta", hex: "#B9E4D0", foto: "img/productos/body-mao-menta.webp" },
        { nombre: "Natural", hex: "#EAD9C0", foto: "img/productos/body-mao-natural.webp" },
        { nombre: "Camel", hex: "#C19A6B", foto: "img/productos/body-mao-camel.webp" }
      ]
    },
    {
      nombre: "Remera Mao",
      descripcion: "",
      precio: 9000,
      categoria: "Remeras",
      talles: ["1", "2", "3", "4", "5"],
      foto: "img/productos/remera-mao-camel.webp",
      colores: [
        { nombre: "Camel", hex: "#C19A6B", foto: "img/productos/remera-mao-camel.webp" }
      ]
    },
    {
      nombre: "Remera Keoki",
      descripcion: "",
      precio: 10000,
      categoria: "Remeras",
      talles: ["3", "4", "5", "6"],
      foto: "img/productos/remera-keoki-camel-1.webp",
      colores: [
        { nombre: "Camel 1", hex: "#C19A6B", foto: "img/productos/remera-keoki-camel-1.webp" },
        { nombre: "Camel 2", hex: "#C19A6B", foto: "img/productos/remera-keoki-camel-2.webp" },
        { nombre: "Blanco 1", hex: "#FFFFFF", foto: "img/productos/remera-keoki-blanco-1.webp" },
        { nombre: "Blanco 2", hex: "#FFFFFF", foto: "img/productos/remera-keoki-blanco-2.webp" }
      ]
    },
    {
      nombre: "Short Tayla",
      descripcion: "",
      precio: 14500,
      categoria: "Shorts",
      talles: ["3", "4", "5"],
      foto: "img/productos/short-tayla-avellana-chocolate.webp",
      colores: [
        { nombre: "Avellana/chocolate", hex: "#8B5E3C", foto: "img/productos/short-tayla-avellana-chocolate.webp" },
        { nombre: "Beige", hex: "#D9C3A5", foto: "img/productos/short-tayla-beige.webp" }
      ]
    },
    {
      nombre: "Vestido Taraji",
      descripcion: "",
      precio: 17800,
      categoria: "Vestidos",
      talles: ["3", "4", "5"],
      foto: "img/productos/vestido-taraji-avellana.webp",
      colores: [
        { nombre: "Avellana", hex: "#A9784C", foto: "img/productos/vestido-taraji-avellana.webp" }
      ]
    },
    {
      nombre: "Vestido Kenia",
      descripcion: "",
      precio: 21000,
      categoria: "Vestidos",
      talles: ["3", "4", "5"],
      foto: "img/productos/vestido-kenia-verde.webp",
      colores: [
        { nombre: "Verde", hex: "#6B8E4E", foto: "img/productos/vestido-kenia-verde.webp" }
      ]
    },
    {
      nombre: "Camiseta Onika",
      descripcion: "",
      precio: 16500,
      categoria: "Musculosas",
      talles: ["3", "4", "5"],
      foto: "img/productos/camiseta-onika-uva.webp",
      colores: [
        { nombre: "Uva", hex: "#6E4B7A", foto: "img/productos/camiseta-onika-uva.webp" }
      ]
    },
    {
      nombre: "Camiseta Amira",
      descripcion: "",
      precio: 16500,
      categoria: "Musculosas",
      talles: ["3", "4", "5"],
      foto: "img/productos/camiseta-amira-chocolate.webp",
      colores: [
        { nombre: "Chocolate", hex: "#4A2F23", foto: "img/productos/camiseta-amira-chocolate.webp" },
        { nombre: "Blanco", hex: "#FFFFFF", foto: "img/productos/camiseta-amira-blanco.webp" }
      ]
    },
    {
      nombre: "Camiseta Lalani",
      descripcion: "",
      precio: 17000,
      categoria: "Musculosas",
      talles: ["3", "4", "5"],
      foto: "img/productos/camiseta-lalani-bosque.webp",
      colores: [
        { nombre: "Bosque", hex: "#3F5C3F", foto: "img/productos/camiseta-lalani-bosque.webp" },
      ]
    },
    {
      nombre: "Calza Ayla",
      descripcion: "",
      precio: 11500,
      categoria: "Calzas",
      talles: ["1", "2", "3", "4", "5"],
      foto: "img/productos/calza-ayla-uva.webp",
      colores: [
        { nombre: "Uva", hex: "#6E4B7A", foto: "img/productos/calza-ayla-uva.webp" },
        { nombre: "Camel", hex: "#C19A6B", foto: "img/productos/calza-ayla-camel.webp" }
      ]
    },
    {
      nombre: "Bermuda Davu",
      descripcion: "",
      precio: 15000,
      categoria: "Bermudas",
      talles: ["3", "4", "5", "6"],
      foto: "img/productos/bermuda-davu-verde.webp",
      colores: [
        { nombre: "Verde", hex: "#6B8E4E", foto: "img/productos/bermuda-davu-verde.webp" },
        { nombre: "Gris", hex: "#9A9A9A", foto: "img/productos/bermuda-davu-gris.webp" }
      ]
    },
    {
      nombre: "Camisa Azibo",
      descripcion: "",
      precio: 16500,
      categoria: "Camisas",
      talles: ["3", "4", "5"],
      foto: "img/productos/camisa-azibo-beige.webp",
      colores: [
        { nombre: "Beige", hex: "#D9C3A5", foto: "img/productos/camisa-azibo-beige.webp" },
        { nombre: "Natural", hex: "#EAD9C0", foto: "img/productos/camisa-azibo-natural.webp" }
      ]
    },
    {
      nombre: "Buzo Azibo",
      descripcion: "",
      precio: 15500,
      categoria: "Abrigos",
      talles: ["3", "4", "5"],
      foto: "img/productos/buzo-azibo-beige.webp",
      colores: [
        { nombre: "Beige", hex: "#D9C3A5", foto: "img/productos/buzo-azibo-beige.webp" },
        { nombre: "Natural", hex: "#EAD9C0", foto: "img/productos/buzo-azibo-natural.webp" }
      ]
    }
  ]
};
