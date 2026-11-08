import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  Search,
  ArrowLeft,
  X,
  Compass,
  Award,
  Layers,
  MapPin,
  FileText,
  Eye,
  BookOpen
} from 'lucide-react';
import { TR_IMAGES_MAP, LAYOUT_IMAGES, resolveImageUrl } from '../utils/imageAssets';
import { sounds } from '../utils/soundEffects';
import { TtsReader } from './TtsReader';
import { db } from '../services/db';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

/**
 * ============================================================================
 * ARTEFAKTE-DATENBANK FÜR DIE RUHMESHALLE (TOMB RAIDER 1, 2 & 3)
 * ============================================================================
 * Hier kannst du ganz einfach neue Artefakte hinzufügen oder bestehende
 * Texte, Bilder und Fundorte anpassen.
 * 
 * Jedes Artefakt besitzt folgende Pflicht- und Optionsfelder:
 * - id: Eindeutige Kennung (z. B. 'scion', 'dolch-von-xian')
 * - name: Name des Artefakts (große Überschrift im Info-Fenster)
 * - spiel: Das jeweilige Spiel ('Tomb Raider 1 (1996)', 'Tomb Raider 2 (1997)', 'Tomb Raider 3 (1998)')
 * - bild: Pfad zum Bild (z. B. '/images/scion.png', '/images/dolch_von_xian.jpg')
 * - beschreibung: Ausführlicher Textabschnitt "Beschreibung"
 * - fundorte: Ausführlicher Textabschnitt "Fundorte"
 * - kategorie (optional): z. B. 'Atlantis', 'Griechenland', 'Ägypten', 'Schlüssel'
 * ============================================================================
 */

export interface ArtefaktEintrag {
  id: string;
  name: string;
  spiel: 'Tomb Raider 1 (1996)' | 'Tomb Raider 2 (1997)' | 'Tomb Raider 3 (1998)' | string;
  bild: string;
  beschreibung: string;
  fundorte: string;
  kategorie?: string;
  untertitel?: string;
  gefahr?: 'Harmlos' | 'Antik' | 'Gefährlich' | 'Tödlich' | 'Göttlich';
  jahr?: string;
  tagebuchId?: string;
}

