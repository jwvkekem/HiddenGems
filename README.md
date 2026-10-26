# Hidden Gems Dordrecht

Een app voor toeristen in Dordrecht met verborgen pareltjes: eten & drinken, zien & doen, winkelen, overnachten en events. Teksten in NL / EN / DE / FR.

## Wat zit erin
- `index.html` – de complete app in één bestand (HTML, CSS en JavaScript), inclusief een ingebouwde kopie van de gegevens (zaken, events, kenmerken en foto's).

## Zo werkt het
- **Op claude.ai (ingelogd):** de app leest en bewaart de gegevens live en heeft een Beheer-scherm.
- **Buiten claude.ai (bijv. GitHub Pages of lokaal openen):** de app toont de ingebouwde kopie van de gegevens. Bekijken, zoeken, filteren, de planner en de cruise-route werken; wijzigingen in Beheer worden hier niet opgeslagen.

## Lokaal bekijken
Open `index.html` in een browser.

## Online zetten met GitHub Pages
Repository → Settings → Pages → "Deploy from a branch" → branch `main`, map `/ (root)`.

## Publiceren via Netlify
Netlify → Add new site → Import an existing project → GitHub → `jwvkekem/HiddenGems`. Geen build-commando nodig; publicatiemap is de hoofdmap (staat in `netlify.toml`). Elke push naar `main` zet automatisch een nieuwe versie online.

## Develop-omgeving
- Branch `develop` wordt door Netlify apart gepubliceerd op `https://develop--hiddengemsdordrecht.netlify.app`.
- Werkwijze: wijzigingen eerst naar `develop`, testen op het develop-adres, daarna via een pull request van `develop` naar `main` live zetten.
