# 📝 Änderungsprotokoll (Changelog) – Umzugsvorbereitung für Hostinger

**Projekt**: Laras Tagebuch  
**Datum**: 08. November 2026  
**Ziel**: Vollständige Vorbereitung für den produktiven Betrieb auf Hostinger

---

## 1. Bereinigung & Dateisystem

- **Temporäre Scratch-Dateien entfernt**: 
  - Entwicklungsgrafiken (`bot_obj.jpg`, `crop_0.jpg` bis `crop_5.jpg`, `drawer_exact.jpg`, `item_candidate_A/B/C.jpg`, `left_obj.jpg`, `sub_0/1/2.png`, `top_obj.jpg`, `verify_*.jpg`, `diff_blocks.txt`) vollständig aus dem Projektverzeichnis bereinigt.
  - Verzeichnis `public/assets/aistudio` entfernt, um jegliche Bindung an AI-Studio-Altlasten zu eliminieren.
- **Root-Verzeichnis strukturiert**:
  - Alle Kernkonfigurationen (`package.json`, `tsconfig.json`, `vite.config.ts`, `.htaccess`, `.env.example`, `server.ts`, `server.js`) liegen sauber im Stammverzeichnis vor.

---

## 2. Audio- & Stereo-Engine

- **MP3-Konsolidierung**:
  - Alias-Dateien `track001.mp3`, `kellergewoelbe.mp3` und `tomb_raider_theme.mp3` in `public/music/` bereitgestellt, um 404-Fehler beim Raumwechsel in Croft Manor vollständig auszuschließen.
  - `StereoPlayerModal.tsx` von 60 generierten Dummy-Dateien bereinigt. Die Titelliste enthält nun exakt die 14 echten, auf dem Server liegenden Tomb Raider Soundtracks.
  - `stereoAudioService.ts` Mood-Mapping an die 14 verifizierten Titel angepasst (`abenteuer`, `spannung`, `ruhe`).

---

## 3. Server- & Backend-Konfiguration

- **Robuster ZIP-Download**:
  - Endpunkt `/download-hostinger-zip`, `/lara_tagebuch_hostinger_webspace.zip` und `/lara_tagebuch_website.zip` erweitert: Sucht sequentiell in `exports/`, `public/` und im Stammverzeichnis, sodass der Download im UI immer zuverlässig funktioniert.
- **Port- & Host-Bindung**:
  - Express hört zuverlässig auf `0.0.0.0` und respektiert `process.env.PORT`.
- **Produktions-Build-Pipelines**:
  - `package.json` Scripts geprüft und verifiziert (`npm run build`, `npm run postbuild`, `npm start`, `npm run lint`).
  - `server.js` mittels esbuild neu kompiliert.

---

## 4. Webspace- & Apache-Kompatibilität (`public_html`)

- **`.htaccess` optimiert**:
  - Rewrite-Regeln für Single Page Application (SPA) Fallback eingerichtet.
  - MIME-Types für `.mp3`, `.webp`, `.json` und Web-Fonts hinzugefügt.
  - Browser-Caching-Direktiven für schnelle Ladezeiten auf Hostinger integriert.
- **`index.php` Fallback**:
  - Im Ordner `public/` und `dist/` bereitgestellt, damit Hostinger-Installationen, die standardmäßig `index.php` vor `index.html` ansteuern, transparent auf `index.html` weiterleiten.

---

## 5. Dokumentation & Export

- **`README.md`**: Umfassende deutsche Anleitung für Hostinger mit Schritt-für-Schritt-Anleitung für Dateimanager und Node.js, Domain, SSL und Fehlerbehebung.
- **`HOSTINGER_SETUP.md`**: Aktualisiert mit Hinweisen zum Umgehen des inkompatiblen CMS-Migrationsassistenten zugunsten des direkten ZIP-Uploads.
- **`TESTPROTOKOLL.md`**: Vollständige Dokumentation aller Testläufe.
- **ZIP-Exportpakete**: Neu generiert und aktuell verpackt.
