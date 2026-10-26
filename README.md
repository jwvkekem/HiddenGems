# Hidden Gems Dordrecht

Een app voor toeristen in Dordrecht met verborgen pareltjes: eten & drinken, zien & doen, winkelen, overnachten en events. Teksten in NL / EN / DE / FR.

## Wat zit erin
- `app.html` – de app zoals op claude.ai (HTML, CSS en JavaScript in één bestand, met een ingebouwde kopie van de gegevens). **Niet met de hand aanpassen**: bij een nieuwe versie van claude.ai vervang je alleen dit bestand.
- `web/` – extra's voor de website: app-icoon (`icons/`), `manifest.webmanifest` (installeren op het startscherm) en `update.js` (melding bij een nieuwe versie).
- `VERSION` – het versienummer van de website (bijv. `0.9`). Verhoog dit bij een update; het verschijnt onderaan de app en in de update-melding.
- `tools/build.js` – maakt de site in `dist/`: zet het versienummer uit `VERSION` in de app en voegt icoon, laad-animatie (draaiende gem), snelle start en update-melding aan `app.html` toe. Netlify draait dit automatisch.
- `tools/make-icons.js` – maakt de iconen opnieuw (alleen nodig als het icoon verandert; vereist Playwright).

## Zo werkt het
- **Op claude.ai (ingelogd):** de app leest en bewaart de gegevens live en heeft een Beheer-scherm.
- **Op de website (Netlify):** de app start meteen met de ingebouwde kopie van de gegevens. Bekijken, zoeken, filteren, de planner en de cruise-route werken; Beheer is hier niet beschikbaar.
- **Update-melding:** de site kijkt bij openen, bij terugkeren naar de app en elke 5 minuten of er een nieuwere versie online staat. Zo ja, dan verschijnt een melding met "Verversen".

## Lokaal bekijken
`node tools/build.js` en open daarna `dist/index.html`, of start een webserver in `dist/`.

## Publiceren via Netlify
Netlify draait `node tools/build.js` en publiceert `dist/` (zie `netlify.toml`). Elke push naar `main` gaat live.

## Develop-omgeving
- Branch `develop` wordt door Netlify apart gepubliceerd op `https://develop--hiddengemsdordrecht.netlify.app`.
- Werkwijze: wijzigingen eerst naar `develop`, testen op het develop-adres, daarna via een pull request van `develop` naar `main` live zetten.
