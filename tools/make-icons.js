// Maakt de app-iconen in web/icons/. Alleen nodig als het icoon verandert:
//   node tools/make-icons.js   (vereist Playwright)
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const { iconSvg } = require("./gem");

const sets = [
  { dir: path.join(__dirname, "..", "web", "icons"), badge: "" },                 // live site
  { dir: path.join(__dirname, "..", "web", "icons-develop"), badge: "DEVELOP" },  // develop-site
];

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  for (const { dir: out, badge } of sets) {
  fs.mkdirSync(out, { recursive: true });
  const shot = async (svg, size, file) => {
    await p.setViewportSize({ width: size, height: size });
    await p.setContent(`<html><body style="margin:0;background:transparent">${svg.replace('width="512" height="512"', `width="${size}" height="${size}"`)}</body></html>`);
    await p.screenshot({ path: path.join(out, file), omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
  };
  await shot(iconSvg(0.66, false, badge), 180, "apple-touch-icon.png");   // iOS rondt zelf de hoeken af
  await shot(iconSvg(0.66, true, badge), 192, "icon-192.png");
  await shot(iconSvg(0.66, true, badge), 512, "icon-512.png");
  await shot(iconSvg(0.5, false, badge, true), 512, "icon-maskable-512.png");   // Android vormt zelf (cirkel, druppel, ...)
  const fav = badge ? "DEV" : "";
  await shot(iconSvg(0.7, true, fav), 32, "favicon-32.png");
  fs.writeFileSync(path.join(out, "favicon.svg"), iconSvg(0.7, true, fav));
  console.log("Iconen gemaakt in", out);
  }
  await b.close();
})();