export const ARTEFAKTE_DATENBANK: ArtefaktEintrag[] = [
  // ==========================================================================
  // TOMB RAIDER 1 (1996)
  // ==========================================================================
  {
    id: 'scion',
    name: 'Das Scion von Atlantis',
    spiel: 'Tomb Raider 1 (1996)',
    bild: '/images/scion.png',
    beschreibung:
      'Das heiligste und gefährlichste Relikt der Menschheitsgeschichte. Zusammengesetzt aus drei Bruchstücken, die einst von den atlantischen Herrschern Qualopec, Tihocan und Jacqueline Natla verwahrt wurden. Es bündelt genetische Blaupausen und gewaltige atlantische Schöpfungsmacht, die ganze Zivilisationen erschaffen oder vernichten kann.',
    fundorte:
      'Vilcabamba & Grabmal des Qualopec (Peru), St. Francis Folly & Grabmal des Tihocan (Griechenland), Heiligtum des Scion & Die Große Pyramide (Atlantis)',
    kategorie: 'Atlantis & Ur-Mythen',
    untertitel: 'Dreiteiliges atlantisches Relikt unbegrenzter Schöpfungsmacht',
    gefahr: 'Göttlich',
    jahr: 'ca. 10.000 v. Chr.',
    tagebuchId: 'tr1996-06-qualopec',
  },
  {
    id: 'midas-hand',
    name: 'Die Hand des Midas',
    spiel: 'Tomb Raider 1 (1996)',
    bild: '/images/midas-hand.jpg',
    beschreibung:
      'Die abgebrochene Hand der kolossalen Marmorstatue des König Midas. Jede leblose Materie, die auf ihre geöffnete Handfläche gelegt wird, verwandelt sich in Sekundenschnelle in reines 24-karätiges Gold. Tritt ein lebendes Wesen unvorsichtig auf die Handfläche, versteinert es sofort zu einer massiven Goldstatue.',
    fundorte:
      'Palast des Midas, Felsengebirge von Thessalien, Griechenland',
    kategorie: 'Griechenland & Rom',
    untertitel: 'Versteinerte Götterhand der goldenen Transmutation',
    gefahr: 'Tödlich',
    jahr: 'ca. 800 v. Chr.',
    tagebuchId: 'tr1996-10-midas',
  },
  {
    id: 'zahnrad',
    name: 'Goldenes Zahnrad der Wasserfälle',
    spiel: 'Tomb Raider 1 (1996)',
    bild: '/images/zahnrad.jpg',
    beschreibung:
      'Eines der drei antiken Inka-Zahnräder, die tief im prähistorischen Tal verborgen lagen. In den Staudamm-Mechanismus eingesetzt, schließen sie die gewaltigen Schleusentore des Wasserfalls, um den geheimen Eingang zum Grabmal des Herrschers Qualopec freizulegen.',
    fundorte:
      'Das Verlorene Tal (Lost Valley), Vilcabamba, Peru',
    kategorie: 'Peru & Inka-Reich',
    untertitel: 'Präzisions-Getriebeteil des Inka-Staudamms',
    gefahr: 'Antik',
    jahr: 'ca. 1450 n. Chr.',
    tagebuchId: 'tr1996-03-vilcabamba',
  },
  {
    id: 'thor-hammer',
    name: 'Thors Hammer & Blitzkammer',
    spiel: 'Tomb Raider 1 (1996)',
    bild: '/images/thor.hammer.jpg',
    beschreibung:
      'Ein kolossaler mechanischer und mythischer Hammer, der hoch über einer geladenen Bodenplatte schwebt. Betritt man die Auslöser-Platte, entladen sich gewaltige Blitzfunken und der tonnenschwere Amboss schnellt mit zerstörerischer Wucht herab.',
    fundorte:
      'Kloster St. Francis Folly (Kammer des Thor), Thessalien, Griechenland',
    kategorie: 'Griechenland & Rom',
    untertitel: 'Göttliche Prüfungswaffe aus den Kammern von St. Francis',
    gefahr: 'Tödlich',
    jahr: 'ca. 1.200 v. Chr.',
    tagebuchId: 'tr1996-08-colosseum',
  },
  {
    id: 'neptun-gabel',
    name: 'Neptuns Dreizack',
    spiel: 'Tomb Raider 1 (1996)',
    bild: '/images/neptuns.gabel.jpg',
    beschreibung:
      'Der geschmiedete eiserne Dreizack aus der gefluteten Tiefenkammer von St. Francis. Er kontrolliert die hydraulischen Strömungen und Schleusenventile, die den gesamten Felsenschacht in Sekundenschnelle unter Wasser setzen können.',
    fundorte:
      'Kloster St. Francis Folly (Kammer des Neptun), Griechenland',
    kategorie: 'Griechenland & Rom',
    untertitel: 'Symbol über die Fluten und Gezeiten',
    gefahr: 'Gefährlich',
    jahr: 'ca. 1.200 v. Chr.',
    tagebuchId: 'tr1996-08-colosseum',
  },
  {
    id: 'damokles-schwert',
    name: 'Die Schwerter des Damokles',
    spiel: 'Tomb Raider 1 (1996)',
    bild: '/images/damocles.schwert.jpg',
    beschreibung:
      'Dutzende messerscharfe Klingen an verborgenen Fallmechanismen unter der Hallendecke. Sobald der Schlüssel vom Sockel gehoben wird, stürzen die Schwerter herab – eine tödliche Allegorie auf die Vergänglichkeit von Macht.',
    fundorte:
      'Kloster St. Francis Folly (Kammer des Damokles), Griechenland',
    kategorie: 'Griechenland & Rom',
    untertitel: 'Klingen des schwebenden Verhängnisses',
    gefahr: 'Tödlich',
    jahr: 'ca. 1.200 v. Chr.',
    tagebuchId: 'tr1996-08-colosseum',
  },
  {
    id: 'atlas-kugel',
    name: 'Die Kugel des Atlas',
    spiel: 'Tomb Raider 1 (1996)',
    bild: '/images/atlas.kugel.jpg',
    beschreibung:
      'Eine tonnenschwere monolithische Steinkugel auf einer steilen Rampe. Sie rollt unaufhaltsam los, sobald man sich dem Altar nähert, und verlangt sekundengenaues Ausweichen in rettende Gruben.',
    fundorte:
      'Kloster St. Francis Folly (Kammer des Atlas), Griechenland',
    kategorie: 'Griechenland & Rom',
    untertitel: 'Kolossale Steinkugel der unerbittlichen Schwerkraft',
    gefahr: 'Gefährlich',
    jahr: 'ca. 1.200 v. Chr.',
    tagebuchId: 'tr1996-08-colosseum',
  },
  {
    id: 'anch-kreuz',
    name: 'Das Anch-Kreuz des Lebens',
    spiel: 'Tomb Raider 1 (1996)',
    bild: '/images/anch-kreuz.jpg',
    beschreibung:
      'Das altägyptische Symbol für Leben, Auferstehung und Unsterblichkeit. Aus vergoldeter Bronze mit Lapislazuli gefertigt, diente es als Zeremonienschlüssel zur Sphinx-Kammer.',
    fundorte:
      'Stadt Khamoon & Obelisk des Pharaos, Ägypten',
    kategorie: 'Ägypten & Nil-Tal',
    untertitel: 'Heiliges Schlüssel-Relikt der ägyptischen Gottheiten',
    gefahr: 'Antik',
    jahr: 'ca. 2.400 v. Chr.',
    tagebuchId: 'tr1996-12-khamoon',
  },
  {
    id: 'auge-des-horus',
    name: 'Das Amulett des Auge des Horus',
    spiel: 'Tomb Raider 1 (1996)',
    bild: '/images/auge-des-horus.jpg',
    beschreibung:
      'Das Udjat-Schutzauge der Pharaonen. Eines der vier heiligen Siegel, die in die vier Sockelnischen des großen Monolithen eingesetzt werden müssen, um die Zugbrücke zu senken.',
    fundorte:
      'Obelisk von Khamoon, Nil-Tal, Ägypten',
    kategorie: 'Ägypten & Nil-Tal',
    untertitel: 'Schutzsiegel der Himmelsgötter gegen finstere Dämonen',
    gefahr: 'Antik',
    jahr: 'ca. 2.400 v. Chr.',
    tagebuchId: 'tr1996-12-khamoon',
  },
  {
    id: 'siegel-von-anubis',
    name: 'Das Siegel von Anubis',
    spiel: 'Tomb Raider 1 (1996)',
    bild: '/images/siegel-von-anubis.jpg',
    beschreibung:
      'Gefahrvolle Grabesinsignie des Schakalgottes der Totenriten. Aus poliertem, pechschwarzem Obsidian geschliffen, versiegelt es die Zugänge zu den atlantischen Katakomben.',
    fundorte:
      'Tiefste Grabkammern der Stadt Khamoon, Ägypten',
    kategorie: 'Ägypten & Nil-Tal',
    untertitel: 'Insignie des Schakal-Gottes der Totenriten',
    gefahr: 'Gefährlich',
    jahr: 'ca. 2.400 v. Chr.',
    tagebuchId: 'tr1996-12-khamoon',
  },
  {
    id: 'skarabeus',
    name: 'Der Goldene Skarabäus',
    spiel: 'Tomb Raider 1 (1996)',
    bild: '/images/skarabeus.jpg',
    beschreibung:
      'Ein meisterhaft geschmiedeter Mistkäfer aus massivem Feingold mit aufklappbaren Scharnier-Flügeln, der den Schließzylinder des Tors zwischen den Pfoten der Sphinx entriegelt.',
    fundorte:
      'Kammertor der Großen Sphinx & Heiligtum des Scion, Ägypten',
    kategorie: 'Ägypten & Nil-Tal',
    untertitel: 'Symbol des Sonnenaufgangs und der ewigen Erneuerung',
    gefahr: 'Antik',
    jahr: 'ca. 2.400 v. Chr.',
    tagebuchId: 'tr1996-12-khamoon',
  },
  {
    id: 'bleibarren',
    name: 'Transmutierter Bleibarren',
    spiel: 'Tomb Raider 1 (1996)',
    bild: '/images/bleibarren.jpg',
    beschreibung:
      'Schwere Gussbarren aus unedlem Bleierz. Auf die Hand des Midas gelegt, verwandeln sie sich durch alchemistische Transmutation in massive Goldbarren, um die fünf Siegel des Haupttors zu öffnen.',
    fundorte:
      'Katakomben, Gießerei & Aquädukte des Midas-Palastes, Griechenland',
    kategorie: 'Griechenland & Rom',
    untertitel: 'Vom unedlen Erz zum reinen Goldbarren',
    gefahr: 'Harmlos',
    jahr: 'Antike',
    tagebuchId: 'tr1996-10-midas',
  },
  {
    id: 'goldenes-gredal',
    name: 'Goldenes Medaillon (Gredal)',
    spiel: 'Tomb Raider 1 (1996)',
    bild: '/images/goldenes.gredal.jpg',
    beschreibung:
      'Prunkmedaillon mit eingeprägter Sonnensymbolik. Versteckt in den überfluteten Aquädukten der antiken Wasserzisterne als Schlüssel für das Hauptablaufventil.',
    fundorte:
      'Die Zisterne (Cistern) & Kolosseum, Griechenland',
    kategorie: 'Griechenland & Rom',
    untertitel: 'Prunkmedaillon aus den Tiefen der antiken Zisterne',
    gefahr: 'Antik',
    jahr: 'ca. 200 n. Chr.',
    tagebuchId: 'tr1996-09-cistern',
  },
  {
    id: 'saphir-schluessel',
    name: 'Saphir-Schlüssel des Heiligtums',
    spiel: 'Tomb Raider 1 (1996)',
    bild: '/images/saphir-schlüssel.jpg',
    beschreibung:
      'Ein leuchtend blauer Kristallschlüssel atlantischer Bauart, der ein schwaches phosphorierendes Glühen abgibt und die biologischen Sicherheitsschotts öffnet.',
    fundorte:
      'Heiligtum des Scion & Ruinen von Atlantis',
    kategorie: 'Schlüssel & Schlösser',
    untertitel: 'Edelstein-Schlüssel der atlantischen Pforten',
    gefahr: 'Antik',
    jahr: 'Unbekannt',
    tagebuchId: 'tr1996-13-sanctuary',
  },
  {
    id: 'silber-inka-key',
    name: 'Silberner Inka-Schlüssel',
    spiel: 'Tomb Raider 1 (1996)',
    bild: '/images/silbener.schlüssel.jpg',
    beschreibung:
      'Zeremonieller Schlüssel der Andenpriester mit Kondorflügel-Gravur. Die Inka verehrten Silber als die Tränen des Mondes und weihten ihm astronomische Tore.',
    fundorte:
      'Vilcabamba & Grab des Qualopec, Peru',
    kategorie: 'Schlüssel & Schlösser',
    untertitel: 'Zeremonieller Schlüssel der Andenpriester',
    gefahr: 'Antik',
    jahr: 'ca. 1400 n. Chr.',
    tagebuchId: 'tr1996-03-vilcabamba',
  },
  {
    id: 'gold-tempel-key',
    name: 'Goldener Tempelschlüssel',
    spiel: 'Tomb Raider 1 (1996)',
    bild: '/images/goldener-schlüssel.jpg',
    beschreibung:
      'Massiver goldener Doppelbart-Schlüssel zu den oberen Säulengängen des Midas-Palastes und den Königslogen der römischen Arena.',
    fundorte:
      'Das Kolosseum & Palast des Midas, Griechenland',
    kategorie: 'Schlüssel & Schlösser',
    untertitel: 'Meisterschlüssel der antiken Heiligtümer',
    gefahr: 'Antik',
    jahr: 'Antike',
    tagebuchId: 'tr1996-08-colosseum',
  },
  {
    id: 'gold-bibliothek-key',
    name: 'Goldener Bibliothek-Schlüssel',
    spiel: 'Tomb Raider 1 (1996)',
    bild: '/images/goldener_schlüssel_Bibliotek.jpg',
    beschreibung:
      'Der handgeschmiedete Schlüssel zur oberen Galerie der Privatbibliothek in Croft Manor. Hinter den Buchregalen verbirgt sich der geheime Kontrollraum für die Alarmanlagen und den Tresorraum.',
    fundorte:
      'Croft Manor (Bibliothek & Kaminzimmer), Surrey, England',
    kategorie: 'Schlüssel & Schlösser',
    untertitel: 'Zugang zu den Geheimarchiven von Croft Manor',
    gefahr: 'Harmlos',
    jahr: '1888',
  },

  // ==========================================================================
  // TOMB RAIDER 2 (1997)
  // ==========================================================================
  {
    id: 'dolch-von-xian',
    name: 'Der Dolch von Xian',
    spiel: 'Tomb Raider 2 (1997)',
    bild: '/images/dolch_von_xian.jpg',
    beschreibung:
      'Eine legendäre zeremonielle Klinge der ersten Kaiser Chinas. Stößt sich der Träger den Dolch mit festem Willen mitten ins eigene Herz, verwandelt er sich in einen feuerspeienden, unbezwingbaren Drachen. Marco Bartoli und sein Kult des Fiore Chiari jagten das Relikt bis tief unter die Chinesische Mauer.',
    fundorte:
      'Die Große Mauer, Tempel des Xian & Die Schwimmenden Inseln (China)',
    kategorie: 'Welt-Expeditionen',
    untertitel: 'Antike Waffe der chinesischen Kaiserdrachen',
    gefahr: 'Tödlich',
    jahr: '221 v. Chr. (Qin-Dynastie)',
  },
  {
    id: 'goldene-maske',
    name: 'Die Goldene Maske von Tornarsuk',
    spiel: 'Tomb Raider 2 (1997)',
    bild: '/images/goldene-maske.jpg',
    beschreibung:
      'Die schamanische Totenmaske des Tornarsuk, eines Geisterwesens der arktischen Inuit- und Aleuten-Völker. Entdeckt in einer stillgelegten sowjetischen Goldmine und einem verborgenen Inuk-Heiligtum unter dem ewigen Packeis.',
    fundorte:
      'Insel Melnikov, Beringsee, Alaska (Tomb Raider II: Golden Mask)',
    kategorie: 'Welt-Expeditionen',
    untertitel: 'Schamanische Totenmaske der Aleuten-Völker',
    gefahr: 'Gefährlich',
    jahr: 'ca. 500 n. Chr.',
  },
  {
    id: 'seraph',
    name: 'Der Seraph',
    spiel: 'Tomb Raider 2 (1997)',
    bild: '/images/scion.png',
    beschreibung:
      'Das heilige Artefakt und Schlüsselsymbol des tibetischen Barkhang-Klosters. Nach dem Untergang des italienischen Luxusliners Maria Doria tief auf dem Meeresgrund verschollen, dient es dazu, die Katakomben des Eispalastes zu entriegeln.',
    fundorte:
      'Wrack der Maria Doria (Mittelmeer) & Kloster von Barkhang (Tibet)',
    kategorie: 'Welt-Expeditionen',
    untertitel: 'Heiliger Schlüssel des tibetischen Barkhang-Klosters',
    gefahr: 'Antik',
    jahr: 'Mittelalter',
  },
  {
    id: 'talion',
    name: 'Das Talion',
    spiel: 'Tomb Raider 2 (1997)',
    bild: '/images/goldenes.gredal.jpg',
    beschreibung:
      'Ein kreisrundes, reich graviertes Torsiegel, das in den gefrorenen Höhlen Tibets von furchterregenden Yetis und Wächterbestien bewacht wurde. Es öffnet die Hauptpforten des Tempels von Xian an der Großen Mauer.',
    fundorte:
      'Eispalast & Katakomben des Talion (Tibet)',
    kategorie: 'Welt-Expeditionen',
    untertitel: 'Schutzsiegel der chinesischen Drachentempel',
    gefahr: 'Gefährlich',
    jahr: 'Antike',
  },

  // ==========================================================================
  // TOMB RAIDER 3 (1998)
  // ==========================================================================
  {
    id: 'infada-stein',
    name: 'Der Infada-Stein',
    spiel: 'Tomb Raider 3 (1998)',
    bild: '/images/scion-01.jpg',
    beschreibung:
      'Eines von vier uralten Artefakten, die polynesische Ureinwohner vor Jahrtausenden aus dem Kern eines in der Antarktis eingeschlagenen Meteoriten schmiedeten. Verleiht seinem Träger übernatürliche telekinetische Kräfte und zerstörerische Energieblitze.',
    fundorte:
      'Dschungel, Ruinentempel & Ganges-Becken, Indien',
    kategorie: 'Welt-Expeditionen',
    untertitel: 'Meteoriten-Artefakt der antiken indischen Kulte',
    gefahr: 'Göttlich',
    jahr: 'Prähistorisch',
  },
  {
    id: 'dolch-von-ora',
    name: 'Dolch von Ora Dagger',
    spiel: 'Tomb Raider 3 (1998)',
    bild: '/images/dolch_von_xian.jpg',
    beschreibung:
      'Ein ritueller Meteoriten-Dolch der polynesischen Insulaner. Aus dem glühenden Gestein der Antarktis geschmiedet und von Eingeborenen im Krater eines Vulkans als heiliges Opferwerkzeug gehütet.',
    fundorte:
      'Küstendorf, Absturzstelle & Madubu-Schlucht, Südpazifik',
    kategorie: 'Welt-Expeditionen',
    untertitel: 'Polynesischer Opferdolch aus Meteorgestein',
    gefahr: 'Tödlich',
    jahr: 'Prähistorisch',
  },
  {
    id: 'auge-der-isis',
    name: 'Das Auge der Isis',
    spiel: 'Tomb Raider 3 (1998)',
    bild: '/images/auge-des-horus.jpg',
    beschreibung:
      'Das dritte Meteoriten-Fragment, von der Kosmetik-Unternehmerin Sophia Leigh für unheilvolle Experimente zur ewigen Jugend und zellulären Mutationen in den Londoner Untergrundlaboren missbraucht.',
    fundorte:
      'Themse-Kai, Aldwych U-Bahn-Schacht & Sophia Leighs Büro, London',
    kategorie: 'Welt-Expeditionen',
    untertitel: 'Meteoriten-Relikt der biochemischen Transmutation',
    gefahr: 'Tödlich',
    jahr: 'Prähistorisch',
  },
  {
    id: 'element-115',
    name: 'Element 115',
    spiel: 'Tomb Raider 3 (1998)',
    bild: '/images/atlas.kugel.jpg',
    beschreibung:
      'Das vierte Meteoriten-Fragment. Von US-Militärforschern in der Wüste Nevadas geborgen und in den streng geheimen Laboren der Area 51 zur Erforschung von Raumzeit-Verzerrungen und Anti-Gravitationsantrieben isoliert.',
    fundorte:
      'Nevada-Wüste, Hochsicherheitstrakt & Area 51, USA',
    kategorie: 'Welt-Expeditionen',
    untertitel: 'Außerirdische Energiequelle aus dem Meteoriten-Kern',
    gefahr: 'Göttlich',
    jahr: 'Prähistorisch',
  },
  {
    id: 'hand-von-rathmore',
    name: 'Die Hand von Rathmore',
    spiel: 'Tomb Raider 3 (1998)',
    bild: '/images/midas-hand.jpg',
    beschreibung:
      'Das fünfte, geheime Meteoriten-Fragment von Dr. Willard. Wurde von Schottland über den Ärmelkanal transportiert und im Schlamm der französischen Katakomben versteckt.',
    fundorte:
      'Loch Ness, Schloss Willard & Katakomben von Paris (TR3: The Lost Artifact)',
    kategorie: 'Welt-Expeditionen',
    untertitel: 'Verlorenes fünftes Meteoriten-Relikt von Dr. Willard',
    gefahr: 'Tödlich',
    jahr: 'Prähistorisch',
  },
];

