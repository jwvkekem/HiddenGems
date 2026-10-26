// Gedeelde tekening van de "gem" (geslepen edelsteen) voor icoon en laad-animatie.
// gemSvg(x, y, w) geeft de facetten van een edelsteen met breedte w op positie x,y.
function gemPaths(x, y, w) {
  const P = (px, py) => `${(x + px * w).toFixed(1)},${(y + py * w).toFixed(1)}`;
  const A = P(.2, 0), C = P(.5, 0), E = P(.8, 0);
  const G0 = P(0, .3), P1 = P(.3, .3), P3 = P(.7, .3), G4 = P(1, .3), K = P(.5, .95);
  const f = [
    [[A, G0, P1], "#F6D58A"],
    [[A, P1, C], "#FFE9B0"],
    [[C, P1, P3], "#F2C76E"],
    [[C, P3, E], "#E2B45A"],
    [[E, P3, G4], "#C98F2A"],
    [[G0, P1, K], "#D9A441"],
    [[P1, P3, K], "#B9811F"],
    [[P3, G4, K], "#8F6214"],
  ];
  const sw = (w * 0.012).toFixed(1);
  return f.map(([pts, c]) => `<polygon points="${pts.join(" ")}" fill="${c}" stroke="#FFF4D6" stroke-opacity=".55" stroke-width="${sw}" stroke-linejoin="round"/>`).join("");
}
function sparkle(cx, cy, r) {
  const k = r * 0.22;
  return `<path d="M${cx} ${cy - r} Q${cx + k} ${cy - k} ${cx + r} ${cy} Q${cx + k} ${cy + k} ${cx} ${cy + r} Q${cx - k} ${cy + k} ${cx - r} ${cy} Q${cx - k} ${cy - k} ${cx} ${cy - r}Z" fill="#FFF8EA"/>`;
}
// Volledig app-icoon (512x512). scale: aandeel van de breedte voor de gem (kleiner voor 'maskable').
function iconSvg(scale = 0.66, rounded = false) {
  const S = 512, w = S * scale, x = (S - w) / 2, h = w * 0.95, y = (S - h) / 2 + S * 0.02;
  const rx = rounded ? 112 : 0;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="${S}" height="${S}">
<defs><radialGradient id="bg" cx="50%" cy="38%" r="70%"><stop offset="0" stop-color="#2A7166"/><stop offset="1" stop-color="#16473F"/></radialGradient></defs>
<rect width="${S}" height="${S}" rx="${rx}" fill="url(#bg)"/>
<ellipse cx="${S / 2}" cy="${y + h + S * 0.035}" rx="${w * 0.36}" ry="${S * 0.022}" fill="#0B2A25" opacity=".45"/>
${gemPaths(x, y, w)}
${sparkle(x + w * 0.9, y - w * 0.04, w * 0.11)}${sparkle(x + w * 0.06, y + w * 0.52, w * 0.055)}
</svg>`;
}
module.exports = { gemPaths, iconSvg };
