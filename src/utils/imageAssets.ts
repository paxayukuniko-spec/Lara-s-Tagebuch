/**
 * Zentrale Bereitstellung aller Bild-Assets aus src/assets/images/.
 * Alle Bilddateien liegen im Ordner src/assets/images/, während im Ordner
 * src/assets/images/musik/ die 9 MP3-Dateien (track001.mp3 bis track009.mp3) liegen.
 */

// Direkte Vite-Asset-Imports aus src/assets/images/
import anchKreuz from '../assets/images/anch-kreuz.jpg';
import appIconRound from '../assets/images/app-icon-round.png';
import atlasKugel from '../assets/images/atlas.kugel.jpg';
import augeDesHorus from '../assets/images/auge-des-horus.jpg';
import bibliotek from '../assets/images/bibliotek.jpg';
import bibliothekOffen from '../assets/images/bibliothek_offen.jpg';
import bleibarren from '../assets/images/bleibarren.jpg';
import colosseumSketch from '../assets/images/colosseum_sketch_1790853098391.jpg';
import croftManor from '../assets/images/croft-manor.jpg';
import damoclesSchwert from '../assets/images/damocles.schwert.jpg';
import dolchVonXian from '../assets/images/dolch_von_xian.jpg';
import eingangshalle from '../assets/images/eingangshalle.jpg';
import geheimfach from '../assets/images/geheimfach.jpg';
import goldeneMaske from '../assets/images/goldene-maske.jpg';
import goldenerSchluessel from '../assets/images/goldener-schlüssel.jpg';
import goldenerSchluesselBibliotek from '../assets/images/goldener_schlüssel_Bibliotek.jpg';
import goldenesGredal from '../assets/images/goldenes.gredal.jpg';
import laraMaster from '../assets/images/Lara_Croft_Icon_lara-master-1024_1024x1024.png';
import laraStyleNew from '../assets/images/Lara_Croft_Icon_lara-style-new_1024x1024.png';
import laraDeskHero from '../assets/images/lara_desk_hero_1790787354278.jpg';
import larasWeltkarte from '../assets/images/lara´s-weltkarte.jpg';
import lostValleySketch from '../assets/images/lost_valley_sketch_1790787448760.jpg';
import midasHand from '../assets/images/midas-hand.jpg';
import neptunsGabel from '../assets/images/neptuns.gabel.jpg';
import pergamentRolle from '../assets/images/pergament_rolle.jpg';
import ruhmeshalle from '../assets/images/Ruhmeshalle.jpg';
import ruhmeshalle01 from '../assets/images/Ruhmeshalle-01.jpg';
import saphirSchluessel from '../assets/images/saphir-schlüssel.jpg';
import scion from '../assets/images/scion.jpg';
import scion01 from '../assets/images/scion-01.jpg';
import scionPng from '../assets/images/scion.png';
import scionSidePng from '../assets/images/scion_side.png';
import scionBackPng from '../assets/images/scion_back.png';
import scionSketch from '../assets/images/scion_sketch_1790787384550.jpg';
import siegelVonAnubis from '../assets/images/siegel-von-anubis.jpg';
import silbenerSchluessel from '../assets/images/silbener.schlüssel.jpg';
import skarabeus from '../assets/images/skarabeus.jpg';
import startseiteHero from '../assets/images/startseite_hero_1790788872670.jpg';
import startseite from '../assets/images/startseite.jpg';
import thorHammer from '../assets/images/thor.hammer.jpg';
import vilcabambaSketch from '../assets/images/vilcabamba_sketch_1790787369543.jpg';
import zahnrad from '../assets/images/zahnrad.jpg';
import schreibtisch from '../assets/images/schreibtisch.jpg';
import schreibtischGeheimfach from '../assets/images/schreibtisch_geheimfach.jpg';
import lordCroftChronometer from '../assets/images/lord_croft_chronometer.jpg';
import briefAusKairo from '../assets/images/brief_aus_kairo.jpg';
import forschungsnotizenSeth from '../assets/images/forschungsnotizen_seth.jpg';
import expeditionRaum from '../assets/images/expedition_raum.jpg';
import vitrine from '../assets/images/vitrine.jpg';
import expeditionSachen from '../assets/images/expedition_sachen.jpg';
import geheimgang from '../assets/images/geheimgang.jpg';
import larasZimmer from '../assets/images/laras_zimmer.jpg';
import larasReise from '../assets/images/laras_reise.jpg';
import larasTagebuch from '../assets/images/laras-tagebuch.jpg';
import woelfe from '../assets/images/woelfe.jpg';
import imperialHotel from '../assets/images/imperial_hotel.jpg';
import raptoren from '../assets/images/raptoren.jpg';
import tRex from '../assets/images/t-rex.jpg';
import arnak from '../assets/images/arnak.jpg';

