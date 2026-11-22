// Static port of the dashboard's Maps viewer.
// Same map options, layer ids, clustering and paint as the app. The differences:
// collars come from static files in ./data/ (no API), the basemap is
// OpenStreetMap, and clicking a collar shows its source and position only.
(function () {
  "use strict";

  var SOURCES = {
    nsw: { file: "data/collars-nsw.bin", label: "AUS — GSNSW (DIGS)", name: "Geological Survey of NSW (DIGS), open file" },
    wa: { file: "data/collars-wa.bin", label: "AUS — WAMEX", name: "Geological Survey of WA (WAMEX), open file" },
  };
  var BOUNDS = {
    all: [[112, -39.5], [154, -10]],
    wa: [[112, -36], [129, -13]],
    nsw: [[140.9, -37.6], [153.7, -28.1]],
  };
  var LABEL = { all: "ALL", wa: SOURCES.wa.label, nsw: SOURCES.nsw.label };

  var countEl = document.getElementById("collar-count");
  var labelEl = document.getElementById("source-label");
  var hintEl = document.getElementById("collar-hint");
  var select = document.getElementById("maps-source");
  select.disabled = true;

  // Base URL of this page's folder, so glyph and data paths stay relative to wherever it is hosted.
  var here = location.href.split("#")[0].split("?")[0].replace(/[^/]*$/, "");

  // "CLR1", uint32 count, then zigzag-varint deltas of (x, y) in 1e-5 degrees.
  function decode(buf) {
    var b = new Uint8Array(buf);
    if (b[0] !== 67 || b[1] !== 76 || b[2] !== 82 || b[3] !== 49) throw new Error("bad collar file");
    var n = new DataView(buf).getUint32(4, true);
    var xs = new Float64Array(n), ys = new Float64Array(n);
    var i = 8, x = 0, y = 0;
    function next() {
      var v = 0, mul = 1, byte;
      do { byte = b[i++]; v += (byte & 0x7f) * mul; mul *= 128; } while (byte & 0x80);
      return (v % 2 === 0) ? v / 2 : -(v + 1) / 2;
    }
    for (var k = 0; k < n; k++) { x += next(); y += next(); xs[k] = x / 1e5; ys[k] = y / 1e5; }
    return { xs: xs, ys: ys, n: n };
  }

  // GeoJSON text for one or both sources, handed to the map worker as a local blob: URL
  // so the page itself never holds hundreds of thousands of feature objects.
  var urls = {};
  function urlFor(key) {
    if (urls[key]) return urls[key];
    var keys = key === "all" ? ["nsw", "wa"] : [key], parts = ['{"type":"FeatureCollection","features":['], first = true;
    keys.forEach(function (k) {
      var d = data[k], code = k === "wa" ? 1 : 0, chunk = [];
      for (var i = 0; i < d.n; i++) {
        chunk.push('{"type":"Feature","geometry":{"type":"Point","coordinates":[' + d.xs[i] + "," + d.ys[i] + ']},"properties":{"s":' + code + "}}");
        if (chunk.length === 20000) { parts.push((first ? "" : ",") + chunk.join(",")); first = false; chunk = []; }
      }
      if (chunk.length) { parts.push((first ? "" : ",") + chunk.join(",")); first = false; }
    });
    parts.push("]}");
    urls[key] = URL.createObjectURL(new Blob(parts, { type: "application/json" }));
    return urls[key];
  }

  var data = {}, current = "all";

  function countInView(map) {
    var b = map.getBounds(), w = b.getWest(), e = b.getEast(), s = b.getSouth(), nn = b.getNorth();
    var keys = current === "all" ? ["nsw", "wa"] : [current], total = 0;
    keys.forEach(function (key) {
      var d = data[key];
      for (var k = 0; k < d.n; k++) if (d.xs[k] >= w && d.xs[k] <= e && d.ys[k] >= s && d.ys[k] <= nn) total++;
    });
    countEl.textContent = total.toLocaleString("en-AU") + " collars in view";
    labelEl.textContent = LABEL[current];
  }

  var map = new maplibregl.Map({
    container: "map",
    bounds: BOUNDS.all,
    fitBoundsOptions: { padding: 40 },
    attributionControl: { compact: false },
    style: {
      version: 8,
      glyphs: here + "fonts/{fontstack}/{range}.pbf",
      sources: {
        osm: {
          type: "raster",
          tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
          tileSize: 256,
          maxzoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
        },
      },
      layers: [{ id: "osm", type: "raster", source: "osm" }],
    },
  });
  map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");

  var loaded = Promise.all(["nsw", "wa"].map(function (key) {
    return fetch(SOURCES[key].file).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.arrayBuffer();
    }).then(function (buf) { data[key] = decode(buf); });
  }));

  map.on("load", function () {
    loaded.then(function () {
      map.addSource("drill-collars", {
        type: "geojson",
        data: urlFor("all"),
        cluster: true,
        clusterMaxZoom: 9,
        clusterRadius: 50,
      });

      map.addLayer({
        id: "drill-clusters", type: "circle", source: "drill-collars", filter: ["has", "point_count"],
        paint: {
          "circle-color": ["step", ["get", "point_count"], "#1d4ed8", 100, "#2563eb", 500, "#0f172a"],
          "circle-radius": ["step", ["get", "point_count"], 18, 100, 22, 500, 28],
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2,
        },
      });
      map.addLayer({
        id: "drill-cluster-count", type: "symbol", source: "drill-collars", filter: ["has", "point_count"],
        layout: { "text-field": ["get", "point_count_abbreviated"], "text-font": ["Open Sans Bold"], "text-size": 12 },
        paint: { "text-color": "#ffffff" },
      });
      map.addLayer({
        id: "drill-unclustered", type: "circle", source: "drill-collars", filter: ["!", ["has", "point_count"]], minzoom: 10,
        paint: {
          "circle-radius": 5,
          // Same colours as the app: WAMEX blue (#1d4ed8); GSNSW has no entry in the app, so slate (#475569).
          "circle-color": ["match", ["get", "s"], 1, "#1d4ed8", "#475569"],
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 1.5,
          "circle-opacity": 0.9,
        },
      });

      map.on("click", "drill-clusters", function (event) {
        var feature = event.features && event.features[0];
        if (!feature) return;
        var clusterId = feature.properties && feature.properties.cluster_id;
        var src = map.getSource("drill-collars");
        if (!src || clusterId == null) return;
        src.getClusterExpansionZoom(clusterId).then(function (zoom) {
          map.easeTo({ center: feature.geometry.coordinates, zoom: zoom, duration: 600 });
        }).catch(function () {});
      });

      // A click on a collar shows its source and position only.
      map.on("click", "drill-unclustered", function (event) {
        var feature = event.features && event.features[0];
        if (!feature) return;
        var c = feature.geometry.coordinates;
        var key = feature.properties.s === 1 ? "wa" : "nsw";
        var el = document.createElement("div");
        el.className = "collar-popup";
        var b = document.createElement("b"); b.textContent = "Drill-hole collar";
        el.appendChild(b);
        el.appendChild(document.createElement("br"));
        el.appendChild(document.createTextNode(SOURCES[key].name));
        el.appendChild(document.createElement("br"));
        el.appendChild(document.createTextNode(Math.abs(c[1]).toFixed(5) + "° S, " + c[0].toFixed(5) + "° E"));
        new maplibregl.Popup({ closeButton: true, maxWidth: "280px" }).setLngLat(c).setDOMContent(el).addTo(map);
      });

      ["drill-clusters", "drill-unclustered"].forEach(function (layerId) {
        map.on("mouseenter", layerId, function () { map.getCanvas().style.cursor = "pointer"; });
        map.on("mouseleave", layerId, function () { map.getCanvas().style.cursor = ""; });
      });

      map.on("moveend", function () { countInView(map); });
      countInView(map);
      select.disabled = false;
      window.__mapsLiveReady = true;
    }).catch(function () {
      countEl.textContent = "Collar data failed to load";
      hintEl.textContent = "";
    });
  });

  select.addEventListener("change", function () {
    current = select.value;
    var src = map.getSource("drill-collars");
    if (src) src.setData(urlFor(current));
    map.fitBounds(BOUNDS[current], { padding: 40, duration: 700 });
    countInView(map);
  });

  window.__mapsLiveMap = map;
})();
