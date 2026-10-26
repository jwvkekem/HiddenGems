/* Hidden Gems – update-melding.
   Kijkt regelmatig of er een nieuwe versie online staat (version.json) en toont dan een melding
   met wat er nieuw is en een knop om te verversen. */
(function () {
  "use strict";
  var CUR = window.HG_BUILD || {};
  if (!CUR.build) return;
  var TXT = {
    nl: { t: "Nieuwe versie beschikbaar", b: "Ververs om de nieuwste versie te zien.", n: "Nieuw:", r: "Verversen", l: "Later" },
    en: { t: "New version available", b: "Refresh to see the latest version.", n: "What's new:", r: "Refresh", l: "Later" },
    de: { t: "Neue Version verfügbar", b: "Aktualisieren Sie, um die neueste Version zu sehen.", n: "Neu:", r: "Aktualisieren", l: "Später" },
    fr: { t: "Nouvelle version disponible", b: "Actualisez pour voir la dernière version.", n: "Nouveautés :", r: "Actualiser", l: "Plus tard" }
  };
  function lang() { var l = (document.documentElement.lang || "en").slice(0, 2); return TXT[l] ? l : "en"; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var dismissed = null, shown = null, busy = false;

  function show(v) {
    if (shown === v.build) return;
    shown = v.build;
    var L = lang(), T = TXT[L];
    var newNotes = v.notes && v.notes.id && v.notes.id !== CUR.notesId;
    var note = newNotes ? (v.notes.text[L] || v.notes.text.en || "") : "";
    var el = document.getElementById("hg-update");
    if (!el) { el = document.createElement("div"); el.id = "hg-update"; el.setAttribute("role", "alertdialog"); el.setAttribute("aria-live", "polite"); document.body.appendChild(el); }
    el.innerHTML =
      '<div class="hgu-card"><div class="hgu-ic" aria-hidden="true">' + (window.HG_GEM || "") + '</div>' +
      '<div class="hgu-tx"><b>' + esc(T.t) + '</b>' +
      (note ? '<span><em>' + esc(T.n) + '</em> ' + esc(note) + '</span>' : '<span>' + esc(T.b) + '</span>') +
      '<div class="hgu-bt"><button type="button" class="hgu-r">' + esc(T.r) + '</button><button type="button" class="hgu-l">' + esc(T.l) + '</button></div></div></div>';
    el.querySelector(".hgu-r").onclick = function () { location.reload(); };
    el.querySelector(".hgu-l").onclick = function () { dismissed = v.build; el.classList.remove("on"); };
    requestAnimationFrame(function () { el.classList.add("on"); });
  }

  function check() {
    if (busy || !navigator.onLine) return;
    busy = true;
    fetch("version.json?t=" + Date.now(), { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (v) { if (v && v.build && v.build !== CUR.build && v.build !== dismissed) show(v); })
      .catch(function () {})
      .then(function () { busy = false; });
  }
  window.HGCheckUpdate = check;

  setTimeout(check, 4000);
  setInterval(function () { if (document.visibilityState === "visible") check(); }, 5 * 60 * 1000);
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "visible") check(); });
  window.addEventListener("online", check);
})();