// Mapping aller Dateinamen auf die aufgelösten Vite-Asset-URLs
export const TR_IMAGES_MAP: Record<string, string> = {
  'anch-kreuz.jpg': anchKreuz,
  'app-icon-round.png': appIconRound,
  'atlas.kugel.jpg': atlasKugel,
  'auge-des-horus.jpg': augeDesHorus,
  'bibliotek.jpg': bibliotek,
  'bibliothek.jpg': bibliotek,
  'bibliothek_offen.jpg': bibliothekOffen,
  'bibliothek-offen.jpg': bibliothekOffen,
  'bleibarren.jpg': bleibarren,
  'colosseum_sketch_1790853098391.jpg': colosseumSketch,
  'colosseum_sketch.jpg': colosseumSketch,
  'croft-manor.jpg': croftManor,
  'damocles.schwert.jpg': damoclesSchwert,
  'dolch_von_xian.jpg': dolchVonXian,
  'eingangshalle.jpg': eingangshalle,
  'geheimfach.jpg': geheimfach,
  'goldene-maske.jpg': goldeneMaske,
  'goldener-schlüssel.jpg': goldenerSchluessel,
  'goldener_schlüssel_Bibliotek.jpg': goldenerSchluesselBibliotek,
  'goldenes.gredal.jpg': goldenesGredal,
  'Lara_Croft_Icon_lara-master-1024_1024x1024.png': laraMaster,
  'Lara_Croft_Icon_lara-style-new_1024x1024.png': laraStyleNew,
  'lara_desk_hero_1790787354278.jpg': laraDeskHero,
  'lara´s-weltkarte.jpg': larasWeltkarte,
  'laras-weltkarte.jpg': larasWeltkarte,
  'lost_valley_sketch_1790787448760.jpg': lostValleySketch,
  'midas-hand.jpg': midasHand,
  'neptuns.gabel.jpg': neptunsGabel,
  'pergament_rolle.jpg': pergamentRolle,
  'pergament-rolle.jpg': pergamentRolle,
  'pergamentrolle.jpg': pergamentRolle,
  'Ruhmeshalle.jpg': ruhmeshalle,
  'ruhmeshalle.jpg': ruhmeshalle,
  'Ruhmeshalle-01.jpg': ruhmeshalle01,
  'ruhmeshalle-01.jpg': ruhmeshalle01,
  'saphir-schlüssel.jpg': saphirSchluessel,
  'scion.jpg': scion,
  'scion-01.jpg': scion01,
  'scion.png': scionPng,
  'scion_side.png': scionSidePng,
  'scion_back.png': scionBackPng,
  'scion_sketch_1790787384550.jpg': scionSketch,
  'siegel-von-anubis.jpg': siegelVonAnubis,
  'silbener.schlüssel.jpg': silbenerSchluessel,
  'skarabeus.jpg': skarabeus,
  'startseite_hero_1790788872670.jpg': startseiteHero,
  'startseite.jpg': startseite,
  'thor.hammer.jpg': thorHammer,
  'vilcabamba_sketch_1790787369543.jpg': vilcabambaSketch,
  'zahnrad.jpg': zahnrad,
  'schreibtisch.jpg': schreibtisch,
  'schreibtisch_geheimfach.jpg': schreibtischGeheimfach,
  'schreibtsich_geheimfach.jpg': schreibtischGeheimfach,
  'arbeitszimmer.jpg': schreibtisch,
  'lord_croft_chronometer.jpg': lordCroftChronometer,
  'brief_aus_kairo.jpg': briefAusKairo,
  'forschungsnotizen_seth.jpg': forschungsnotizenSeth,
  'expedition_raum.jpg': expeditionRaum,
  'vitrine.jpg': vitrine,
  'expedition_sachen.jpg': expeditionSachen,
  'geheimgang.jpg': geheimgang,
  'laras_zimmer.jpg': larasZimmer,
  'laras-zimmer.jpg': larasZimmer,
  'laras_reise.jpg': larasReise,
  'laras-reise.jpg': larasReise,
  'laras-tagebuch.jpg': larasTagebuch,
  'laras_tagebuch.jpg': larasTagebuch,
  'woelfe.jpg': woelfe,
  'wölfe.jpg': woelfe,
  'wohnzimmer.jpg': '/images/wohnzimmer.jpg',
  'großes_wohnzimmer.jpg': '/images/wohnzimmer.jpg',
  'imperial_hotel.jpg': imperialHotel,
  'imperial-hotel.jpg': imperialHotel,
  'raptoren.jpg': raptoren,
  'raptoren-tal.jpg': raptoren,
  't-rex.jpg': tRex,
  't_rex.jpg': tRex,
  'arnak.jpg': arnak,
  'butler.jpg': '/images/butler.jpg',
  'geheimes-tagebuch.jpg': '/images/geheimes-tagebuch.jpg',
  'geheimes_tagebuch.jpg': '/images/geheimes-tagebuch.jpg',
};

