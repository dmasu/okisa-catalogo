/* ==========================================================
   OKISA · Lógica del catálogo
   No hace falta tocar este archivo para cambiar productos:
   editá data/productos.js
   ========================================================== */
(function () {
  "use strict";

  var DATA = window.OKISA;
  if (!DATA) {
    document.getElementById("contador").textContent =
      "No se pudo cargar data/productos.js";
    return;
  }

  var CONFIG = DATA.CONFIG;
  var PRODUCTOS = DATA.PRODUCTOS.map(function (p, i) { p.id = i; return p; });

  // Canales de contacto activos (según lo que haya en CONFIG)
  var CANALES = [];
  if (CONFIG.instagram) CANALES.push("instagram");
  if (CONFIG.whatsapp) CANALES.push("whatsapp");

  var ICONOS = {
    whatsapp: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.3" cy="6.7" r="1.3" fill="currentColor"/></svg>',
    chat: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>'
  };
  function iconoConsulta() {
    return CANALES.length === 1 ? ICONOS[CANALES[0]] : ICONOS.chat;
  }

  var $ = function (id) { return document.getElementById(id); };
  var grilla = $("grilla"), chips = $("chips"), contador = $("contador"),
      vacio = $("vacio"), inputBuscar = $("buscar"), selTalle = $("talle"),
      selOrden = $("orden"), lightbox = $("lightbox"), dlgCanales = $("canales"),
      toast = $("toast"), mas = $("mas");

  // Si el HTML en caché es una versión vieja y no trae el botón, se crea acá
  if (!mas) {
    mas = document.createElement("div");
    mas.id = "mas"; mas.className = "more"; mas.hidden = true;
    mas.innerHTML = '<button class="btn btn--ghost" id="ver-mas" type="button">Ver más productos</button>';
    grilla.parentNode.insertBefore(mas, grilla.nextSibling);
  }

  var estado = { categoria: "Todos", texto: "", talle: "", orden: "default" };
  var sel = {};              // id de producto -> { talle, color } elegidos en la tarjeta
  var mensajePendiente = ""; // mensaje a enviar cuando se elige canal

  /* ---------- Utilidades ---------- */
  var fmtPrecio = new Intl.NumberFormat("es-AR", {
    style: "currency", currency: "ARS", maximumFractionDigits: 0
  });

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function normalizar(s) {
    return String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  /* ---------- Selección por tarjeta (talle / color) ---------- */
  function seleccion(p) { return sel[p.id] || (sel[p.id] = {}); }

  function colorActual(p) {
    if (!p.colores || !p.colores.length) return null;
    var nombre = seleccion(p).color;
    for (var i = 0; i < p.colores.length; i++) {
      if (p.colores[i].nombre === nombre) return p.colores[i];
    }
    return p.colores[0];
  }

  function fotoDe(p) {
    var c = colorActual(p);
    return (c && c.foto) || p.foto || "";
  }

  function altDe(p) {
    var c = colorActual(p);
    return p.nombre + (c ? " (" + c.nombre.toLowerCase() + ")" : "");
  }

  /* ---------- Contacto ---------- */
  function mensajeProducto(p) {
    var s = seleccion(p), c = colorActual(p), det = [];
    if (s.talle) det.push("talle " + s.talle);
    if (c) det.push("color " + c.nombre.toLowerCase());
    return "¡Hola " + CONFIG.nombre + "! Me interesa \"" + p.nombre + "\"" +
      (det.length ? " (" + det.join(", ") + ")" : "") +
      " a " + fmtPrecio.format(p.precio) + ". ¿Lo tienen disponible?";
  }

  function mensajeGeneral() {
    return "¡Hola " + CONFIG.nombre + "! Vi el catálogo y quería hacerles una consulta.";
  }

  var toastTimer;
  function avisar(texto) {
    toast.textContent = texto;
    toast.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("is-on"); }, 6000);
  }

  function copiarTexto(texto) {
    function alternativo() {
      var ta = document.createElement("textarea");
      ta.value = texto; ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;opacity:0;top:0;left:0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (e) { /* ignorar */ }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(texto).catch(alternativo);
    } else {
      alternativo();
    }
  }

  function urlCanal(canal, mensaje) {
    if (canal === "whatsapp") {
      return "https://wa.me/" + CONFIG.whatsapp + (mensaje ? "?text=" + encodeURIComponent(mensaje) : "");
    }
    return "https://ig.me/m/" + encodeURIComponent(CONFIG.instagram);
  }

  // Los botones de consulta son enlaces <a> reales: así el celular puede abrir
  // la app de Instagram / WhatsApp (con window.open() abriría el navegador).
  // Este método se llama justo antes de que el navegador siga el enlace.
  function prepararEnlace(a, canal, mensaje) {
    a.href = urlCanal(canal, mensaje);
    if (canal === "instagram") {
      // Instagram no permite mensajes prellenados: copiamos el texto.
      copiarTexto(mensaje);
      avisar("Copiamos tu consulta. Pegala en el chat de Instagram.");
    }
  }

  function abrirDialogo(mensaje) {
    mensajePendiente = mensaje;
    if (typeof dlgCanales.showModal === "function") dlgCanales.showModal();
    else dlgCanales.setAttribute("open", "");
  }

  // Enlace de consulta. Con un solo canal apunta directo; con dos abre el selector.
  function hrefInicial() {
    return CANALES.length === 1 ? urlCanal(CANALES[0]) : "#";
  }

  // Llamar desde el click de cualquier enlace [data-consultar]
  function manejarConsulta(e, enlace, mensaje) {
    if (CANALES.length === 0) { e.preventDefault(); return; }
    if (CANALES.length === 1) { prepararEnlace(enlace, CANALES[0], mensaje); return; }
    e.preventDefault();
    abrirDialogo(mensaje);
  }

  /* ---------- Controles ---------- */
  function armarChips() {
    var cats = ["Todos"].concat(DATA.CATEGORIAS);
    chips.innerHTML = cats.map(function (c) {
      return '<button class="chip" type="button" data-cat="' + esc(c) +
        '" aria-pressed="' + (c === estado.categoria) + '">' + esc(c) + "</button>";
    }).join("");
  }

  function armarTalles() {
    var usados = {};
    PRODUCTOS.forEach(function (p) {
      (p.talles || []).forEach(function (t) { usados[t] = true; });
    });
    var orden = DATA.TALLES.filter(function (t) { return usados[t]; });
    Object.keys(usados).forEach(function (t) {
      if (orden.indexOf(t) === -1) orden.push(t);
    });
    orden.forEach(function (t) {
      var o = document.createElement("option");
      o.value = t; o.textContent = "Talle " + t;
      selTalle.appendChild(o);
    });
  }

  /* ---------- Filtrado ---------- */
  function filtrar() {
    var q = normalizar(estado.texto.trim());
    var lista = PRODUCTOS.filter(function (p) {
      if (estado.categoria !== "Todos" && p.categoria !== estado.categoria) return false;
      if (estado.talle && (p.talles || []).indexOf(estado.talle) === -1) return false;
      if (q) {
        var colores = (p.colores || []).map(function (c) { return c.nombre; }).join(" ");
        if (normalizar(p.nombre + " " + p.descripcion + " " + p.categoria + " " + colores).indexOf(q) === -1) return false;
      }
      return true;
    });
    if (estado.orden === "menor") lista.sort(function (a, b) { return a.precio - b.precio; });
    if (estado.orden === "mayor") lista.sort(function (a, b) { return b.precio - a.precio; });
    if (estado.orden === "az") lista.sort(function (a, b) { return a.nombre.localeCompare(b.nombre, "es"); });
    return lista;
  }

  /* ---------- Render ---------- */
  function tarjeta(p) {
    var s = seleccion(p), c = colorActual(p);

    var etiquetas = "";
    if (p.agotado) etiquetas = '<span class="badge badge--out">Agotado</span>';
    else if (p.nuevo) etiquetas = '<span class="badge">Nuevo</span>';

    var talles = (p.talles || []).map(function (t) {
      return '<button class="talle" type="button" data-talle="' + esc(t) +
        '" aria-pressed="' + (s.talle === t) + '">' + esc(t) + "</button>";
    }).join("");

    var colores = "";
    if (p.colores && p.colores.length) {
      colores = '<div class="colores" role="group" aria-label="Colores disponibles">' +
        '<span class="colores__label">Color: <strong data-color-nombre>' + esc(c.nombre) + "</strong></span>" +
        '<div class="colores__lista">' + p.colores.map(function (x) {
          return '<button class="swatch" type="button" style="--c:' + esc(x.hex) + '" data-color="' + esc(x.nombre) +
            '" aria-label="' + esc(x.nombre) + '" title="' + esc(x.nombre) +
            '" aria-pressed="' + (x.nombre === c.nombre) + '"></button>';
        }).join("") + "</div></div>";
    }

    var accion = "";
    if (p.agotado) accion = '<span class="btn btn--off" aria-disabled="true">Agotado</span>';
    else if (CANALES.length) accion = '<a class="btn" data-consultar href="' + esc(hrefInicial()) + '" target="_blank" rel="noopener">' + iconoConsulta() + "Consultar</a>";

    return '<article class="card' + (p.agotado ? " is-out" : "") + '" data-id="' + p.id + '">' +
      '<button class="card__media" type="button" data-zoom aria-label="Ampliar foto de ' + esc(p.nombre) + '">' +
        '<img src="' + esc(fotoDe(p)) + '" alt="' + esc(altDe(p)) + '" loading="lazy" decoding="async" width="800" height="1000">' +
        etiquetas +
      "</button>" +
      '<div class="card__body">' +
        '<p class="card__cat">' + esc(p.categoria) + "</p>" +
        '<h3 class="card__title">' + esc(p.nombre) + "</h3>" +
        '<p class="card__desc">' + esc(p.descripcion) + "</p>" +
        colores +
        (talles ? '<div class="talles" role="group" aria-label="Talles disponibles">' + talles + "</div>" : "") +
        '<div class="card__foot"><span class="precio">' + esc(fmtPrecio.format(p.precio)) + "</span>" + accion + "</div>" +
      "</div></article>";
  }

  /* ---------- Paginado (carga por tandas) ---------- */
  var POR_PAGINA = Math.max(4, Number(CONFIG.productosPorPagina) || 12);
  var listaActual = [];
  var mostrados = 0;

  function actualizarContador() {
    var total = listaActual.length;
    if (total === 0) contador.textContent = "";
    else if (mostrados < total) contador.textContent = "Mostrando " + mostrados + " de " + total + " productos";
    else contador.textContent = total === 1 ? "1 producto" : total + " productos";
    mas.hidden = mostrados >= total;
  }

  // Agrega la siguiente tanda al final de la grilla (no vuelve a dibujar las anteriores)
  function cargarMas() {
    if (mostrados >= listaActual.length) return;
    var tanda = listaActual.slice(mostrados, mostrados + POR_PAGINA);
    grilla.insertAdjacentHTML("beforeend", tanda.map(tarjeta).join(""));
    mostrados += tanda.length;
    actualizarContador();
  }

  function render() {
    listaActual = filtrar();
    grilla.innerHTML = "";
    mostrados = 0;
    vacio.hidden = listaActual.length !== 0;
    cargarMas();
    actualizarContador();
    pedirRevision();
  }

  function guardarEnUrl() {
    try {
      var h = estado.categoria === "Todos" ? "" : "#" + encodeURIComponent(estado.categoria);
      history.replaceState(null, "", location.pathname + location.search + h);
    } catch (e) { /* ignorar */ }
  }

  function marcarChip() {
    Array.prototype.forEach.call(chips.children, function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-cat") === estado.categoria));
    });
  }

  /* ---------- Eventos ---------- */
  chips.addEventListener("click", function (e) {
    var b = e.target.closest(".chip");
    if (!b) return;
    estado.categoria = b.getAttribute("data-cat");
    marcarChip(); guardarEnUrl(); render();
  });

  inputBuscar.addEventListener("input", function () { estado.texto = inputBuscar.value; render(); });
  selTalle.addEventListener("change", function () { estado.talle = selTalle.value; render(); });
  selOrden.addEventListener("change", function () { estado.orden = selOrden.value; render(); });

  $("limpiar").addEventListener("click", function () {
    estado = { categoria: "Todos", texto: "", talle: "", orden: "default" };
    inputBuscar.value = ""; selTalle.value = ""; selOrden.value = "default";
    marcarChip(); guardarEnUrl(); render();
  });

  grilla.addEventListener("click", function (e) {
    var card = e.target.closest(".card");
    if (!card) return;
    var p = PRODUCTOS[Number(card.getAttribute("data-id"))];
    var s = seleccion(p);

    // Talle
    var bt = e.target.closest(".talle");
    if (bt) {
      var t = bt.getAttribute("data-talle");
      var yaActivo = bt.getAttribute("aria-pressed") === "true";
      Array.prototype.forEach.call(card.querySelectorAll(".talle"), function (x) {
        x.setAttribute("aria-pressed", "false");
      });
      if (yaActivo) { delete s.talle; }
      else { s.talle = t; bt.setAttribute("aria-pressed", "true"); }
      return;
    }

    // Color: cambia la foto de la tarjeta
    var bc = e.target.closest(".swatch");
    if (bc) {
      s.color = bc.getAttribute("data-color");
      Array.prototype.forEach.call(card.querySelectorAll(".swatch"), function (x) {
        x.setAttribute("aria-pressed", String(x === bc));
      });
      var nombre = card.querySelector("[data-color-nombre]");
      if (nombre) nombre.textContent = s.color;
      var img = card.querySelector(".card__media img");
      img.src = fotoDe(p);
      img.alt = altDe(p);
      return;
    }

    // Consultar
    var enlace = e.target.closest("[data-consultar]");
    if (enlace) {
      manejarConsulta(e, enlace, mensajeProducto(p));
      return;
    }

    // Ampliar foto
    if (e.target.closest("[data-zoom]")) {
      $("lightbox-img").src = fotoDe(p);
      $("lightbox-img").alt = altDe(p);
      $("lightbox-cap").textContent = altDe(p) + " · " + fmtPrecio.format(p.precio);
      if (typeof lightbox.showModal === "function") lightbox.showModal();
      else lightbox.setAttribute("open", "");
    }
  });

  // Elegir canal (cuando hay Instagram y WhatsApp a la vez)
  dlgCanales.addEventListener("click", function (e) {
    if (e.target === dlgCanales) { dlgCanales.close(); return; }
    var a = e.target.closest("[data-canal]");
    if (!a) return;
    prepararEnlace(a, a.getAttribute("data-canal"), mensajePendiente);
    dlgCanales.close(); // el enlace se sigue igual: es el gesto directo del usuario
  });

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) lightbox.close();
  });

  /* ---------- Enlaces generales ---------- */
  var botonesCanal = dlgCanales.querySelectorAll("[data-canal]");
  Array.prototype.forEach.call(botonesCanal, function (b) {
    var c = b.getAttribute("data-canal");
    b.innerHTML = ICONOS[c] + (c === "instagram" ? "Instagram" : "WhatsApp");
    b.href = urlCanal(c);
  });

  if (CONFIG.instagram) {
    $("link-ig").href = "https://instagram.com/" + encodeURIComponent(CONFIG.instagram);
    $("link-ig").hidden = false;
  }
  if (CONFIG.whatsapp) {
    $("link-wa").href = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(mensajeGeneral());
    $("link-wa").hidden = false;
  }

  var fab = $("fab");
  if (CANALES.length) {
    fab.innerHTML = iconoConsulta().replace('width="18" height="18"', 'width="26" height="26"');
    fab.href = hrefInicial();
    fab.hidden = false;
    fab.addEventListener("click", function (e) { manejarConsulta(e, fab, mensajeGeneral()); });
  }

  /* ---------- Scroll infinito ---------- */
  // Se revisa la posición al hacer scroll (funciona en cualquier navegador,
  // sin depender de APIs nuevas). Carga la siguiente tanda 700px antes del final.
  var revisando = false;

  function cercaDelFinal() {
    return mas.getBoundingClientRect().top < window.innerHeight + 700;
  }

  function revisar() {
    revisando = false;
    var vueltas = 0;
    // En pantallas altas puede hacer falta más de una tanda para llenar la vista
    while (mostrados < listaActual.length && cercaDelFinal() && vueltas++ < 10) cargarMas();
  }

  function pedirRevision() {
    if (revisando) return;
    revisando = true;
    window.requestAnimationFrame(revisar);
  }

  window.addEventListener("scroll", pedirRevision, { passive: true });
  window.addEventListener("resize", pedirRevision);
  window.addEventListener("orientationchange", pedirRevision);
  $("ver-mas").addEventListener("click", cargarMas);

  /* ---------- Inicio ---------- */
  var hash = decodeURIComponent(location.hash.replace("#", ""));
  if (hash && DATA.CATEGORIAS.indexOf(hash) !== -1) estado.categoria = hash;

  armarChips();
  armarTalles();
  render();
})();
