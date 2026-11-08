# 📖 Laras Tagebuch – Expeditions- & Reise-Archiv

> **Vollständig vorbereitetes Produktions- & Exportpaket für den Betrieb auf Hostinger**  
> Ein eigenständiges historisches Archiv- und Tagebuch-Projekt im klassischen Tomb Raider (1996) Stil mit Croft Manor Rundgang, interaktiver Weltkarte, Pergament-Tagebuch, Stereoanlage & atmosphärischem Soundtrack.

---

## 🧭 Inhaltsverzeichnis

1. [Übersicht & Systemarchitektur](#-übersicht--systemarchitektur)
2. [Hosting-Optionen auf Hostinger](#-hosting-optionen-auf-hostinger)
   - [Option A: Webspace / Shared Hosting (public_html) – Schnell & Einfach](#option-a-webspace--shared-hosting-public_html--empfohlen-für-sofortigen-start)
   - [Option B: Node.js Hosting / VPS – Full-Stack](#option-b-nodejs-hosting--vps--full-stack)
3. [Systemanforderungen & Versionen](#-systemanforderungen--versionen)
4. [Befehlsübersicht (Commands)](#-befehlsübersicht-commands)
5. [Umgebungsvariablen (.env)](#-umgebungsvariablen-env)
6. [Domain- & SSL-Einrichtung](#-domain---ssl-einrichtung)
7. [Struktur der Website-Funktionen](#-struktur-der-website-funktionen)
8. [Test der Seiten & Fehlerbehebung](#-test-der-seiten--fehlerbehebung)
9. [Rollback-Hinweise & Backup-Strategie](#-rollback-hinweise--backup-strategie)

---

## 🏛 Übersicht & Systemarchitektur

- **Framework**: React 19 SPA mit Vite 8
- **Styling**: Tailwind CSS v4 & antike Serif-Schriftarten (Cinzel, Marck Script, Caveat, EB Garamond)
- **Audio-Engine**: Autarkes HTML5 Stereo-Soundsystem mit 14 echten Tomb Raider Soundtracks & Soundeffekten
- **Backend (optional für Node.js)**: Express 4 Server mit Portbindung an `0.0.0.0` und `process.env.PORT`
- **Autarkie**: 100% funktionsfähig ohne Cloud-Zwang oder AI Studio-Abhängigkeit; native Web Speech API als Sprachausgabe-Fallback

---

## 🚀 Hosting-Optionen auf Hostinger

Hostinger unterstützt zwei Wege zur Bereitstellung dieses Projekts. Wählen Sie die für Ihr Paket passende Methode:

### Option A: Webspace / Shared Hosting (`public_html`) – Empfohlen für sofortigen Start

Auf jedem normalen Hostinger Webhosting-Paket (Single, Premium, Business, Cloud) kann die Website ohne Terminal oder Node.js direkt im Dateimanager betrieben werden:

1. **Hostinger hPanel öffnen**: Melden Sie sich unter [https://hpanel.hostinger.com](https://hpanel.hostinger.com) an.
2. **Website & Dateimanager wählen**:
   - Gehen Sie im linken Menü auf **Websites** ➔ Ihre Domain auswählen ➔ **Dateien** ➔ **Dateimanager (File Manager)**.
   - Klicken Sie auf **„Dateien von [Ihre-Domain] aufrufen“**.
3. **Ordner `public_html` öffnen**:
   - Doppelklicken Sie auf den Ordner `public_html`.
   - Falls sich darin eine leere Standard-Datei wie `default.php` befindet, löschen Sie diese.
4. **ZIP-Datei hochladen & entpacken**:
   - Laden Sie die Datei **`lara_tagebuch_hostinger_webspace.zip`** hoch (oder entpacken Sie den Inhalt des Ordners `dist/`).
   - Rechtsklick auf die hochgeladene ZIP-Datei ➔ **Entpacken (Extract)** ➔ als Zielverzeichnis `.` (aktueller Ordner `public_html`) angeben.
5. **Fertig**: Rufen Sie Ihre Domain im Browser auf – die Website startet sofort!

> **Hinweis zum Apache / LiteSpeed Routing**:  
> Die beiliegende `.htaccess` sorgt dafür, dass alle Seitenaufrufe (Tagebuch, Croft Manor, Weltkarte) sowie alle MP3-Soundtracks und Schriften korrekt und ohne 404-Fehler ausgeliefert werden.

---

### Option B: Node.js Hosting / VPS – Full-Stack

Falls Sie auf Hostinger ein **Node.js-fähiges Hosting** oder einen **VPS** nutzen:

1. **Repository / Quellcode hochladen**:
   - Laden Sie den Quellcode auf den Server (z. B. nach `/var/www/laras-tagebuch` oder in Ihr Hostinger Node.js Anwendungsverzeichnis).
2. **Abhängigkeiten installieren**:
   ```bash
   npm install
   ```
3. **Produktions-Build ausführen**:
   ```bash
   npm run build
   ```
   *(Erstellt den optimierten Vite-Client in `dist/` und kompiliert den Express-Server nach `server.js`)*
4. **Produktions-Server starten**:
   ```bash
   npm start
   ```
   *(Führt `node server.js` aus)*

---

## ⚙️ Systemanforderungen & Versionen

| Komponente | Version / Anforderung |
| :--- | :--- |
| **Node.js** | Version `18.x`, `20.x` (LTS empfohlen) oder `22.x` |
| **NPM** | Version `9.x` oder `10.x` |
| **Webserver** | Apache / LiteSpeed (mit `mod_rewrite`) oder Node.js |
| **PHP (optional)** | PHP 7.4 - 8.3 (für die Fallback-Datei `index.php`) |
| **Browser** | Chrome, Firefox, Safari, Edge (Desktop & Mobil) |

---

## 💻 Befehlsübersicht (Commands)

```bash
# 1. Alle Abhängigkeiten installieren
npm install

# 2. Produktions-Build erstellen (Vite Client + esbuild Server)
npm run build

# 3. Produktions-Server starten (Verwendet PORT & 0.0.0.0)
npm start

# 4. Lokalen Entwicklungsserver starten
npm run dev

# 5. TypeScript- und Syntaxprüfung durchführen
npm run lint
```

---

## 🔐 Umgebungsvariablen (.env)

Kopieren Sie `.env.example` nach `.env`, falls Sie Umgebungsvariablen anpassen möchten:

```env
# Port für den Node.js Produktionsserver (Hostinger vergibt diesen meist automatisch)
PORT=3000

# Modus
NODE_ENV=production

# Optional: Gemini API Key für erweiterte KI-Stimme / Video-Loops
# Wenn nicht vorhanden, nutzt die App automatisch die Browser-Web-Speech-API und statische Loops
GEMINI_API_KEY=""
```

*Wichtig: In `.env.example` und im Quellcode befinden sich keinerlei geheime Passwörter oder private Daten.*

---

## 🌐 Domain- & SSL-Einrichtung

1. **Domain zuweisen**:
   - Gehen Sie im Hostinger **hPanel** auf **Websites** ➔ Ihre Domain auswählen.
   - Prüfen Sie unter **DNS / Nameserver**, dass die A-Records auf Ihre Hostinger-Server-IP zeigen.
2. **Kostenloses Let's Encrypt SSL aktivieren**:
   - Klicken Sie im hPanel auf **Sicherheit** ➔ **SSL**.
   - Aktivieren Sie das kostenlose Lifetime-SSL-Zertifikat mit einem Klick auf **Installieren**.
   - Aktivieren Sie die Option **„HTTPS erzwingen“ (Force HTTPS)**.

---

## 🗺️ Struktur der Website-Funktionen

Die Website enthält alle gewünschten Bereiche und Features:

- **Startseite (`/`)**:
  - Hero-Grafik mit Laras Schreibtisch in voller Detailtreue
  - Antiker Titelzug *„Lara´s Tagebuch“*
  - Direkter Button *„TAGEBUCH ÖFFNEN“*
  - Direkter Download-Button für das Hostinger-ZIP-Paket
- **Croft Manor (`/croft-manor`)**:
  - Interaktiver Raumrundgang: Außenansicht, Eingangshalle, Bibliothek, Arbeitszimmer von Lord Croft, Kellergewölbe/Expeditionslager, Laras Schlafgemach, Großes Wohnzimmer mit Kaminfeuer
  - Funktionierende Geheimmechanismen: Bücherregal öffnet Wandarchiv mit Goldener Maske und Schriftrolle; Schreibtisch-Geheimfach mit Chronometer & Tagebuch; Geheimgang im Keller
  - Winston Smith Easter-Egg am Weinregal mit Sound & Animation
  - Automatisches Kaminfeuer-Knistern im Wohnzimmer
- **Tagebuch (`/tagebuch`)**:
  - Klassische Pergament-Doppelseite mit Hand- bzw. Schreibmaschinenschrift
  - Blätterfunktion zwischen allen 16 Expeditions-Einträgen (Arnak, Kalkutta, Vilcabamba, Lost Valley, etc.)
  - Vorlesefunktion (Kore / Web Speech)
  - Lokaler Eintrags-Editor & Medien-Manager
- **Weltkarte (`/weltkarte`)**:
  - Globale Expeditionskarte von Peru bis Atlantis mit interaktiven Pins
- **Ruhmeshalle (`/ruhmeshalle`)**:
  - Interaktive 3D-Scion-Vitrine & 26 legendäre Relikte (Thors Hammer, Midas Hand, Dolch von Xian, u.v.m.)
- **Laras Stereoanlage & Mood-Switcher**:
  - Hi-Fi Interface mit 14 Tomb Raider MP3-Soundtracks
  - 3 Stimmungen: Abenteuer, Spannung, Ruhe
  - Lautstärkeregler für Musik und Kaminfeuer

---

## 🧪 Test der Seiten & Fehlerbehebung

### Schnelltest nach dem Upload:
1. **Startseite aufrufen**: Erscheint das Hero-Bild mit Titel und Buttons?
2. **Audio-Test**: Klick auf die Startseite oder den Stereo-Button startet die Tomb Raider Musik.
3. **Unterseiten aufrufen**: Klicken Sie auf *Croft Manor*, *Tagebuch*, *Weltkarte*, *Ruhmeshalle*.
4. **Mobiltest**: Ansicht auf Smartphone prüfen – Menü und Buttons passen sich responsive an.

### Häufige Fragen & Lösungen:

- **Problem**: Hostinger Migrations-Assistent meldet *„Nicht unterstütztes Framework“*.  
  **Lösung**: Nutzen Sie nicht den Migrations-Assistenten (dieser sucht nur nach WordPress), sondern laden Sie die Datei `lara_tagebuch_hostinger_webspace.zip` direkt im Hostinger **Dateimanager** in den Ordner `public_html` hoch und entpacken Sie sie dort.
- **Problem**: Beim Neuladen einer Unterseite erscheint 404 (Not Found).  
  **Lösung**: Stellen Sie sicher, dass die Datei `.htaccess` im Ordner `public_html` liegt (ggf. im Dateimanager „Versteckte Dateien anzeigen“ aktivieren).
- **Problem**: Musik spielt auf dem Handy nicht von selbst.  
  **Lösung**: Moderne mobile Browser (iOS/Android) blockieren Audio-Autoplay, bis der Nutzer einmal auf den Bildschirm tippt. Sobald man klickt, startet der Sound.

---

## 🔄 Rollback-Hinweise & Backup-Strategie

- **Backup erstellen**: Im Hostinger hPanel unter **Dateien** ➔ **Backups** können Sie jederzeit ein 1-Klick-Backup des `public_html`-Ordners generieren.
- **Rollback**: Sollte nach einer Änderung etwas nicht funktionieren, laden Sie einfach erneut die saubere `lara_tagebuch_hostinger_webspace.zip` hoch und entpacken Sie sie.