// Direkte Layout-Bild-Exporte für Tagebuch, Startseite und UI
export const LAYOUT_IMAGES = {
  diaryBackground: startseiteHero,
  deskHero: laraDeskHero,
  startseite: startseite,
  worldMap: larasWeltkarte,
  appIcon: appIconRound,
  laraPortraitMaster: laraMaster,
  laraPortraitAction: laraStyleNew,
  croftManor: croftManor,
  eingangshalle: eingangshalle,
  bibliothek: bibliotek,
  bibliothekOffen: bibliothekOffen,
  geheimfach: geheimfach,
  pergamentRolle: pergamentRolle,
  goldeneMaske: goldeneMaske,
  schreibtisch: schreibtisch,
  schreibtischGeheimfach: schreibtischGeheimfach,
  lordCroftChronometer: lordCroftChronometer,
  briefAusKairo: briefAusKairo,
  forschungsnotizenSeth: forschungsnotizenSeth,
  expeditionRaum: expeditionRaum,
  vitrine: vitrine,
  expeditionSachen: expeditionSachen,
  geheimgang: geheimgang,
  larasZimmer: larasZimmer,
  larasReise: larasReise,
  larasTagebuch: larasTagebuch,
  woelfe: woelfe,
  wohnzimmer: '/images/wohnzimmer.jpg',
  imperialHotel: imperialHotel,
  raptoren: raptoren,
  ruhmeshalle: ruhmeshalle,
  ruhmeshalle01: ruhmeshalle01,
  scion: scion,
  scion01: scion01,
  scionPng: scionPng,
  scionSidePng: scionSidePng,
  scionBackPng: scionBackPng,
  geheimesTagebuch: '/images/geheimes-tagebuch.jpg',
};

// Erweiterter Lookup-Index mit Normalisierung für alle Pfade und URL-Encodings
const NORMALIZED_LOOKUP = new Map<string, string>();
Object.entries(TR_IMAGES_MAP).forEach(([key, val]) => {
  NORMALIZED_LOOKUP.set(key.toLowerCase(), val);
  NORMALIZED_LOOKUP.set(encodeURIComponent(key).toLowerCase(), val);
  NORMALIZED_LOOKUP.set(`/src/assets/images/${key}`.toLowerCase(), val);
  NORMALIZED_LOOKUP.set(`src/assets/images/${key}`.toLowerCase(), val);
  try {
    NORMALIZED_LOOKUP.set(decodeURIComponent(key).toLowerCase(), val);
  } catch {
    // Ignore decode error
  }
});

/**
 * Löst jede Bild-URL (Pfad, relativer Name, URL-encoded oder aus localStorage)
 * verlässlich in die korrekte Bild-Asset-URL aus src/assets/images/ auf.
 */
