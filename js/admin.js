/* ==========================================================
   OKISA · Panel de administración
   Productos, fotos, categorías y talles, guardados en Supabase.
   ========================================================== */
(function () {
  "use strict";

  var CFG = window.OKISA_SUPABASE || {};
  var BUCKET = "productos";
  var MAX_ANCHO = 800, MAX_ALTO = 1000, MAX_KB = 150;

  var db = null;
  var datos = { productos: [], categorias: [], talles: [] };
  var ui = { filtro: "" };
  var form = null;          // estado del formulario de producto abierto
  var usuarioActual = null;

  var $ = function (id) { return document.getElementById(id); };
  var fmtPrecio = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

  /* ---------- Utilidades ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function sinTildes(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function slug(s) {
    return sinTildes(s).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }

  function configurado() {
    return !!(CFG.url && CFG.anonKey &&
      CFG.url.indexOf("TU-PROYECTO") === -1 && CFG.anonKey.indexOf("TU_ANON_KEY") === -1);
  }

  var timerAviso;
  function aviso(texto, tipo) {
    var t = $("toast");
    t.textContent = texto;
    t.className = "toast is-on" + (tipo === "error" ? " toast--error" : "");
    clearTimeout(timerAviso);
    timerAviso = setTimeout(function () { t.classList.remove("is-on"); }, tipo === "error" ? 6500 : 2600);
  }

  function textoError(e) {
    if (!e) return "Ocurrió un error inesperado.";
    var m = e.message || String(e);
    if (e.code === "42501" || e.code === "PGRST116" || /row-level security|permission denied/i.test(m)) {
      return "No se pudo guardar. Tu sesión venció o tu usuario no tiene permiso. Volvé a ingresar.";
    }
    if (e.code === "23503") return "Esa categoría todavía tiene productos. Pasalos a otra categoría primero.";
    if (e.code === "23505") return "Ya existe uno con ese nombre.";
    if (/Failed to fetch|NetworkError|Load failed/i.test(m)) return "No hay conexión con el servidor. Revisá tu internet.";
    return m;
  }

  function mostrar(vista) {
    ["config", "login", "panel"].forEach(function (v) { $("vista-" + v).hidden = v !== vista; });
  }

  function fotoDe(p) {
    return p.foto || ((p.colores && p.colores[0] && p.colores[0].foto) || "");
  }

  function urlsDe(p) {
    var u = [p.foto];
    (p.colores || []).forEach(function (c) { u.push(c.foto); });
    return u.filter(Boolean);
  }

  /* ---------- Sesión ---------- */
  function iniciar() {
    if (!configurado() || !window.supabase) { mostrar("config"); return; }
    db = window.supabase.createClient(CFG.url, CFG.anonKey);
    // setTimeout evita llamar a Supabase dentro del propio callback de sesión.
    db.auth.onAuthStateChange(function (evento, sesion) {
      setTimeout(function () { alCambiarSesion(sesion); }, 0);
    });
  }

  async function alCambiarSesion(sesion) {
    if (!sesion) { usuarioActual = null; mostrar("login"); return; }
    if (usuarioActual === sesion.user.id) return;
    usuarioActual = sesion.user.id;

    var r = await db.rpc("es_admin");
    if (r.error || r.data !== true) {
      $("login-error").textContent = "Este usuario no tiene permiso para administrar el catálogo.";
      usuarioActual = null;
      await db.auth.signOut();
      return;
    }
    $("usuario-email").textContent = sesion.user.email || "";
    mostrar("panel");
    await cargarTodo();
  }

  $("form-login").addEventListener("submit", async function (e) {
    e.preventDefault();
    var err = $("login-error"), btn = $("login-enviar");
    err.textContent = "";
    btn.disabled = true; btn.textContent = "Ingresando…";
    var r = await db.auth.signInWithPassword({ email: $("login-email").value.trim(), password: $("login-clave").value });
    btn.disabled = false; btn.textContent = "Ingresar";
    if (r.error) {
      err.textContent = /invalid login credentials/i.test(r.error.message)
        ? "Email o contraseña incorrectos." : textoError(r.error);
    }
  });

  $("salir").addEventListener("click", function () { db.auth.signOut(); });

  /* ---------- Carga de datos ---------- */
  async function cargarTodo() {
    var r = await Promise.all([
      db.from("productos").select("*").order("orden").order("id"),
      db.from("categorias").select("*").order("orden").order("nombre"),
      db.from("talles").select("*").order("orden").order("nombre")
    ]);
    var fallo = r.filter(function (x) { return x.error; })[0];
    if (fallo) { aviso("No se pudieron cargar los datos: " + textoError(fallo.error), "error"); return; }
    datos.productos = r[0].data;
    datos.categorias = r[1].data;
    datos.talles = r[2].data;
    dibujarProductos();
    dibujarAjustes();
  }

  /* ---------- Pestañas ---------- */
  function irATab(nombre) {
    ["productos", "ajustes"].forEach(function (t) {
      $("tab-" + t).hidden = t !== nombre;
      $("tab-btn-" + t).setAttribute("aria-selected", String(t === nombre));
    });
  }
  $("tab-btn-productos").addEventListener("click", function () { irATab("productos"); });
  $("tab-btn-ajustes").addEventListener("click", function () { irATab("ajustes"); });

  /* ---------- Lista de productos ---------- */
  var ICONO_ARRIBA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 15l6-6 6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ICONO_ABAJO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ICONO_BORRAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M10 7V5h4v2m-7 0l1 12h8l1-12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function dibujarProductos() {
    var q = sinTildes(ui.filtro.trim());
    var lista = datos.productos;
    var visibles = lista.filter(function (p) {
      if (!q) return true;
      var colores = (p.colores || []).map(function (c) { return c.nombre; }).join(" ");
      return sinTildes(p.nombre + " " + p.categoria + " " + colores).indexOf(q) !== -1;
    });

    var ocultos = lista.filter(function (p) { return !p.visible; }).length;
    var agotados = lista.filter(function (p) { return p.agotado; }).length;
    var partes = [lista.length + (lista.length === 1 ? " producto" : " productos")];
    if (agotados) partes.push(agotados + (agotados === 1 ? " agotado" : " agotados"));
    if (ocultos) partes.push(ocultos + (ocultos === 1 ? " oculto" : " ocultos"));
    $("resumen").textContent = lista.length ? partes.join(", ") : "";

    var base = window.OKISA && window.OKISA.PRODUCTOS;
    var puedeImportar = lista.length === 0 && base && base.length > 0;
    $("importar").hidden = !puedeImportar;
    if (puedeImportar) $("importar-cantidad").textContent = base.length;

    var sinFiltro = !q;
    $("lista").innerHTML = visibles.map(function (p, i) {
      var pos = lista.indexOf(p);
      var etiquetas = "";
      if (!p.visible) etiquetas += '<span class="etiqueta etiqueta--oculto">Oculto</span>';
      if (p.nuevo) etiquetas += '<span class="etiqueta etiqueta--nuevo">Nuevo</span>';
      var nColores = (p.colores || []).length;
      var meta = [p.categoria, fmtPrecio.format(p.precio)];
      if (nColores) meta.push(nColores + (nColores === 1 ? " color" : " colores"));
      return '<li class="fila' + (p.visible ? "" : " is-oculto") + '" data-id="' + p.id + '">' +
        '<img class="fila__foto" src="' + esc(fotoDe(p)) + '" alt="" loading="lazy" width="56" height="70">' +
        '<div class="fila__info">' +
          '<p class="fila__nombre">' + esc(p.nombre) + "</p>" +
          '<p class="fila__meta">' + esc(meta.join(" · ")) + "</p>" + etiquetas +
        "</div>" +
        '<div class="fila__acciones">' +
          '<button class="estado" type="button" data-accion="agotado" aria-pressed="' + !!p.agotado + '">' + (p.agotado ? "Agotado" : "Disponible") + "</button>" +
          '<button class="btn btn--chico" type="button" data-accion="visible">' + (p.visible ? "Ocultar" : "Mostrar") + "</button>" +
          '<button class="btn btn--chico btn--principal" type="button" data-accion="editar">Editar</button>' +
          '<span class="orden">' +
            '<button class="icono" type="button" data-accion="subir" aria-label="Subir en el catálogo"' + (!sinFiltro || pos === 0 ? " disabled" : "") + ">" + ICONO_ARRIBA + "</button>" +
            '<button class="icono" type="button" data-accion="bajar" aria-label="Bajar en el catálogo"' + (!sinFiltro || pos === lista.length - 1 ? " disabled" : "") + ">" + ICONO_ABAJO + "</button>" +
          "</span>" +
        "</div></li>";
    }).join("");

    $("lista-vacia").hidden = visibles.length > 0 || lista.length === 0;
  }

  $("filtro").addEventListener("input", function () { ui.filtro = this.value; dibujarProductos(); });
  $("nuevo").addEventListener("click", function () { abrirProducto(null); });

  $("lista").addEventListener("click", function (e) {
    var boton = e.target.closest("button[data-accion]");
    if (!boton) return;
    var fila = boton.closest(".fila");
    var id = Number(fila.getAttribute("data-id"));
    var p = datos.productos.filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    var accion = boton.getAttribute("data-accion");

    if (accion === "editar") abrirProducto(id);
    else if (accion === "agotado") actualizar(p, { agotado: !p.agotado }, p.agotado ? "Marcado como disponible" : "Marcado como agotado");
    else if (accion === "visible") actualizar(p, { visible: !p.visible }, p.visible ? "Producto oculto del catálogo" : "Producto visible en el catálogo");
    else if (accion === "subir") mover(p, -1);
    else if (accion === "bajar") mover(p, 1);
  });

  async function actualizar(p, cambios, mensaje) {
    var r = await db.from("productos").update(cambios).eq("id", p.id).select().single();
    if (r.error) { aviso(textoError(r.error), "error"); return false; }
    Object.keys(r.data).forEach(function (k) { p[k] = r.data[k]; });
    dibujarProductos();
    if (mensaje) aviso(mensaje);
    return true;
  }

  // Reordena renumerando de a 10 y guardando solo lo que cambió.
  async function reordenar(tabla, clave, lista, desde, hasta) {
    var nueva = lista.slice();
    var mov = nueva.splice(desde, 1)[0];
    nueva.splice(hasta, 0, mov);
    var cambios = [];
    nueva.forEach(function (item, k) {
      if (item.orden !== k * 10) cambios.push({ item: item, orden: k * 10 });
    });
    var rs = await Promise.all(cambios.map(function (c) {
      return db.from(tabla).update({ orden: c.orden }).eq(clave, c.item[clave]).select();
    }));
    var fallo = rs.filter(function (r) { return r.error || !r.data || !r.data.length; })[0];
    if (fallo) { aviso(textoError(fallo.error || { code: "42501" }), "error"); return null; }
    cambios.forEach(function (c) { c.item.orden = c.orden; });
    return nueva;
  }

  async function mover(p, delta) {
    var i = datos.productos.indexOf(p), j = i + delta;
    if (j < 0 || j >= datos.productos.length) return;
    var nueva = await reordenar("productos", "id", datos.productos, i, j);
    if (nueva) { datos.productos = nueva; dibujarProductos(); }
  }

  /* ---------- Fotos ---------- */
  function rutaDeUrl(u) {
    var base = CFG.url.replace(/\/+$/, "") + "/storage/v1/object/public/" + BUCKET + "/";
    return u && u.indexOf(base) === 0 ? decodeURIComponent(u.slice(base.length)) : null;
  }

  // Borra del almacenamiento las fotos que ya no usa ningún producto.
  async function borrarFotos(urls, exceptoId) {
    var enUso = {};
    datos.productos.forEach(function (p) {
      if (p.id !== exceptoId) urlsDe(p).forEach(function (u) { enUso[u] = true; });
    });
    var rutas = urls.filter(function (u) { return !enUso[u]; }).map(rutaDeUrl).filter(Boolean);
    if (!rutas.length) return;
    try { await db.storage.from(BUCKET).remove(rutas); } catch (e) { /* una foto huérfana no es grave */ }
  }

  function optimizarImagen(archivo) {
    return new Promise(function (ok, fallo) {
      var url = URL.createObjectURL(archivo);
      var img = new Image();
      img.onload = function () {
        URL.revokeObjectURL(url);
        var k = Math.min(1, MAX_ANCHO / img.naturalWidth, MAX_ALTO / img.naturalHeight);
        var w = Math.max(1, Math.round(img.naturalWidth * k));
        var h = Math.max(1, Math.round(img.naturalHeight * k));
        var lienzo = document.createElement("canvas");
        lienzo.width = w; lienzo.height = h;
        var ctx = lienzo.getContext("2d");
        ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);

        var calidades = [0.82, 0.72, 0.62, 0.5], n = 0;
        (function intentar(tipo) {
          lienzo.toBlob(function (b) {
            if (!b) return fallo(new Error("No se pudo procesar la imagen."));
            if (tipo === "image/webp" && b.type !== "image/webp") return intentar("image/jpeg"); // navegador sin WebP
            if (b.size > MAX_KB * 1024 && n < calidades.length - 1) { n++; return intentar(tipo); }
            ok(b);
          }, tipo, calidades[n]);
        })("image/webp");
      };
      img.onerror = function () { URL.revokeObjectURL(url); fallo(new Error("No se pudo leer la imagen.")); };
      img.src = url;
    });
  }

  function nuevoSlot(url) {
    // original: lo que había guardado · url: lo que se mantiene · blob: foto nueva sin subir
    return { original: url || "", url: url || "", blob: null, preview: "", subida: null };
  }

  function urlFinal(slot) { return slot.blob ? (slot.subida ? slot.subida.url : "") : slot.url; }

  function crearSlotUI(slot) {
    var el = document.createElement("div");
    el.className = "foto";
    el.innerHTML =
      '<div class="foto__marco"><img alt="" hidden><span>Sin foto</span></div>' +
      '<div class="foto__botones">' +
        '<label class="btn btn--chico"><span data-etiqueta>Elegir foto</span>' +
          '<input class="sr-only" type="file" accept="image/*"></label>' +
        '<button class="btn btn--chico btn--texto" type="button" data-quitar>Quitar foto</button>' +
      "</div>";
    var img = el.querySelector("img"), vacio = el.querySelector(".foto__marco span");
    var etiqueta = el.querySelector("[data-etiqueta]"), quitar = el.querySelector("[data-quitar]");
    var input = el.querySelector("input");

    function pintar() {
      var src = slot.blob ? slot.preview : slot.url;
      img.hidden = !src; vacio.hidden = !!src; quitar.hidden = !src;
      if (src) img.src = src; else img.removeAttribute("src");
      etiqueta.textContent = src ? "Cambiar foto" : "Elegir foto";
    }

    input.addEventListener("change", async function () {
      var archivo = input.files[0];
      input.value = "";
      if (!archivo) return;
      el.classList.add("is-trabajando");
      try {
        var b = await optimizarImagen(archivo);
        if (slot.preview) URL.revokeObjectURL(slot.preview);
        slot.blob = b; slot.subida = null; slot.preview = URL.createObjectURL(b);
        pintar();
        aviso("Foto lista (" + Math.round(b.size / 1024) + " KB)");
      } catch (e) {
        aviso("No se pudo leer esa imagen. Probá con otra (JPG, PNG o WebP).", "error");
      }
      el.classList.remove("is-trabajando");
    });

    quitar.addEventListener("click", function () {
      if (slot.preview) URL.revokeObjectURL(slot.preview);
      slot.blob = null; slot.subida = null; slot.preview = ""; slot.url = "";
      pintar();
    });

    pintar();
    return el;
  }

  function nombreArchivo(nombre, color, tipo) {
    var base = slug(nombre + (color ? " " + color : "")).slice(0, 60) || "foto";
    var azar = Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
    return base + "-" + azar + (tipo === "image/jpeg" ? ".jpg" : ".webp");
  }

  async function subirSlot(slot, nombre, color) {
    if (!slot.blob || slot.subida) return;
    var ruta = nombreArchivo(nombre, color, slot.blob.type);
    var r = await db.storage.from(BUCKET).upload(ruta, slot.blob, {
      contentType: slot.blob.type, cacheControl: "31536000", upsert: false
    });
    if (r.error) throw r.error;
    slot.subida = { ruta: ruta, url: db.storage.from(BUCKET).getPublicUrl(ruta).data.publicUrl };
  }

  /* ---------- Formulario de producto ---------- */
  function abrirProducto(id) {
    if (!datos.categorias.length) {
      aviso("Primero creá al menos una categoría.", "error");
      irATab("ajustes");
      return;
    }
    var p = id == null ? null : datos.productos.filter(function (x) { return x.id === id; })[0];
    form = {
      id: p ? p.id : null,
      original: p ? urlsDe(p) : [],
      slotFoto: nuevoSlot(p && p.foto),
      colores: ((p && p.colores) || []).map(function (c) {
        return { nombre: c.nombre || "", hex: c.hex || "#E9D6B5", slot: nuevoSlot(c.foto) };
      })
    };

    $("dlg-titulo").textContent = p ? "Editar producto" : "Nuevo producto";
    $("p-nombre").value = p ? p.nombre : "";
    $("p-descripcion").value = p ? p.descripcion : "";
    $("p-precio").value = p ? p.precio : "";
    $("p-nuevo").checked = p ? !!p.nuevo : false;
    $("p-agotado").checked = p ? !!p.agotado : false;
    $("p-visible").checked = p ? !!p.visible : true;
    $("p-eliminar").hidden = !p;

    $("p-categoria").innerHTML = datos.categorias.map(function (c) {
      return '<option value="' + esc(c.nombre) + '">' + esc(c.nombre) + "</option>";
    }).join("");
    if (p) $("p-categoria").value = p.categoria;

    var marcados = (p && p.talles) || [];
    var talles = datos.talles.map(function (t) { return t.nombre; });
    marcados.forEach(function (t) { if (talles.indexOf(t) === -1) talles.push(t); });
    $("p-talles").innerHTML = talles.length ? talles.map(function (t) {
      return '<label><input type="checkbox" value="' + esc(t) + '"' + (marcados.indexOf(t) !== -1 ? " checked" : "") +
        "><span>" + esc(t) + "</span></label>";
    }).join("") : '<p class="ayuda">Todavía no hay talles. Agregalos en “Categorías y talles”.</p>';

    var cont = $("p-foto");
    cont.innerHTML = "";
    cont.appendChild(crearSlotUI(form.slotFoto));
    dibujarColores();

    $("dlg-producto").showModal();
    $("p-nombre").focus();
  }

  function dibujarColores() {
    var cont = $("p-colores");
    cont.innerHTML = "";
    // Con colores, cada uno trae su foto y la principal se toma del primero.
    $("p-foto").closest("fieldset").hidden = form.colores.length > 0;
    form.colores.forEach(function (c, i) {
      var fila = document.createElement("div");
      fila.className = "color";
      fila.innerHTML =
        '<input type="color" aria-label="Tono del color">' +
        '<label class="campo"><span class="sr-only">Nombre del color</span>' +
          '<input type="text" maxlength="40" placeholder="Nombre del color (ej: Rosa)"></label>';
      var selector = fila.querySelector('input[type="color"]');
      var nombre = fila.querySelector('input[type="text"]');
      selector.value = /^#[0-9a-f]{6}$/i.test(c.hex) ? c.hex : "#E9D6B5";
      c.hex = selector.value;
      nombre.value = c.nombre;
      selector.addEventListener("input", function () { c.hex = selector.value; });
      nombre.addEventListener("input", function () { c.nombre = nombre.value; });
      fila.appendChild(crearSlotUI(c.slot));
      var quitar = document.createElement("button");
      quitar.type = "button";
      quitar.className = "btn btn--chico btn--texto color__quitar";
      quitar.textContent = "Quitar este color";
      quitar.addEventListener("click", function () { form.colores.splice(i, 1); dibujarColores(); });
      fila.appendChild(quitar);
      cont.appendChild(fila);
    });
  }

  $("p-agregar-color").addEventListener("click", function () {
    form.colores.push({ nombre: "", hex: "#E9D6B5", slot: nuevoSlot("") });
    dibujarColores();
    var campos = $("p-colores").querySelectorAll('input[type="text"]');
    campos[campos.length - 1].focus();
  });

  function cerrarProducto() { $("dlg-producto").close(); form = null; }
  $("p-cerrar").addEventListener("click", cerrarProducto);
  $("p-cancelar").addEventListener("click", cerrarProducto);
  $("dlg-producto").addEventListener("cancel", function () { form = null; });

  function invalido(mensaje, campo) {
    aviso(mensaje, "error");
    if (campo) campo.focus();
    return false;
  }

  function validar() {
    if (!$("p-nombre").value.trim()) return invalido("Escribí el nombre del producto.", $("p-nombre"));
    var precio = Number($("p-precio").value);
    if ($("p-precio").value === "" || !isFinite(precio) || precio < 0) return invalido("Escribí un precio válido.", $("p-precio"));
    if (!$("p-categoria").value) return invalido("Elegí una categoría.", $("p-categoria"));

    var vistos = {};
    for (var i = 0; i < form.colores.length; i++) {
      var n = form.colores[i].nombre.trim();
      if (!n) return invalido("Cada color necesita un nombre. Completalo o quitá el color.");
      if (vistos[n.toLowerCase()]) return invalido("El color “" + n + "” está repetido.");
      vistos[n.toLowerCase()] = true;
    }
    if (form.colores.length) {
      for (var k = 0; k < form.colores.length; k++) {
        if (!urlFinalOPendiente(form.colores[k].slot)) {
          return invalido("Falta la foto del color “" + form.colores[k].nombre.trim() + "”.");
        }
      }
    } else if (!urlFinalOPendiente(form.slotFoto)) {
      return invalido("Agregá una foto del producto.");
    }
    return true;
  }

  function urlFinalOPendiente(slot) { return slot.blob ? true : !!slot.url; }

  $("form-producto").addEventListener("submit", async function (e) {
    e.preventDefault();
    if (!form || !validar()) return;

    var btn = $("p-guardar");
    btn.disabled = true; btn.textContent = "Guardando…";
    var nombre = $("p-nombre").value.trim();
    var f = form;
    var slots = f.colores.length
      ? f.colores.map(function (c) { return { slot: c.slot, color: c.nombre.trim() }; })
      : [{ slot: f.slotFoto, color: "" }];

    try {
      for (var i = 0; i < slots.length; i++) await subirSlot(slots[i].slot, nombre, slots[i].color);

      var colores = f.colores.map(function (c) {
        return { nombre: c.nombre.trim(), hex: c.hex, foto: urlFinal(c.slot) };
      });
      var foto = colores.length ? colores[0].foto : urlFinal(f.slotFoto);
      var talles = Array.prototype.map.call($("p-talles").querySelectorAll("input:checked"), function (x) { return x.value; });

      var fila = {
        nombre: nombre,
        descripcion: $("p-descripcion").value.trim(),
        precio: Math.round(Number($("p-precio").value)),
        categoria: $("p-categoria").value,
        talles: talles,
        foto: foto,
        colores: colores,
        nuevo: $("p-nuevo").checked,
        agotado: $("p-agotado").checked,
        visible: $("p-visible").checked
      };

      var r;
      if (f.id == null) {
        // Los productos nuevos aparecen primero en el catálogo.
        var primero = datos.productos.length ? datos.productos[0].orden : 0;
        fila.orden = primero - 10;
        r = await db.from("productos").insert(fila).select().single();
      } else {
        r = await db.from("productos").update(fila).eq("id", f.id).select().single();
      }
      if (r.error) throw r.error;

      if (f.id == null) datos.productos.unshift(r.data);
      else datos.productos = datos.productos.map(function (p) { return p.id === f.id ? r.data : p; });

      // Fotos reemplazadas o quitadas: se borran del almacenamiento.
      var finales = urlsDe(r.data);
      await borrarFotos(f.original.filter(function (u) { return finales.indexOf(u) === -1; }), r.data.id);

      cerrarProducto();
      dibujarProductos();
      aviso(f.id == null ? "Producto creado" : "Cambios guardados");
    } catch (err) {
      // Si algo falló, se deshacen las fotos que ya se habían subido.
      var subidas = slots.filter(function (s) { return s.slot.subida; });
      if (subidas.length) {
        try { await db.storage.from(BUCKET).remove(subidas.map(function (s) { return s.slot.subida.ruta; })); } catch (x) { /* nada */ }
        subidas.forEach(function (s) { s.slot.subida = null; });
      }
      aviso(textoError(err), "error");
    } finally {
      btn.disabled = false; btn.textContent = "Guardar";
    }
  });

  $("p-eliminar").addEventListener("click", async function () {
    if (!form || form.id == null) return;
    var p = datos.productos.filter(function (x) { return x.id === form.id; })[0];
    if (!p || !confirm("¿Eliminar “" + p.nombre + "”? Se borran también sus fotos y no se puede deshacer.")) return;
    var r = await db.from("productos").delete().eq("id", p.id).select();
    if (r.error || !r.data || !r.data.length) { aviso(textoError(r.error || { code: "42501" }), "error"); return; }
    datos.productos = datos.productos.filter(function (x) { return x.id !== p.id; });
    await borrarFotos(urlsDe(p), p.id);
    cerrarProducto();
    dibujarProductos();
    aviso("Producto eliminado");
  });

  /* ---------- Categorías y talles ---------- */
  function dibujarAjustes() {
    dibujarFilas("categorias", $("lista-categorias"), true);
    dibujarFilas("talles", $("lista-talles"), false);
  }

  function usosDe(tabla, nombre) {
    return datos.productos.filter(function (p) {
      return tabla === "categorias" ? p.categoria === nombre : (p.talles || []).indexOf(nombre) !== -1;
    }).length;
  }

  function dibujarFilas(tabla, ul, renombrable) {
    var lista = datos[tabla];
    ul.innerHTML = lista.length ? lista.map(function (item, i) {
      var usos = usosDe(tabla, item.nombre);
      return '<li data-nombre="' + esc(item.nombre) + '">' +
        (renombrable
          ? '<input type="text" maxlength="30" value="' + esc(item.nombre) + '" aria-label="Nombre de la categoría ' + esc(item.nombre) + '" data-accion="renombrar">'
          : '<span class="nombre-fijo">' + esc(item.nombre) + "</span>") +
        '<span class="usos">' + usos + (usos === 1 ? " producto" : " productos") + "</span>" +
        '<button class="icono" type="button" data-accion="subir" aria-label="Subir"' + (i === 0 ? " disabled" : "") + ">" + ICONO_ARRIBA + "</button>" +
        '<button class="icono" type="button" data-accion="bajar" aria-label="Bajar"' + (i === lista.length - 1 ? " disabled" : "") + ">" + ICONO_ABAJO + "</button>" +
        '<button class="icono icono--peligro" type="button" data-accion="borrar" aria-label="Eliminar ' + esc(item.nombre) + '">' + ICONO_BORRAR + "</button>" +
        "</li>";
    }).join("") : '<li><span class="nombre-fijo">Todavía no hay ninguno.</span></li>';
  }

  function manejarFilas(tabla) {
    return async function (e) {
      var boton = e.target.closest("button[data-accion]");
      if (!boton) return;
      var li = boton.closest("li");
      var nombre = li.getAttribute("data-nombre");
      var lista = datos[tabla];
      var i = lista.map(function (x) { return x.nombre; }).indexOf(nombre);
      var accion = boton.getAttribute("data-accion");

      if (accion === "subir" || accion === "bajar") {
        var j = i + (accion === "subir" ? -1 : 1);
        if (j < 0 || j >= lista.length) return;
        var nueva = await reordenar(tabla, "nombre", lista, i, j);
        if (nueva) { datos[tabla] = nueva; dibujarAjustes(); }
      } else if (accion === "borrar") {
        var usos = usosDe(tabla, nombre);
        if (tabla === "categorias" && usos) {
          aviso("“" + nombre + "” tiene " + usos + (usos === 1 ? " producto" : " productos") + ". Pasalos a otra categoría antes de eliminarla.", "error");
          return;
        }
        var aviso2 = tabla === "talles" && usos ? "\n\nLo usan " + usos + " productos: seguirán mostrándolo, pero ya no podrás tildarlo." : "";
        if (!confirm("¿Eliminar “" + nombre + "”?" + aviso2)) return;
        var r = await db.from(tabla).delete().eq("nombre", nombre).select();
        if (r.error || !r.data || !r.data.length) { aviso(textoError(r.error || { code: "42501" }), "error"); return; }
        datos[tabla] = lista.filter(function (x) { return x.nombre !== nombre; });
        dibujarAjustes();
        aviso("Eliminado");
      }
    };
  }

  $("lista-categorias").addEventListener("click", manejarFilas("categorias"));
  $("lista-talles").addEventListener("click", manejarFilas("talles"));

  // Renombrar categoría: se guarda al salir del campo o con Enter.
  $("lista-categorias").addEventListener("change", async function (e) {
    var campo = e.target.closest('input[data-accion="renombrar"]');
    if (!campo) return;
    var viejo = campo.closest("li").getAttribute("data-nombre");
    var nuevo = campo.value.trim();
    if (!nuevo || nuevo === viejo) { campo.value = viejo; return; }
    var r = await db.from("categorias").update({ nombre: nuevo }).eq("nombre", viejo).select();
    if (r.error || !r.data || !r.data.length) {
      aviso(textoError(r.error || { code: "42501" }), "error");
      campo.value = viejo;
      return;
    }
    datos.categorias.forEach(function (c) { if (c.nombre === viejo) c.nombre = nuevo; });
    datos.productos.forEach(function (p) { if (p.categoria === viejo) p.categoria = nuevo; });
    dibujarAjustes();
    dibujarProductos();
    aviso("Categoría renombrada");
  });
  $("lista-categorias").addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.target.matches('input[data-accion="renombrar"]')) { e.preventDefault(); e.target.blur(); }
  });

  function agregarA(tabla, idCampo) {
    return async function (e) {
      e.preventDefault();
      var campo = $(idCampo), nombre = campo.value.trim();
      if (!nombre) return;
      var existe = datos[tabla].some(function (x) { return x.nombre.toLowerCase() === nombre.toLowerCase(); });
      if (existe) { aviso("“" + nombre + "” ya existe.", "error"); return; }
      var ultimo = datos[tabla].length ? datos[tabla][datos[tabla].length - 1].orden : -10;
      var r = await db.from(tabla).insert({ nombre: nombre, orden: ultimo + 10 }).select().single();
      if (r.error) { aviso(textoError(r.error), "error"); return; }
      datos[tabla].push(r.data);
      campo.value = "";
      dibujarAjustes();
      aviso("Agregado");
    };
  }
  $("form-categoria").addEventListener("submit", agregarA("categorias", "categoria-nueva"));
  $("form-talle").addEventListener("submit", agregarA("talles", "talle-nuevo"));

  /* ---------- Importar el catálogo actual ---------- */
  var TIPOS = { webp: "image/webp", jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png" };

  async function enLote(items, cuantos, fn) {
    var i = 0;
    async function trabajador() {
      while (i < items.length) { var k = i++; await fn(items[k], k); }
    }
    var hilos = [];
    for (var n = 0; n < Math.min(cuantos, items.length); n++) hilos.push(trabajador());
    await Promise.all(hilos);
  }

  $("importar-boton").addEventListener("click", async function () {
    var base = window.OKISA;
    if (!base || !base.PRODUCTOS || !base.PRODUCTOS.length) return;
    var boton = $("importar-boton"), prog = $("importar-progreso"), barra = $("importar-barra"), texto = $("importar-texto");
    boton.disabled = true; prog.hidden = false;
    function progreso(pct, msg) { barra.style.width = pct + "%"; texto.textContent = msg; }

    try {
      // 1. Categorías y talles (incluye las que usan los productos aunque falten en la lista)
      progreso(2, "Preparando categorías y talles…");
      var cats = (base.CATEGORIAS || []).slice(), tals = (base.TALLES || []).slice();
      base.PRODUCTOS.forEach(function (p) {
        if (cats.indexOf(p.categoria) === -1) cats.push(p.categoria);
        (p.talles || []).forEach(function (t) { if (tals.indexOf(t) === -1) tals.push(t); });
      });
      var r1 = await db.from("categorias").upsert(cats.map(function (n, i) { return { nombre: n, orden: i * 10 }; }), { onConflict: "nombre" });
      if (r1.error) throw r1.error;
      var r2 = await db.from("talles").upsert(tals.map(function (n, i) { return { nombre: n, orden: i * 10 }; }), { onConflict: "nombre" });
      if (r2.error) throw r2.error;

      // 2. Fotos
      var rutas = [];
      base.PRODUCTOS.forEach(function (p) {
        [p.foto].concat((p.colores || []).map(function (c) { return c.foto; })).forEach(function (r) {
          if (r && rutas.indexOf(r) === -1) rutas.push(r);
        });
      });
      var mapa = {}, hechas = 0;
      await enLote(rutas, 4, async function (ruta) {
        var resp = await fetch(ruta);
        if (!resp.ok) throw new Error("No se encontró la foto " + ruta + ". Abrí el panel desde el sitio publicado, no desde un archivo local.");
        var blob = await resp.blob();
        var nombre = ruta.split("/").pop().replace(/[^A-Za-z0-9._-]/g, "-");
        var tipo = TIPOS[nombre.split(".").pop().toLowerCase()] || blob.type;
        var up = await db.storage.from(BUCKET).upload(nombre, blob, { contentType: tipo, cacheControl: "31536000", upsert: true });
        if (up.error) throw up.error;
        mapa[ruta] = db.storage.from(BUCKET).getPublicUrl(nombre).data.publicUrl;
        hechas++;
        progreso(5 + Math.round(hechas / rutas.length * 85), "Subiendo fotos: " + hechas + " de " + rutas.length);
      });

      // 3. Productos (una sola operación: se cargan todos o ninguno)
      progreso(94, "Guardando productos…");
      var filas = base.PRODUCTOS.map(function (p, i) {
        return {
          nombre: p.nombre, descripcion: p.descripcion || "", precio: p.precio, categoria: p.categoria,
          talles: p.talles || [], foto: mapa[p.foto] || "",
          colores: (p.colores || []).map(function (c) { return { nombre: c.nombre, hex: c.hex, foto: mapa[c.foto] || "" }; }),
          nuevo: !!p.nuevo, agotado: !!p.agotado, visible: true, orden: i * 10
        };
      });
      var r3 = await db.from("productos").insert(filas);
      if (r3.error) throw r3.error;

      progreso(100, "Listo");
      await cargarTodo();
      aviso("Se importaron " + filas.length + " productos");
    } catch (err) {
      aviso("No se pudo importar: " + textoError(err), "error");
      boton.disabled = false;
      prog.hidden = true;
    }
  });

  iniciar();
})();
