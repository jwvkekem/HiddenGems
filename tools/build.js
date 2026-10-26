// Bouwt de site voor Netlify in dist/:
//  - app.html (de app zoals op claude.ai, ongewijzigd) + icoon, laad-animatie, snelle start en update-melding
//  - versienummer uit VERSION in de app zetten (in plaats van het nummer uit app.html)
//  - version.json (welke versie er online staat, voor de update-melding)
// Netlify draait dit automatisch (zie netlify.toml). Lokaal: node tools/build.js
const fs = require("fs");
const path = require("path");
const { gemPaths } = require("./gem");

const root = path.join(__dirname, "..");
const dist = path.join(root, "dist");
fs.rmSync(dist, { recursive: true, force: true });
fs.cpSync(path.join(root, "web"), dist, { recursive: true });

const version = fs.readFileSync(path.join(root, "VERSION"), "utf8").trim();
const build = process.env.COMMIT_REF || "local-" + Date.now();
const info = { build, version };
fs.writeFileSync(path.join(dist, "version.json"), JSON.stringify(info, null, 2));

const gem = (cls) => `<svg ${cls ? `class="${cls}" ` : ""}viewBox="0 0 100 96" aria-hidden="true">${gemPaths(2, 2, 96)}</svg>`;

let html = fs.readFileSync(path.join(root, "app.html"), "utf8");
const must = (cond, what) => { if (!cond) throw new Error("app.html heeft een onverwachte opbouw: " + what); };

// 0. Versienummer onderaan de app
must(/Prototype v[0-9.]+/.test(html), "versienummer");
html = html.replace(/Prototype v[0-9.]+/, "Prototype v" + version);

// 1. Icoon, thema-kleur en installeerbare app (in <head>)
const head = `
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icons/favicon.svg" type="image/svg+xml">
<link rel="icon" href="icons/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Hidden Gems">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="theme-color" content="#EEF1EE" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0F1614" media="(prefers-color-scheme: dark)">
<style>
#hg-loader{position:fixed;inset:0;z-index:1000;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;background:var(--bg,#EEF1EE);transition:opacity .35s ease}
#hg-loader.out{opacity:0;pointer-events:none}
#hg-loader .in{display:flex;flex-direction:column;align-items:center;gap:14px;opacity:0;animation:hgin .4s ease .15s forwards}
#hg-loader .spin{width:76px;height:73px;perspective:320px}
#hg-loader .spin svg{width:100%;height:100%;display:block;animation:hgspin 1.6s linear infinite;filter:drop-shadow(0 6px 12px rgba(185,129,31,.35))}
#hg-loader .sh{width:52px;height:7px;border-radius:50%;background:rgba(19,36,31,.16);animation:hgsh .8s linear infinite alternate}
#hg-loader b{font-family:"Young Serif",Georgia,serif;font-weight:400;font-size:22px;color:var(--ink,#13241F);margin-top:4px}
#hg-loader small{font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted,#56665F)}
@keyframes hgin{to{opacity:1}}
@keyframes hgspin{to{transform:rotateY(360deg)}}
@keyframes hgsh{from{transform:scaleX(1)}to{transform:scaleX(.3)}}
@media (prefers-reduced-motion: reduce){#hg-loader .spin svg{animation:hgpulse 1.4s ease-in-out infinite alternate}#hg-loader .sh{animation:none}@keyframes hgpulse{from{opacity:.55}to{opacity:1}}}
#hg-update{position:fixed;left:0;right:0;bottom:calc(84px + env(safe-area-inset-bottom,0px));z-index:900;display:flex;justify-content:center;padding:0 12px;pointer-events:none;opacity:0;transform:translateY(16px);transition:opacity .25s ease,transform .25s ease}
#hg-update.on{opacity:1;transform:none}
#hg-update .hgu-card{pointer-events:auto;width:100%;max-width:456px;display:flex;gap:12px;align-items:flex-start;background:var(--surface,#fff);color:var(--ink,#13241F);border:1px solid var(--line,#D3DBD6);border-radius:16px;padding:14px;box-shadow:0 10px 30px rgba(0,0,0,.18);font-family:var(--f-body,system-ui,sans-serif)}
#hg-update.on .hgu-card{pointer-events:auto}
#hg-update:not(.on) .hgu-card{pointer-events:none}
#hg-update .hgu-ic{flex:none;width:34px;height:33px}
#hg-update .hgu-ic svg{width:100%;height:100%}
#hg-update .hgu-tx{display:flex;flex-direction:column;gap:4px;min-width:0;font-size:14px;line-height:1.4}
#hg-update b{font-family:var(--f-display,Georgia,serif);font-weight:400;font-size:17px}
#hg-update b small{font-family:var(--f-mono,ui-monospace,monospace);font-size:12px;color:var(--muted,#56665F);margin-left:4px}
#hg-update .hgu-bt{display:flex;gap:8px;margin-top:6px}
#hg-update button{border-radius:999px;padding:8px 16px;font:inherit;font-weight:600;font-size:14px;min-height:38px;cursor:pointer}
#hg-update .hgu-r{background:var(--gold,#B9811F);color:#1b1407;border:0}
#hg-update .hgu-l{background:none;border:1px solid var(--line,#D3DBD6);color:var(--ink,#13241F)}
</style>
`;
must(html.split("</head>").length === 2, "</head>");
html = html.replace("</head>", head + "</head>");

// 2. Laad-animatie: direct zichtbaar, vóór de grote blok gegevens die eerst moet binnenkomen
const loader = `<div id="hg-loader" role="status" aria-label="Hidden Gems Dordrecht"><div class="in"><div class="spin">${gem()}</div><div class="sh"></div><b>Hidden Gems</b><small>Dordrecht</small></div></div>\n`;
const fb = html.indexOf("<script>window.HG_FALLBACK=");
must(fb > 0, "HG_FALLBACK");
html = html.slice(0, fb) + loader + html.slice(fb);

// 3. Snelle start: buiten claude.ai meteen de ingebouwde gegevens gebruiken (anders 3 s wachten)
const fbEnd = html.indexOf("</script>", html.indexOf("<script>window.HG_FALLBACK=")) + "</script>".length;
must(fbEnd > fb, "einde HG_FALLBACK");
const boot = `\n<script>window.HG_SNAPSHOT=window.HG_FALLBACK;window.HG_BUILD=${JSON.stringify(info)};window.HG_GEM=${JSON.stringify(gem())};</script>`;
html = html.slice(0, fbEnd) + boot + html.slice(fbEnd);

// 4. Laad-animatie weghalen zodra de app er staat, en de update-melding starten
const tail = `
<script>(function(){var l=document.getElementById("hg-loader");if(!l)return;function hide(){l.classList.add("out");setTimeout(function(){l.remove()},400)}requestAnimationFrame(function(){requestAnimationFrame(hide)});})();</script>
<script src="update.js" defer></script>
`;
must(html.lastIndexOf("</body>") > 0, "</body>");
const bi = html.lastIndexOf("</body>");
html = html.slice(0, bi) + tail + html.slice(bi);

fs.writeFileSync(path.join(dist, "index.html"), html);
console.log("Klaar: dist/ (v" + version + ", " + build + ")");