export function resolveImageUrl(urlOrPath: string | undefined): string {
  if (!urlOrPath) return LAYOUT_IMAGES.diaryBackground;

  // Data-URLs (z.B. vom Benutzer frisch hochgeladene Dateien) oder externe HTTP-Links direkt beibehalten
  if (
    urlOrPath.startsWith('data:') ||
    urlOrPath.startsWith('http://') ||
    urlOrPath.startsWith('https://') ||
    urlOrPath.startsWith('blob:')
  ) {
    return urlOrPath;
  }

  // Direkte Übereinstimmung im Standard-Map
  if (TR_IMAGES_MAP[urlOrPath]) {
    return TR_IMAGES_MAP[urlOrPath];
  }

  // Extrahiere reinen Dateinamen
  const rawFileName = urlOrPath.split('/').pop() || urlOrPath;
  if (TR_IMAGES_MAP[rawFileName]) {
    return TR_IMAGES_MAP[rawFileName];
  }

  // Prüfe den normalisierten Index (Groß-/Kleinschreibung, Pfade, URL-Decoding)
  const normKey = urlOrPath.toLowerCase().trim();
  if (NORMALIZED_LOOKUP.has(normKey)) {
    return NORMALIZED_LOOKUP.get(normKey)!;
  }

  const normFile = rawFileName.toLowerCase().trim();
  if (NORMALIZED_LOOKUP.has(normFile)) {
    return NORMALIZED_LOOKUP.get(normFile)!;
  }

  try {
    const decodedFile = decodeURIComponent(rawFileName).toLowerCase().trim();
    if (NORMALIZED_LOOKUP.has(decodedFile)) {
      return NORMALIZED_LOOKUP.get(decodedFile)!;
    }
  } catch {
    // Ignore decode errors
  }

  // Fallback: Sichere aufgelöste Standard-URL aus den Vite-Imports
  return LAYOUT_IMAGES.diaryBackground;
}

export interface PresetAssetItem {
  name: string;
  file: string;
  defaultTitle: string;
  category: 'artifact' | 'key' | 'sketch' | 'location' | 'lara';
  resolvedUrl: string;
}