// Für Abwärtskompatibilität
export const ARTEFAKTE = ARTEFAKTE_DATENBANK;
export const ARTIFACTS_DATA = ARTEFAKTE_DATENBANK;

interface RuhmeshalleProps {
  onBackToManor?: () => void;
  onBackToHome?: () => void;
  onOpenDiaryEntry?: (entryId: string) => void;
  onOpenMap?: () => void;
  onBack?: () => void;
}

export const Ruhmeshalle: React.FC<RuhmeshalleProps> = ({
  onBackToManor,
  onBackToHome,
  onOpenDiaryEntry,
  onBack,
}) => {
  const handleBackNavigation = onBack || onBackToManor;
  const [selectedGameFilter, setSelectedGameFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalArtefakt, setActiveModalArtefakt] = useState<ArtefaktEintrag | null>(null);

  // ESC-Taste schließt das Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModalArtefakt(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openArtefaktModal = (item: ArtefaktEintrag) => {
    try {
      sounds.playPageTurn();
    } catch (_) {}
    setActiveModalArtefakt(item);
  };

  const openArtefaktById = (id: string) => {
    const found = ARTEFAKTE_DATENBANK.find((item) => item.id === id);
    if (found) {
      openArtefaktModal(found);
    }
  };

  // Stimmungsschwankungen / Mood-Daten für Recharts
  const moodChartData = useMemo(() => {
    try {
      const entries = db.getEntries();
      const moodScoreMap: Record<string, { score: number; label: string; color: string }> = {
        gefährlich: { score: 1, label: 'Gefährlich / Angespannt', color: '#ef4444' },
        nachdenklich: { score: 2, label: 'Nachdenklich / Analytisch', color: '#3b82f6' },
        mystisch: { score: 3, label: 'Mystisch / Geheimnisvoll', color: '#a855f7' },
        triumphierend: { score: 4, label: 'Triumphierend / Erfolg', color: '#10b981' },
        heroisch: { score: 5, label: 'Heroisch / Episch', color: '#f59e0b' },
      };

      return entries.map((entry, index) => {
        const moodKey = entry.mood || 'mystisch';
        const moodInfo = moodScoreMap[moodKey] || { score: 3, label: moodKey, color: '#d4af37' };
        return {
          id: entry.id,
          index: index + 1,
          entryNumber: entry.entryNumber,
          title: entry.levelTitle || `Eintrag ${entry.entryNumber}`,
          chapter: entry.chapter,
          date: entry.date,
          location: entry.location,
          mood: moodKey,
          moodLabel: moodInfo.label,
          score: moodInfo.score,
          color: moodInfo.color,
        };
      });
    } catch (e) {
      return [];
    }
  }, []);

  const CustomMoodTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#1b120c] border-2 border-[#d4af37] p-3.5 rounded-xl shadow-2xl text-[#e8d7be] max-w-xs font-serif z-50">
          <div className="flex items-center justify-between gap-2 mb-1.5 border-b border-[#4a2e16] pb-1">
            <span className="text-[10px] font-cinzel text-[#d4af37] uppercase tracking-wider">{data.chapter}</span>
            <span className="text-[10px] text-[#a1927d]">{data.date}</span>
          </div>
          <h4 className="font-cinzel font-bold text-sm text-[#ffd992] mb-1">{data.title}</h4>
          <p className="text-xs text-[#bca78c] mb-2">{data.location}</p>
          <div className="flex items-center gap-2 pt-1.5 border-t border-[#331f13]">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: data.color }} />
            <span className="text-xs font-cinzel font-semibold text-[#ffd992]">{data.moodLabel}</span>
          </div>
          {onOpenDiaryEntry && (
            <div className="mt-2 text-[10px] text-[#ffd992] font-cinzel italic bg-[#2d1b0f] px-2 py-1 rounded border border-[#8b5a2b]">
              ✦ Klicke hier, um Tagebuch zu öffnen
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Gefilterte Artefakte
  const filteredArtefakte = useMemo(() => {
    return ARTEFAKTE_DATENBANK.filter((item) => {
      const matchesGame =
        selectedGameFilter === 'all' || item.spiel.includes(selectedGameFilter);
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.fundorte.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.beschreibung.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesGame && matchesSearch;
    });
  }, [selectedGameFilter, searchQuery]);

  const gameFilters = [
    { id: 'all', label: 'Alle Relikte', count: ARTEFAKTE_DATENBANK.length },
    {
      id: '1996',
      label: 'Tomb Raider 1 (1996)',
      count: ARTEFAKTE_DATENBANK.filter((a) => a.spiel.includes('1996')).length,
    },
    {
      id: '1997',
      label: 'Tomb Raider 2 (1997)',
      count: ARTEFAKTE_DATENBANK.filter((a) => a.spiel.includes('1997')).length,
    },
    {
      id: '1998',
      label: 'Tomb Raider 3 (1998)',
      count: ARTEFAKTE_DATENBANK.filter((a) => a.spiel.includes('1998')).length,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b0806] text-[#e8d7be] flex flex-col font-serif select-none">
      {/* Top Banner mit sanfter Beleuchtung */}
      <div className="relative w-full h-64 sm:h-72 md:h-84 overflow-hidden border-b border-[#5c3a1c]">
        <img
          src={LAYOUT_IMAGES.ruhmeshalle01 || LAYOUT_IMAGES.ruhmeshalle}
          alt="Lara Crofts Ruhmeshalle"
          className="w-full h-full object-cover object-center filter brightness-90 contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0806] via-[#0b0806]/60 to-black/40" />

        {/* Obere Navigations-Buttons */}
        <div className="absolute top-4 left-4 right-4 max-w-7xl mx-auto flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            {handleBackNavigation && (
              <button
                onClick={() => {
                  try { sounds.playClick(); } catch (_) {}
                  handleBackNavigation();
                }}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#1a110a]/85 hover:bg-[#2e1d11] border border-[#8b5a2b]/80 text-[#ffd992] text-xs font-cinzel font-semibold backdrop-blur-md transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#e4c478]" />
                <span>Zurück zu Croft Manor</span>
              </button>
            )}
            {onBackToHome && !handleBackNavigation && (
              <button
                onClick={() => {
                  try { sounds.playClick(); } catch (_) {}
                  onBackToHome();
                }}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#1a110a]/85 hover:bg-[#2e1d11] border border-[#8b5a2b]/80 text-[#ffd992] text-xs font-cinzel font-semibold backdrop-blur-md transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#e4c478]" />
                <span>Zur Startseite</span>
              </button>
            )}
          </div>

          <span className="px-3 py-1 rounded-full bg-[#1b120c]/85 border border-[#8b5a2b] text-[11px] font-cinzel text-[#e4c478] tracking-wider shadow">
            Privatsammlung • Croft Manor
          </span>
        </div>

        {/* Titel & Info */}
        <div className="absolute bottom-5 left-4 right-4 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4 z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[#e4c478]" />
              <span className="text-xs uppercase tracking-widest text-[#caa568] font-cinzel">
                Lara Crofts Schatzkammer & Trophäensaal
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold text-[#ffd992] drop-shadow-md">
              Die Ruhmeshalle
            </h1>
            <p className="text-xs sm:text-sm text-[#bca78c] max-w-2xl mt-1 leading-relaxed">
              Klicke auf das gelb markierte Scion in der Mitte oder wähle ein Relikt aus der Sammlung,
              um ausführliche Informationen zu Beschreibung und Fundorten zu öffnen.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#18100a]/85 border border-[#6b4522] rounded-lg px-4 py-2.5 backdrop-blur-md self-start md:self-end">
            <Award className="w-6 h-6 text-[#ffd992] shrink-0" />
            <div>
              <div className="text-sm font-cinzel font-bold text-[#ffd992]">
                {ARTEFAKTE_DATENBANK.length} Artefakte erfasst
              </div>
              <div className="text-[11px] text-[#9c846d]">
                Tomb Raider 1 • Tomb Raider 2 • Tomb Raider 3
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hauptinhalt */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        
        {/* INTERAKTIVES SAALBILD MIT DEM FESTEN GELBEN AUSWAHL-RECHTECK ÜBER DEM SCION */}
        <div className="bg-[#140e0a]/95 border-2 border-[#8b5a2b] rounded-2xl p-4 sm:p-5 shadow-2xl relative">
          <div className="flex items-center justify-between mb-3 border-b border-[#442b17] pb-2">
            <div>
              <h2 className="font-cinzel text-lg sm:text-xl font-bold text-[#ffd992] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#ffd992]" />
                <span>Zentraler Ausstellungsraum</span>
              </h2>
              <p className="text-xs text-[#a1927d]">
                Klicke auf das gelb eingerahmte Scion in der Vitrine oder auf die weiteren Artefakt-Podeste.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-[#d4af37] font-cinzel">
              <span>✦ Klick öffnet Infofenster</span>
            </div>
          </div>

          <div style={{ position: 'relative', maxWidth: '1000px', margin: '0 auto' }}>
            {/* Bild der Ruhmeshalle */}
            <img 
              src="/images/Ruhmeshalle-01.jpg" 
              alt="Ruhmeshalle" 
              onError={(e) => {
                e.currentTarget.src = LAYOUT_IMAGES.ruhmeshalle01 || LAYOUT_IMAGES.ruhmeshalle;
              }}
              className="w-full rounded-lg border border-[#8b5a2b] block shadow-2xl"
              draggable={false}
            />

            {/* 
              FESTES GELBES AUSWAHL-RECHTECK ÜBER DEM SCION IN DER MITTE (NICHT VERSCHIEBBAR)
            */}
            <div 
              onClick={() => {
                openArtefaktById('scion');
              }}
              style={{
                position: 'absolute',
                top: '36%',
                left: '45%',
                width: '10%',
                height: '24%',
                cursor: 'pointer',
                border: '3px solid #ffd700',
                backgroundColor: 'rgba(255, 215, 0, 0.25)',
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.7), inset 0 0 10px rgba(255, 215, 0, 0.3)',
                borderRadius: '6px',
                userSelect: 'none',
              }}
              draggable={false}
              className="hover:scale-[1.03] hover:bg-[#ffd700]/35 transition-all duration-200 group z-20"
              title="Scion von Atlantis – Klicke für Details (Beschreibung & Fundorte)"
            >
              {/* Festes Label über dem Scion */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#1b120c] border border-[#ffd700] text-[#ffd992] text-[11px] font-cinzel font-bold px-2.5 py-0.5 rounded shadow-xl whitespace-nowrap opacity-95 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center gap-1">
                <span>✦</span>
                <span>Scion von Atlantis</span>
              </div>
            </div>

            {/* Hotspot 2: Goldenes Zahnrad (rechtes Podest) */}
            <div 
              onClick={() => openArtefaktById('zahnrad')}
              style={{
                position: 'absolute',
                top: '50%',
                left: '65%',
                width: '11%',
                height: '18%',
                cursor: 'pointer',
                border: '2px dashed rgba(245, 190, 60, 0.8)',
                backgroundColor: 'rgba(245, 190, 60, 0.2)',
                borderRadius: '4px',
                userSelect: 'none',
              }}
              draggable={false}
              className="hover:scale-105 hover:bg-[#f5be3c]/40 transition-all duration-200 group z-10"
              title="Goldenes Zahnrad – Klicke für Details"
            >
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#1b120c] border border-[#f5be3c] text-[#ffd992] text-[10px] font-cinzel font-bold px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none">
                ⚙️ Goldenes Zahnrad
              </div>
            </div>

            {/* Hotspot 3: Hand des Midas (linkes Podest) */}
            <div 
              onClick={() => openArtefaktById('midas-hand')}
              style={{
                position: 'absolute',
                top: '50%',
                left: '23%',
                width: '11%',
                height: '18%',
                cursor: 'pointer',
                border: '2px dashed rgba(255, 215, 0, 0.8)',
                backgroundColor: 'rgba(255, 215, 0, 0.2)',
                borderRadius: '4px',
                userSelect: 'none',
              }}
              draggable={false}
              className="hover:scale-105 hover:bg-[#ffd700]/40 transition-all duration-200 group z-10"
              title="Hand des Midas – Klicke für Details"
            >
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#1b120c] border border-[#ffd700] text-[#ffd992] text-[10px] font-cinzel font-bold px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none">
                🖐️ Hand des Midas
              </div>
            </div>

            {/* Hotspot 4: Dolch von Xian (linker Wandschrein) */}
            <div 
              onClick={() => openArtefaktById('dolch-von-xian')}
              style={{
                position: 'absolute',
                top: '34%',
                left: '12%',
                width: '9%',
                height: '22%',
                cursor: 'pointer',
                border: '2px dashed rgba(72, 199, 142, 0.8)',
                backgroundColor: 'rgba(72, 199, 142, 0.2)',
                borderRadius: '4px',
                userSelect: 'none',
              }}
              draggable={false}
              className="hover:scale-105 hover:bg-[#48c78e]/40 transition-all duration-200 group z-10"
              title="Dolch von Xian – Klicke für Details"
            >
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#1b120c] border border-[#48c78e] text-[#ffd992] text-[10px] font-cinzel font-bold px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none">
                🗡️ Dolch von Xian (TR2)
              </div>
            </div>

            {/* Hotspot 5: Thors Hammer (rechter Wandschrein) */}
            <div 
              onClick={() => openArtefaktById('thor-hammer')}
              style={{
                position: 'absolute',
                top: '34%',
                left: '78%',
                width: '9%',
                height: '22%',
                cursor: 'pointer',
                border: '2px dashed rgba(147, 197, 253, 0.8)',
                backgroundColor: 'rgba(147, 197, 253, 0.2)',
                borderRadius: '4px',
                userSelect: 'none',
              }}
              draggable={false}
              className="hover:scale-105 hover:bg-[#93c5fd]/40 transition-all duration-200 group z-10"
              title="Thors Hammer – Klicke für Details"
            >
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#1b120c] border border-[#93c5fd] text-[#ffd992] text-[10px] font-cinzel font-bold px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none">
                🔨 Thors Hammer
              </div>
            </div>
          </div>
        </div>

        {/* RECHARTS STIMMUNGSSCHWANKUNGEN DIAGRAMM */}
        <div className="bg-[#140e0a]/95 border-2 border-[#8b5a2b] rounded-2xl p-4 sm:p-6 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 border-b border-[#442b17] pb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-[#e4c478]" />
                <span className="text-xs uppercase tracking-widest text-[#caa568] font-cinzel">
                  Psychologische Expeditionsanalyse
                </span>
              </div>
              <h2 className="font-cinzel text-lg sm:text-xl font-bold text-[#ffd992]">
                Laras Stimmungsschwankungen & Reise-Emotionen
              </h2>
              <p className="text-xs text-[#a1927d] mt-0.5">
                Verlauf der emotionalen Verfassung (von Gefahr bis Heroisch) basierend auf den Tagebucheinträgen. Klicke auf einen Datenpunkt, um den Eintrag im Archiv zu öffnen.
              </p>
            </div>

            {/* Stimmungslegende */}
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-cinzel bg-[#1b120c] border border-[#5c3a1c] px-3 py-2 rounded-xl">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" /><span className="text-[#e8d7be]">Gefährlich</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" /><span className="text-[#e8d7be]">Nachdenklich</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#a855f7]" /><span className="text-[#e8d7be]">Mystisch</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" /><span className="text-[#e8d7be]">Triumph</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" /><span className="text-[#e8d7be]">Heroisch</span></div>
            </div>
          </div>

          <div className="w-full h-72 sm:h-80 pt-2">
            {moodChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={moodChartData}
                  margin={{ top: 10, right: 20, left: -20, bottom: 25 }}
                >
                  <defs>
                    <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffd992" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8b5a2b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#332013" vertical={false} />
                  <XAxis
                    dataKey="entryNumber"
                    stroke="#9c846d"
                    tick={{ fill: '#ab9378', fontSize: 10 }}
                    tickLine={{ stroke: '#5c3a1c' }}
                    label={{ value: 'Tagebucheintrag Nr.', position: 'bottom', offset: 10, fill: '#caa568', fontSize: 11 }}
                  />
                  <YAxis
                    domain={[0.5, 5.5]}
                    ticks={[1, 2, 3, 4, 5]}
                    tickFormatter={(val) => {
                      switch (val) {
                        case 1: return 'Gefahr';
                        case 2: return 'Ruhe';
                        case 3: return 'Mystik';
                        case 4: return 'Sieg';
                        case 5: return 'Heroisch';
                        default: return '';
                      }
                    }}
                    stroke="#9c846d"
                    tick={{ fill: '#ab9378', fontSize: 10 }}
                    tickLine={{ stroke: '#5c3a1c' }}
                  />
                  <Tooltip content={<CustomMoodTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#ffd992"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#moodGradient)"
                    activeDot={{
                      r: 7,
                      fill: '#ffd992',
                      stroke: '#8b5a2b',
                      strokeWidth: 3,
                      cursor: 'pointer',
                      onClick: (_e: any, payload: any) => {
                        if (payload && payload.payload && payload.payload.id && onOpenDiaryEntry) {
                          try { sounds.playPageTurn(); } catch (_) {}
                          onOpenDiaryEntry(payload.payload.id);
                        }
                      }
                    }}
                    dot={{
                      r: 4,
                      fill: '#d4af37',
                      stroke: '#1b120c',
                      strokeWidth: 1.5,
                      cursor: 'pointer',
                    }}
                    onClick={(data: any) => {
                      if (data && data.id && onOpenDiaryEntry) {
                        try { sounds.playPageTurn(); } catch (_) {}
                        onOpenDiaryEntry(data.id);
                      }
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[#9c846d] font-cinzel text-sm">
                Keine Tagebucheinträge für das Stimmungsdiagramm verfügbar.
              </div>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-[#3d2412] flex items-center justify-between text-[11px] text-[#9c846d]">
            <span>✦ Tipp: Klicke auf einen beliebigen Knotenpunkt im Diagramm, um direkt zum entsprechenden Tagebucheintrag zu springen.</span>
            <span className="font-cinzel text-[#d4af37]">{moodChartData.length} Einträge erfasst</span>
          </div>
        </div>

        {/* Filter- & Suchleiste */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-[#140e0a]/85 border border-[#4a2e16] p-3 rounded-xl shadow-lg">
          {/* Spiel-Filter Reiter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {gameFilters.map((tab) => {
              const isActive = selectedGameFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    try { sounds.playClick(); } catch (_) {}
                    setSelectedGameFilter(tab.id);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-cinzel font-semibold tracking-wide whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#3d2719] text-[#ffd992] border border-[#a06835] shadow-md shadow-[#3d2719]/40'
                      : 'text-[#ab9378] hover:text-[#ffd992] hover:bg-[#20150e] border border-transparent'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#1b110a] text-[#8e735b]">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Suchfeld */}
          <div className="relative min-w-[240px] sm:min-w-[280px]">
            <Search className="w-4 h-4 text-[#8a684b] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Artefakt, Fundort oder Stichwort..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0d0907] border border-[#5a3821] focus:border-[#ffd992] rounded-lg pl-9 pr-8 py-1.5 text-xs text-[#e8d7be] placeholder-[#7a5c43] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8a684b] hover:text-[#ffd992] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Vitrinen-Katalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredArtefakte.map((item) => {
            const resolvedImg = resolveImageUrl(item.bild);
            return (
              <div
                key={item.id}
                onClick={() => openArtefaktModal(item)}
                className="group relative bg-gradient-to-b from-[#1b120c] to-[#120b07] border border-[#4f321a] hover:border-[#ffd992] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#ffd992]/10 transition-all duration-200 flex flex-col cursor-pointer hover:-translate-y-1"
              >
                {/* Lichtakzent oben */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#ffd992]/40 to-transparent group-hover:via-[#ffd992] transition-colors" />

                {/* Spiel-Badge oben links */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span className="px-2 py-0.5 rounded text-[9px] font-cinzel font-semibold bg-[#0e0a07]/85 text-[#caa568] border border-[#6b4522]/80 backdrop-blur-sm shadow">
                    {item.spiel}
                  </span>
                </div>

                {/* Sockel / Bildbereich sauber zentriert */}
                <div className="relative w-full h-52 bg-gradient-to-b from-[#241710]/50 to-[#0e0a07] p-4 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,220,150,0.15),transparent_65%)] group-hover:scale-110 transition-transform duration-300 pointer-events-none" />
                  
                  <img
                    src={resolvedImg}
                    alt={item.name}
                    className="max-h-40 max-w-[85%] object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.85)] group-hover:scale-105 transition-all duration-200"
                    onError={(e) => {
                      e.currentTarget.src = LAYOUT_IMAGES.scion;
                    }}
                  />

                  {/* Klick-Hinweis */}
                  <div className="absolute bottom-2 right-2 p-1.5 rounded-full bg-[#120b07]/85 border border-[#8b5a2b] text-[#ffd992] opacity-0 group-hover:opacity-100 transition-opacity shadow">
                    <Eye className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Textbereich auf der Karte */}
                <div className="p-4 flex-1 flex flex-col justify-between border-t border-[#3e2413] bg-[#140e0a]/90">
                  <div>
                    <h3 className="font-cinzel text-sm sm:text-base font-bold text-[#ffd992] group-hover:text-white transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-[#bca78c] line-clamp-2 mt-1.5 leading-relaxed">
                      {item.beschreibung}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#2d1b0f] flex items-center justify-between text-[11px] text-[#caa568]">
                    <span className="flex items-center gap-1 truncate max-w-[170px] text-[#a1927d]">
                      <MapPin className="w-3 h-3 text-[#d4af37] shrink-0" />
                      <span className="truncate">{item.fundorte}</span>
                    </span>
                    <span className="font-cinzel text-[#ffd992] font-semibold text-[10px] group-hover:translate-x-0.5 transition-transform">
                      Details ➔
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 
        ========================================================================
        FESTES, SAUBERES INFO-FENSTER (MODAL)
        ========================================================================
        Ausgabe gemäß Anforderung:
        1. Name des Artefakts (große Überschrift)
        2. Bild des Artefakts (z. B. scion.png) sauber zentriert
        3. Textbereich mit zwei Abschnitten: "Beschreibung" und "Fundorte"
        ========================================================================
      */}
      {activeModalArtefakt && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveModalArtefakt(null)}
        >
          <div 
            className="relative w-full max-w-2xl max-h-[92vh] bg-[#160e0a] border-2 border-[#d4af37] rounded-2xl shadow-2xl overflow-hidden flex flex-col text-[#e8d7be]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header mit Spiel-Badge, großer Überschrift & Schließen-Button */}
            <div className="px-5 sm:px-6 py-4 border-b border-[#5c3a1c] bg-[#22140b] flex items-start justify-between gap-4">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#120a06] border border-[#8b5a2b] text-[#d4af37] font-cinzel text-[11px] font-semibold uppercase tracking-wider mb-1">
                  {activeModalArtefakt.spiel}
                </span>
                {/* 1. Name des Artefakts (große Überschrift) */}
                <h2 className="text-xl sm:text-2xl md:text-3xl font-cinzel font-bold text-[#ffd992] leading-tight">
                  {activeModalArtefakt.name}
                </h2>
                {activeModalArtefakt.untertitel && (
                  <p className="text-xs text-[#b89b7b] italic mt-0.5 font-cinzel">
                    {activeModalArtefakt.untertitel}
                  </p>
                )}
              </div>

              <button
                onClick={() => setActiveModalArtefakt(null)}
                className="p-1.5 rounded-lg bg-[#2e1c10] hover:bg-[#452917] text-[#caa568] hover:text-[#ffd992] border border-[#6b4522] transition cursor-pointer shrink-0 mt-1"
                title="Fenster schließen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 flex flex-col gap-5">
              
              {/* 2. Bild des Artefakts sauber zentriert in einer dunkleren Box mit goldenem Rahmen und ausreichend Platz */}
              <div className="w-full min-h-[270px] bg-gradient-to-b from-[#140c07] to-[#0a0503] border-2 border-[#d4af37]/80 rounded-xl p-5 sm:p-7 flex items-center justify-center shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.14),transparent_70%)] pointer-events-none" />
                <img
                  src={resolveImageUrl(activeModalArtefakt.bild)}
                  alt={activeModalArtefakt.name}
                  style={{
                    objectFit: 'contain',
                    width: '100%',
                    maxHeight: '250px',
                  }}
                  className="w-full max-h-[250px] object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.95)] z-10 transition-transform duration-200"
                  onError={(e) => {
                    e.currentTarget.src = LAYOUT_IMAGES.scion;
                  }}
                />
              </div>

              {/* 3. Textbereich mit zwei Abschnitten: "Beschreibung" und "Fundorte" */}
              <div className="flex flex-col gap-4">
                
                {/* ABSCHNITT 1: BESCHREIBUNG */}
                <div className="bg-[#1c120b] border border-[#482d18] rounded-xl p-4 shadow-md">
                  <h3 className="font-cinzel text-sm sm:text-base font-bold text-[#ffd992] flex items-center gap-2 mb-2 pb-1.5 border-b border-[#3d2412]">
                    <FileText className="w-4 h-4 text-[#e4c478]" />
                    <span>Beschreibung</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[#e0cfba] leading-relaxed">
                    {activeModalArtefakt.beschreibung}
                  </p>
                </div>

                {/* ABSCHNITT 2: FUNDORTE */}
                <div className="bg-[#1c120b] border border-[#482d18] rounded-xl p-4 shadow-md">
                  <h3 className="font-cinzel text-sm sm:text-base font-bold text-[#ffd992] flex items-center gap-2 mb-2 pb-1.5 border-b border-[#3d2412]">
                    <MapPin className="w-4 h-4 text-[#e4c478]" />
                    <span>Fundorte</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[#e0cfba] leading-relaxed">
                    {activeModalArtefakt.fundorte}
                  </p>
                </div>

                {/* Automatische Sprachausgabe (Kore) */}
                <TtsReader
                  title={activeModalArtefakt.name}
                  text={`${activeModalArtefakt.beschreibung}. Fundorte: ${activeModalArtefakt.fundorte}`}
                  autoPlay={true}
                />

                {/* Optionaler Link zum Tagebuch falls vorhanden */}
                {activeModalArtefakt.tagebuchId && onOpenDiaryEntry && (
                  <button
                    onClick={() => {
                      try { sounds.playPageTurn(); } catch (_) {}
                      setActiveModalArtefakt(null);
                      onOpenDiaryEntry(activeModalArtefakt.tagebuchId!);
                    }}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[#271810] hover:bg-[#3d2518] border border-[#8b5a2b] text-[#ffd992] text-xs font-cinzel font-semibold transition active:scale-95 cursor-pointer shadow mt-1"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#e4c478]" />
                    <span>Zugehörigen Tagebucheintrag im Archiv aufschlagen</span>
                  </button>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 sm:px-6 py-3 border-t border-[#442b17] bg-[#1a100a] flex items-center justify-between">
              <span className="text-[11px] text-[#8e735b] font-cinzel">
                Inventar-ID: {activeModalArtefakt.id.toUpperCase()}
              </span>
              <button
                onClick={() => setActiveModalArtefakt(null)}
                className="px-5 py-1.5 rounded-lg bg-[#d4af37] hover:bg-[#ffd992] text-black font-cinzel font-bold text-xs transition cursor-pointer active:scale-95 shadow"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ruhmeshalle;
