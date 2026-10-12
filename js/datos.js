/* ==========================================================
   OKISA · Carga de datos
   1) Pide productos, categorías y talles a Supabase.
   2) Si falla (sin internet, proyecto pausado...), usa la última
      copia guardada en el navegador.
   3) Si tampoco hay copia, usa data/productos.js.
   ========================================================== */
(function () {
  "use strict";

  var CFG = window.OKISA_SUPABASE || {};
  var CLAVE_COPIA = "okisa-catalogo-copia-v1";
  var ESPERA_MS = 8000;

  function configurado() {
    return !!(CFG.url && CFG.anonKey &&
      CFG.url.indexOf("TU-PROYECTO") === -1 && CFG.anonKey.indexOf("TU_ANON_KEY") === -1);
  }

  function pedir(ruta) {
    var control = typeof AbortController === "function" ? new AbortController() : null;
    var timer = control ? setTimeout(function () { control.abort(); }, ESPERA_MS) : null;
    return fetch(CFG.url.replace(/\/+$/, "") + "/rest/v1/" + ruta, {
      headers: { apikey: CFG.anonKey },
      signal: control ? control.signal : undefined
    }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    }).then(function (datos) {
      if (timer) clearTimeout(timer);
      return datos;
    }, function (e) {
      if (timer) clearTimeout(timer);
      throw e;
    });
  }

  function normalizarProducto(p) {
    return {
      id: p.id,
      nombre: p.nombre || "",
      descripcion: p.descripcion || "",
      precio: Number(p.precio) || 0,
      categoria: p.categoria,
      talles: Array.isArray(p.talles) ? p.talles : [],
      foto: p.foto || "",
      colores: Array.isArray(p.colores) ? p.colores : [],
      nuevo: !!p.nuevo,
      agotado: !!p.agotado
    };
  }

  function armar(base, productos, categorias, talles) {
    return {
      CONFIG: base.CONFIG,
      CATEGORIAS: categorias.map(function (c) { return c.nombre; }),
      TALLES: talles.map(function (t) { return t.nombre; }),
      PRODUCTOS: productos.map(normalizarProducto)
    };
  }

  function guardarCopia(crudo) {
    try { localStorage.setItem(CLAVE_COPIA, JSON.stringify(crudo)); } catch (e) { /* sin espacio o bloqueado */ }
  }

  function leerCopia() {
    try {
      var c = JSON.parse(localStorage.getItem(CLAVE_COPIA) || "null");
      if (c && Array.isArray(c.productos) && Array.isArray(c.categorias) && Array.isArray(c.talles)) return c;
    } catch (e) { /* copia dañada: se ignora */ }
    return null;
  }

  // Devuelve una promesa con { datos, origen } donde origen es "base", "copia" o "archivo".
  function cargar(base) {
    if (!configurado()) return Promise.resolve({ datos: base, origen: "archivo" });

    return Promise.all([
      pedir("productos?select=*&visible=eq.true&order=orden.asc,id.asc"),
      pedir("categorias?select=nombre&order=orden.asc,nombre.asc"),
      pedir("talles?select=nombre&order=orden.asc,nombre.asc")
    ]).then(function (r) {
      var crudo = { productos: r[0], categorias: r[1], talles: r[2] };
      // Base todavía sin configurar (sin productos ni categorías): se usa el archivo.
      if (!crudo.productos.length && !crudo.categorias.length) {
        return { datos: base, origen: "archivo" };
      }
      guardarCopia(crudo);
      return { datos: armar(base, crudo.productos, crudo.categorias, crudo.talles), origen: "base" };
    }).catch(function (e) {
      if (window.console) console.warn("Okisa: no se pudo leer Supabase.", e);
      var copia = leerCopia();
      if (copia) return { datos: armar(base, copia.productos, copia.categorias, copia.talles), origen: "copia" };
      return { datos: base, origen: "archivo" };
    });
  }

  window.OkisaDatos = { cargar: cargar, configurado: configurado };
})();