// Vollständige Liste aller in src/assets/images/ verfügbaren Fundstücke & Bilder
export const ALL_IMAGE_PRESETS: PresetAssetItem[] = [
  // Artefakte & mythische Relikte
  { name: 'Scion von Atlantis', file: 'scion.jpg', defaultTitle: 'Das Scion von Atlantis', category: 'artifact', resolvedUrl: scion },
  { name: 'Thors Hammer', file: 'thor.hammer.jpg', defaultTitle: 'Thors Hammer & Blitzkammer', category: 'artifact', resolvedUrl: thorHammer },
  { name: 'Damokles Schwert', file: 'damocles.schwert.jpg', defaultTitle: 'Die Schwerter des Damokles', category: 'artifact', resolvedUrl: damoclesSchwert },
  { name: 'Neptuns Gabel', file: 'neptuns.gabel.jpg', defaultTitle: 'Neptuns Dreizack & Flutkammer', category: 'artifact', resolvedUrl: neptunsGabel },
  { name: 'Atlas Kugel', file: 'atlas.kugel.jpg', defaultTitle: 'Atlas Kugel & Steilrampe', category: 'artifact', resolvedUrl: atlasKugel },
  { name: 'Midas Hand', file: 'midas-hand.jpg', defaultTitle: 'Die magische Hand des Midas', category: 'artifact', resolvedUrl: midasHand },
  { name: 'Bleibarren', file: 'bleibarren.jpg', defaultTitle: 'Roher Bleibarren', category: 'artifact', resolvedUrl: bleibarren },
  { name: 'Goldenes Medaillon', file: 'goldenes.gredal.jpg', defaultTitle: 'Goldenes Medaillon (Gredal)', category: 'artifact', resolvedUrl: goldenesGredal },
  { name: 'Goldene Maske', file: 'goldene-maske.jpg', defaultTitle: 'Goldene Totenmaske', category: 'artifact', resolvedUrl: goldeneMaske },
  { name: 'Dolch von Xian', file: 'dolch_von_xian.jpg', defaultTitle: 'Der Dolch von Xian', category: 'artifact', resolvedUrl: dolchVonXian },
  { name: 'Anch-Kreuz des Lebens', file: 'anch-kreuz.jpg', defaultTitle: 'Das heilige Anch-Kreuz', category: 'artifact', resolvedUrl: anchKreuz },
  { name: 'Auge des Horus', file: 'auge-des-horus.jpg', defaultTitle: 'Amulett des Auge des Horus', category: 'artifact', resolvedUrl: augeDesHorus },
  { name: 'Siegel von Anubis', file: 'siegel-von-anubis.jpg', defaultTitle: 'Das Siegel von Anubis', category: 'artifact', resolvedUrl: siegelVonAnubis },
  { name: 'Goldener Skarabäus', file: 'skarabeus.jpg', defaultTitle: 'Der vergoldete Skarabäus', category: 'artifact', resolvedUrl: skarabeus },
  { name: 'Bronze-Zahnrad', file: 'zahnrad.jpg', defaultTitle: 'Antikes Bronze-Zahnrad', category: 'artifact', resolvedUrl: zahnrad },

  // Schlüssel
  { name: 'Goldener Schlüssel', file: 'goldener-schlüssel.jpg', defaultTitle: 'Goldener Tempelschlüssel', category: 'key', resolvedUrl: goldenerSchluessel },
  { name: 'Bibliothek-Schlüssel', file: 'goldener_schlüssel_Bibliotek.jpg', defaultTitle: 'Goldener Bibliothek-Schlüssel', category: 'key', resolvedUrl: goldenerSchluesselBibliotek },
  { name: 'Silberner Schlüssel', file: 'silbener.schlüssel.jpg', defaultTitle: 'Silberner Inka-Schlüssel', category: 'key', resolvedUrl: silbenerSchluessel },
  { name: 'Saphir-Schlüssel', file: 'saphir-schlüssel.jpg', defaultTitle: 'Saphir-Schlüssel des Heiligtums', category: 'key', resolvedUrl: saphirSchluessel },

  // Skizzen & Feldzeichnungen
  { name: 'Wölfe im Höhleneingang', file: 'woelfe.jpg', defaultTitle: 'Angriff der Wölfe im Höhleneingang', category: 'sketch', resolvedUrl: woelfe },
  { name: 'Tyrannosaurus Rex', file: 't-rex.jpg', defaultTitle: 'Tyrannosaurus Rex im Verlorenen Tal', category: 'artifact', resolvedUrl: tRex },
  { name: 'Vilcabamba Skizze', file: 'vilcabamba_sketch_1790787369543.jpg', defaultTitle: 'Skizze des Höhlentors & Inka-Reliefs', category: 'sketch', resolvedUrl: vilcabambaSketch },
  { name: 'Verlorenes Tal Skizze', file: 'lost_valley_sketch_1790787448760.jpg', defaultTitle: 'Feldskizze Verlorenes Tal & T-Rex', category: 'sketch', resolvedUrl: lostValleySketch },
  { name: 'Scion Skizze', file: 'scion_sketch_1790787384550.jpg', defaultTitle: 'Skizze des Scion & Thronsaals', category: 'sketch', resolvedUrl: scionSketch },

  // Schauplätze & Atmosphäre
  { name: 'Laras Weltkarte (TR 1-3)', file: 'lara´s-weltkarte.jpg', defaultTitle: 'Lara Crofts Globale Expeditionskarte', category: 'location', resolvedUrl: larasWeltkarte },
  { name: 'Laras Schreibtisch', file: 'lara_desk_hero_1790787354278.jpg', defaultTitle: 'Laras Schreibtisch in Croft Manor', category: 'location', resolvedUrl: laraDeskHero },
  { name: 'Höhleneingang Anden', file: 'startseite.jpg', defaultTitle: 'Eingangsstollen des Felsmassivs', category: 'location', resolvedUrl: startseite },
  { name: 'Ruhmeshalle Kolosseum', file: 'Ruhmeshalle.jpg', defaultTitle: 'Ruhmeshalle & Römische Arena', category: 'location', resolvedUrl: ruhmeshalle },
  { name: 'Startseite Hero', file: 'startseite_hero_1790788872670.jpg', defaultTitle: 'Lara Croft Expeditions-Schreibtisch', category: 'location', resolvedUrl: startseiteHero },

  // Lara Croft Porträts
  { name: 'Lara Croft Meister-Porträt', file: 'Lara_Croft_Icon_lara-master-1024_1024x1024.png', defaultTitle: 'Lara Croft Expeditionsakte', category: 'lara', resolvedUrl: laraMaster },
  { name: 'Lara Croft Action-Porträt', file: 'Lara_Croft_Icon_lara-style-new_1024x1024.png', defaultTitle: 'Lara Croft in Aktion', category: 'lara', resolvedUrl: laraStyleNew },
];
