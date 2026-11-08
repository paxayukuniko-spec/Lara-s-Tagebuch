import { DiaryEntry } from '../types/database';

export const INITIAL_DIARY_ENTRIES: DiaryEntry[] = [
  {
    id: 'tr1996-arnak-ruins',
    entryNumber: 1,
    chapter: 'Expedition Pazifik',
    levelTitle: 'Die verlorenen Ruinen von Arnak',
    date: '2. Oktober 2025',
    location: 'Unkartierte Insel, Pazifischer Ozean',
    coordinates: '15°42\'S 154°18\'W',
    relic: 'Antike Tafeln & Obsidian-Pfeilspitzen',
    secrets: '4 / 4 Geheimnisse entdeckt',
    summary: 'Die Legenden waren wahr. Tief im unkartierten Pazifik liegt Arnak – eine einst blühende Zivilisation, bewacht von vogelartigen Kolossen und Pyramiden.',
    content: `Die Legenden waren wahr. Tief im unkartierten Pazifik, verborgen hinter dichten Nebelbänken und tückischen Riffen, liegt eine Insel, die in keinem modernen Atlas existiert. Die Einheimischen flüstern von Arnak – einer einst blühenden Zivilisation, die spurlos vom Antlitz der Erde verschwand.

Der Aufstieg durch den dichten Dschungel war brutal. Die Luft ist so feucht, dass das Atmen schwerfällt, und das unaufhörliche Summen von Insekten wird nur vom fernen, bedrohlichen Brüllen der Wächter unterbrochen. Ja, die Gerüchte stimmen: Die Ruinen sind nicht unbewohnt. Riesige, mystische Kreaturen bewachen die heiligen Stätten. Ich musste all mein Geschick aufwenden, um einem vogelartigen Koloss zu entkommen, der die Ausgrabungsstätte am Flussufer bewacht.

Ich habe mein Basislager am Fuße einer monumentalen Pyramide aufgeschlagen. Die Architektur ist faszinierend – eine Mischung aus mir bekannten präkolumbischen Stilen, aber mit einer völlig einzigartigen Symbolik. 

Bisherige Funde:
• Antike Tafeln: Die Inschriften erwähnen eine hochentwickelte Technologie oder Magie, die auf der Nutzung mystischer roter Rubine und Pfeilspitzen aus Obsidian basiert.
• Das Forschungstagebuch: Ich verbringe die Nächte damit, die Hieroglyphen zu entschlüsseln. Je weiter ich in der Hierarchie der Tempel nach oben steige, desto klarer wird mir, dass die Erbauer von Arnak versuchten, mit etwas zu kommunizieren, das weit über unserer Welt steht.

Morgen werde ich tiefer in den Tempel der Affenkonstellation vordringen. Meine Vorräte sind knapp, und meine Ausrüstung leidet unter dem Klima, aber der Drang, das letzte Geheimnis dieser Insel zu lüften, treibt mich an. Falls mich jemand sucht – ich bin auf der Spur der Waheit....`,
    handwrittenNotes: [
      'Vogelartiger Koloss bewacht die Ausgrabungsstätte am Flussufer.',
      'Monumentale Pyramide mit einzigartiger präkolumbischer Symbolik.',
      'Nächstes Ziel: Tempel der Affenkonstellation.'
    ],
    media: [
      {
        id: 'media-arnak-1',
        entryId: 'tr1996-arnak-ruins',
        type: 'image',
        title: 'Die verlorenen Ruinen von Arnak',
        caption: 'Die monumentale Pyramide und Dschungel-Ruinen von Arnak.',
        url: '/src/assets/images/arnak.jpg',
        isPlaceholder: false,
        dateAdded: '2025-10-02',
        tags: ['Arnak', 'Ruinen', 'Dschungel', 'Pyramide']
      }
    ],
    voiceName: 'Kore',
    estimatedReadTime: '4 Min.',
    mood: 'mystisch'
  },
  {
    id: 'tr1996-00-kalkutta-dads-diary',
    entryNumber: 2,
    chapter: 'Prolog: Vorkriegszeit & Dads Tagebuch',
    levelTitle: 'Imperial Hotel, Kalkutta',
    date: '03. Oktober 2026',
    location: 'Kalkutta, Indien',
    coordinates: '22°34\'22"N 88°21\'50"E',
    relic: 'Verschollenes Tagebuch von Lord Croft',
    secrets: 'Dads Tagebuch & Geheimnis der goldenen Pyramide',
    summary: 'Larson Conway traf mich im Hotel in Kalkutta und warf Dads Tagebuch auf den Tisch. Sie sind in Croft Manor eingebrochen!',
    content: `Larson Conway traf mich im hotel in Kalkutta. Er schmiss mir das Tagebuch von Dad auf den Tisch: „Wir wissen, was sie vorhaben, Miss Croft. Finden und suchen sie die goldene Pyramide für uns“ – Mrs. Natla wird sie reich dafür belohnen.

Jetzt weiß ich, dass sie in Croft Manor eingebrochen und Dads Tagebuch gestohlen hatten. Was soll ich nur machen? Sie sind mir auf den Fersen, noch habe ich ein wenig Zeit... Ich brauche diesen goldenen Schlüssel. Morgen fliege ich nach Peru.`,
    handwrittenNotes: [
      'Larson Conway arbeitet für Jacqueline Natla.',
      'Dads Tagebuch wurde aus Croft Manor gestohlen!',
      'Morgen Flug nach Peru – den goldenen Schlüssel finden.'
    ],
    media: [
      {
        id: 'media-00-1',
        entryId: 'tr1996-00-kalkutta-dads-diary',
        type: 'image',
        title: 'Dads gestohlenes Tagebuch',
        caption: 'Das aus Croft Manor entwendete Tagebuch von Lord Croft, das Larson Conway im Imperial Hotel auf den Tisch schmiss.',
        url: '/src/assets/images/laras-tagebuch.jpg',
        isPlaceholder: false,
        dateAdded: '2026-10-03',
        tags: ['Tagebuch', 'Lord Croft', 'Croft Manor', 'Kalkutta']
      },
      {
        id: 'media-00-2',
        entryId: 'tr1996-00-kalkutta-dads-diary',
        type: 'image',
        title: 'Imperial Hotel, Kalkutta',
        caption: 'Der Schauplatz des unangenehmen Treffens mit Larson Conway.',
        url: '/src/assets/images/imperial_hotel.jpg',
        isPlaceholder: false,
        dateAdded: '2026-10-03',
        tags: ['Kalkutta', 'Imperial Hotel', 'Larson']
      }
    ],
    voiceName: 'Kore',
    estimatedReadTime: '2 Min.',
    mood: 'gefährlich'
  },
  {
    id: 'tr1996-01-kalkutta',
    entryNumber: 3,
    chapter: 'Prolog: Der Auftrag',
    levelTitle: 'Imperial Hotel, Kalkutta',
    date: '14. Oktober 1996',
    location: 'Kalkutta, Indien',
    coordinates: '22°34\'22"N 88°21\'50"E',
    relic: 'Auftragsakte Natla Technologies',
    secrets: 'Informationen über Atlantis',
    summary: 'Ein unerwartetes Treffen im Imperial Hotel mit Jacqueline Natla führt mich auf die Spur des mythischen Scion in den peruanischen Anden.',
    content: `Ich saß in der schwülen Nachmittagshitze der Hotelveranda in Kalkutta, als ein gewisser Larson Conway an meinen Tisch trat. Er überreichte mir ein Magazin mit einem Bericht über meine letzte Expedition und stellte mich via Videoverbindung seiner Auftraggeberin vor: Jacqueline Natla, Vorstandsvorsitzende von Natla Technologies.

Natla hat ein erstaunlich scharfes Gespür für Antiquitäten – oder vielmehr für uralte Machtquellen. Sie will, dass ich ein Relikt namens "Scion" aus den peruanischen Bergen berge. Konkret aus dem Grab von Qualopec, einem Herrscher des versunkenen Kontinents Atlantis, der der Legende nach tief in den unberührten Ruinen von Vilcabamba ruht.

Ich kenne die Berichte über Vilcabamba. Bisher hielten die meisten Archäologen die Stadt für einen Mythos der Inka-Könige. Doch wenn Natlas Satellitenaufnahmen und alte Karten auch nur zur Hälfte stimmen, verbirgt das ewige Eis der Anden weit mehr als nur Inka-Gold. 

Ich packe meine Zwillings-Browning-Pistolen, meinen Kompass und winterfeste Expeditionskleidung. Morgen früh geht der Flug nach Lima, und von dort weiter ins Hochland.`,
    handwrittenNotes: [
      'Larson wirkt wie ein Schläger im Maßanzug – im Auge behalten.',
      'Natla erwähnt ein "erstes Stück". Gibt es mehrere Fragmente des Scion?',
      'Ausrüstung: 9mm Munition aufstocken, Kletterhaken, Magnesium-Fackeln.'
    ],
    media: [
      {
        id: 'media-01-1',
        entryId: 'tr1996-01-kalkutta',
        type: 'image',
        title: 'Laras Schreibtisch in Croft Manor',
        caption: 'Vorbereitung der Expeditionskarten und Reisetagebücher vor dem Aufbruch nach Peru.',
        url: '/src/assets/images/lara_desk_hero_1790787354278.jpg',
        isPlaceholder: false,
        dateAdded: '1996-10-14',
        tags: ['Croft Manor', 'Ausrüstung', 'Pistolen', 'Tagebuch']
      },
      {
        id: 'media-01-2',
        entryId: 'tr1996-01-kalkutta',
        type: 'image',
        title: 'Imperial Hotel, Kalkutta',
        caption: 'Die Hotelveranda in Kalkutta, wo das Treffen mit Larson Conway und Jacqueline Natla stattfand.',
        url: '/src/assets/images/imperial_hotel.jpg',
        isPlaceholder: false,
        dateAdded: '1996-10-14',
        tags: ['Kalkutta', 'Imperial Hotel', 'Natla', 'Lara Croft']
      }
    ],
    voiceName: 'Kore',
    estimatedReadTime: '2 Min.',
    mood: 'nachdenklich'
  },
  {
    id: 'tr1996-02-caves',
    entryNumber: 3,
    chapter: 'Peru – Die Anden',
    levelTitle: 'Level 1: Die Höhlen (Caves)',
    date: '24. Oktober 1996',
    location: 'Schneegrat des Vilcabamba-Massivs, Peru',
    coordinates: '13°09\'47"S 72°32\'44"W',
    relic: 'Keine Artefaktfunde (Zugangsschlüssel)',
    secrets: '3 / 3 Geheimnisse entdeckt',
    summary: 'Mein peruanischer Führer fiel einem Rudel Berglöwen zum Opfer. Allein habe ich den gewaltigen Steintor-Mechanismus in die frostigen Höhlen überwunden.',
    content: `Der Schneesturm in den peruanischen Pässen war gnadenlos. Kaum hatten wir die Klippe erreicht, stürzten hungrige Wölfe aus dem Nebel. Mein einheimischer Bergführer geriet in Panik und bezahlte es mit dem Leben, bevor ich eingreifen konnte. Das massive Inka-Portal fiel krachend hinter mir ins Schloss – es gibt nun keinen Rückweg mehr, nur den Weg nach vorn durch das ewige Eis.

In den Höhlen herrscht eine feuchte, frostige Kälte. Fledermäuse kreischen von den Deckenstalaktiten, und auf den vereisten Felsvorsprüngen musste ich mich gegen weitere Wolfsrudel verteidigen. 

Doch die Architektur hier ist atemberaubend: Moosbewachsene Hängebrücken spannen sich über bodenlose Abgründe. Ich habe versteckte Nischen mit alten Heiltinkturen und Munitionskisten früherer unglücklicher Entdecker gefunden. Am Ende des Stollens öffnet sich ein gigantisches Steintor mit Schnitzereien eines gefiederten Schlangengottes – das Eingangstor zur verlorenen Stadt Vilcabamba!`,
    handwrittenNotes: [
      'Bodenluken geben bei Belastung nach – schneller Absprung nötig!',
      'Hinter dem Efeuvorhang im Hauptschacht liegt ein geheimer Schalter.',
      'Luftzug riecht nach altem Süßwasser. Wasserleitungen müssen in der Nähe sein.'
    ],
    media: [
      {
        id: 'media-02-1',
        entryId: 'tr1996-02-caves',
        type: 'image',
        title: 'Angriff der Wölfe im Höhleneingang',
        caption: 'Hungrige Andenwölfe stürzen aus dem Schneesturm vor dem verschlossenen Inka-Tor.',
        url: '/src/assets/images/woelfe.jpg',
        isPlaceholder: false,
        dateAdded: '1996-10-24',
        tags: ['Höhlen', 'Wölfe', 'Peru', 'Anden']
      },
      {
        id: 'media-02-2',
        entryId: 'tr1996-02-caves',
        type: 'image',
        title: 'Eingangsstollen des Felsmassivs',
        caption: 'Der verschneite Abstieg in die unterirdischen Hallen und Katakomben der Anden.',
        url: '/src/assets/images/startseite.jpg',
        isPlaceholder: false,
        dateAdded: '1996-10-24',
        tags: ['Höhlen', 'Peru', 'Eingang', 'Anden']
      }
    ],
    voiceName: 'Kore',
    estimatedReadTime: '3 Min.',
    mood: 'gefährlich'
  },
  {
    id: 'tr1996-03-vilcabamba',
    entryNumber: 4,
    chapter: 'Peru – Das vergessene Reich',
    levelTitle: 'Level 2: Die Stadt Vilcabamba',
    date: '25. Oktober 1996',
    location: 'Unterirdische Stadt Vilcabamba',
    coordinates: '13°10\'12"S 72°33\'05"W',
    relic: 'Silberner Inka-Schlüssel & Goldidol',
    secrets: '3 / 3 Geheimnisse entdeckt',
    summary: 'In der versunkenen Metropole Vilcabamba meisterte ich geflutete Kammern, fand den Silberschlüssel und öffnete das Tor zu den Heiligtümern.',
    content: `Was für ein Anblick: Eine ganze verborgene Stadt, geschützt unter einer gewaltigen Felskuppel! Häuserzeilen aus fugenlos behauenem Stein, unterirdische Flüsse und verlassene Wohnanlagen zeugen von der hochentwickelten Kultur der letzten Inka-Könige.

Doch die Stadt ist nicht verlassen. Riesige peruanische Höhlenbären haben in den Vorratsräumen Quartier bezogen. Ich musste auf die Dächer klettern und mich durch enge Fenstergitter zwängen. 

In einem tiefen, eisigen Wasserbecken fand ich nach einem langen Tauchgang ein verstecktes Tunnelsystem. Dort unten lag der Silberne Schlüssel, der mir den Zutritt zu den oberen Tempelbalkonen gewährte. Hinter den verzierten Holztoren stieß ich auf einen vergoldeten Idol-Schrein – und eine Inschrift, die auf das 'Verlorene Tal' verweist. Der Puls schlägt mir bis zum Hals: Die Legenden sprechen von einem Ort, an dem die Evolution vor Millionen Jahren stehen geblieben ist.`,
    handwrittenNotes: [
      'Tauchgang: Lungenkapazität beachten, Strömung drückt gegen die Felswand.',
      'Silberschlüssel passt in das Schloss neben dem dreifachen Fallgatter.',
      'Spuren an den Knochenresten stammen nicht von Bären... etwas viel Größeres!'
    ],
    media: [
      {
        id: 'media-03-1',
        entryId: 'tr1996-03-vilcabamba',
        type: 'image',
        title: 'Der Silberne Inka-Schlüssel',
        caption: 'Geborgen aus dem gefluteten Becken von Vilcabamba – öffnet die Tore zu den Tempelbalkonen.',
        url: '/src/assets/images/silbener.schlüssel.jpg',
        isPlaceholder: false,
        dateAdded: '1996-10-25',
        tags: ['Vilcabamba', 'Silberschlüssel', 'Schlüssel', 'Artefakt']
      },
      {
        id: 'media-03-2',
        entryId: 'tr1996-03-vilcabamba',
        type: 'image',
        title: 'Goldener Schlüssel des Tempels',
        caption: 'Der antike Zierschlüssel gewährt Einlass zu den inneren Schreinen und dem Verlorenen Tal.',
        url: '/src/assets/images/goldener_schlüssel_Bibliotek.jpg',
        isPlaceholder: false,
        dateAdded: '1996-10-25',
        tags: ['Vilcabamba', 'Goldschlüssel', 'Tempel', 'Schlüssel']
      }
    ],
    voiceName: 'Kore',
    estimatedReadTime: '3 Min.',
    mood: 'mystisch'
  },
  {
    id: 'tr1996-04-lost-valley',
    entryNumber: 5,
    chapter: 'Peru – Prähistorisches Wunder',
    levelTitle: 'Level 3: Das Verlorene Tal (The Lost Valley)',
    date: '26. Oktober 1996',
    location: 'Isoliertes Vulkantal, Ostflanke der Anden',
    coordinates: '13°11\'55"S 72°31\'18"W',
    relic: 'Drei antike Zahnräder des Wasserdamms',
    secrets: '5 / 5 Geheimnisse entdeckt',
    summary: 'Eine der unglaublichsten Entdeckungen der Menschheit: Ein prähistorischer Mikrokosmos mit lebenden Velociraptoren und dem Tyrannosaurus Rex!',
    content: `Wenn mir das jemand vor einer Woche erzählt hätte, hätte ich ihn für verrückt erklärt. Ich stieg einem tosenden Wasserfall flussabwärts nach und stand plötzlich unter offenem, sonnendurchflutetem Himmel in einem gigantischen Kraterkessel – dem Verlorenen Tal.

Der tosende Wasserfall blockierte den Durchgang zur Tempelpyramide. Um den Fluss umzuleiten, musste ich das monumentale Räderwerk auf der Dammkrone wieder in Gang setzen. Die drei bronzenen Zahnräder waren jedoch im Tal verstreut.

Als ich die Dschungellichtung betrat, erzitterte der Boden. Zuerst griffen zwei flinke, vogelartige Raubsaurier an – Velociraptoren! Doch das war erst der Anfang: Aus dem tropischen Farn brach mit markerschütterndem Brüllen ein ausgewachsener Tyrannosaurus Rex hervor! 

Mit gezogenen Pistolen, Hechtsprüngen und Ausnutzung der Felsspalten gelang es mir nach einem zermürbenden Kampf, das Urzeitmonster zu bezwingen. Mit den drei Zahnrädern konnte ich schließlich den Damm schließen. Das trockengelegte Flussbett gab den Weg in das Grabmal von Qualopec frei.`,
    handwrittenNotes: [
      'T-Rex Taktik: Niemals auf offener Fläche stehen bleiben; Nischen bieten Schutz vor seinen Zähnen.',
      'Zahnrad 1: Im Wasserfallbecken.',
      'Zahnrad 2: Auf dem Felsplateau über den Brücken.',
      'Zahnrad 3: In der Höhle hinter dem Nest der Raptoren.'
    ],
    media: [
      {
        id: 'media-04-1',
        entryId: 'tr1996-04-lost-valley',
        type: 'sketch',
        title: 'Feldskizze des Verlorenen Tals & T-Rex',
        caption: 'Zeichnung der Staustufe, des Wasserfalls und der prähistorischen Silhouette des Räubers.',
        url: '/src/assets/images/lost_valley_sketch_1790787448760.jpg',
        isPlaceholder: false,
        dateAdded: '1996-10-26',
        tags: ['Lost Valley', 'Dinosaurier', 'T-Rex', 'Wasserfall']
      },
      {
        id: 'media-04-2',
        entryId: 'tr1996-04-lost-valley',
        type: 'image',
        title: 'Antikes Bronze-Zahnrad des Wasserdamms',
        caption: 'Eines der drei monumentalen Zahnräder zur Umleitung des tosenden Wasserfalls vor Qualopecs Pyramide.',
        url: '/src/assets/images/zahnrad.jpg',
        isPlaceholder: false,
        dateAdded: '1996-10-26',
        tags: ['Zahnräder', 'Mechanik', 'Bronze', 'Wasserdamm']
      },
      {
        id: 'media-04-3',
        entryId: 'tr1996-04-lost-valley',
        type: 'image',
        title: 'Raptoren im Verlorenen Tal',
        caption: 'Gefährliche Raubsaurier im dichten Urwald des prähistorischen Tals.',
        url: '/src/assets/images/raptoren.jpg',
        isPlaceholder: false,
        dateAdded: '1996-10-26',
        tags: ['Lost Valley', 'Raptoren', 'Dinosaurier', 'Urwald']
      },
      {
        id: 'media-04-4',
        entryId: 'tr1996-04-lost-valley',
        type: 'image',
        title: 'Der Tyrannosaurus Rex',
        caption: 'Der gewaltige Herrscher des Verlorenen Tals greift aus dem dichten Urwald an.',
        url: '/src/assets/images/t-rex.jpg',
        isPlaceholder: false,
        dateAdded: '1996-10-26',
        tags: ['Lost Valley', 'T-Rex', 'Dinosaurier', 'Tyrannosaurus']
      }
    ],
    voiceName: 'Kore',
    estimatedReadTime: '4 Min.',
    mood: 'triumphierend'
  },
  {
    id: 'tr1996-05-qualopec',
    entryNumber: 6,
    chapter: 'Peru – Das atlanteanische Vermächtnis',
    levelTitle: 'Level 4: Das Grab von Qualopec',
    date: '27. Oktober 1996',
    location: 'Tiefenkammern des Grabmals von Qualopec',
    coordinates: '13°12\'08"S 72°30\'50"W',
    relic: 'Erstes Fragment des Scion von Atlantis',
    secrets: '3 / 3 Geheimnisse entdeckt',
    summary: 'Das Erbeuten des ersten Scion-Stücks im Heiligtum des Königs Qualopec löste tödliche Fallen und einen Erdbeben-Kollaps aus. Am Ausgang lauerte Larson.',
    content: `Das Grabmal unterscheidet sich grundlegend von jeglicher Inka-Architektur. Die Wände bestehen aus glatt poliertem, schwarzem Basalt, überzogen mit glühenden kybernetischen Mustern – pure Technologie aus Atlantis!

Drei Seitenflügel beherbergten perfide Mechanismen: Schwingende Stachelkugeln, Fallgruben und herabstürzende Deckenblöcke. Nachdem ich alle Tore entriegelt hatte, betrat ich den Thronsaal. Dort saß die mumifizierte Gestalt des Königs Qualopec, umgeben von zwei erstarrten Kriegern.

Auf einem Sockel vor ihm schwebte das Relikt: Das erste Teil des Scion! Eine pyramidenförmige Legierung, die pulsierende Wärme und unendliche Energie ausstrahlt. Kaum nahm ich es an mich, begann das Grabmal einzustürzen! 

Mit Müh und Not entkam ich den herabfallenden Trümmern ans Tageslicht. Doch am Wasserfall wartete kein Empfangskomitee, sondern Larson Conway mit gezogener Schrotflinte. Natla hatte mich von Anfang an nur als Spürhund benutzt! Nach einem kurzen Feuergefecht konnte ich Larson entwaffnen. Er gestand, dass Natla ihren französischen Schläger Pierre Dupont nach Griechenland geschickt hat, um das zweite Scion-Teil zu bergen.

Mein nächstes Ziel steht fest: Das Kloster St. Francis Folly in Griechenland. Sie werden mich nicht aufhalten.`,
    handwrittenNotes: [
      'Das Scion vibriert in Resonanz mit Bio-Elektrizität. Nicht von dieser Welt.',
      'Qualopecs Mumie drehte den Kopf, als ich den Sockel berührte... kein normaler Toter!',
      'Larson lebt, ist aber kampfunfähig. Notizen über Griechenland aus seiner Tasche gesichert.'
    ],
    media: [
      {
        id: 'media-05-1',
        entryId: 'tr1996-05-qualopec',
        type: 'sketch',
        title: 'Skizze des Scion-Fragments & Thronsaals',
        caption: 'Das mystische Scion auf dem Altar des Qualopec mit atlanteanischen Glyphen.',
        url: '/src/assets/images/scion_sketch_1790787384550.jpg',
        isPlaceholder: false,
        dateAdded: '1996-10-27',
        tags: ['Scion', 'Qualopec', 'Atlantis', 'Relikt']
      },
      {
        id: 'media-05-2',
        entryId: 'tr1996-05-qualopec',
        type: 'image',
        title: 'Das Scion von Atlantis',
        caption: 'Das erste pyramidenförmige Scion-Fragment, geborgen aus dem Heiligtum des Herrschers Qualopec.',
        url: '/src/assets/images/scion.jpg',
        isPlaceholder: false,
        dateAdded: '1996-10-27',
        tags: ['Scion', 'Qualopec', 'Atlantis', 'Relikt', 'Artefakt']
      }
    ],
    voiceName: 'Kore',
    estimatedReadTime: '4 Min.',
    mood: 'triumphierend'
  },
  {
    id: 'tr1996-06-st-francis-folly',
    entryNumber: 7,
    chapter: 'Kapitel 6/10: Griechenland',
    levelTitle: 'St. Francis\' Folly (Die Prüfungen der Götter)',
    date: '02. November 1996',
    location: 'Kloster St. Francis & Götterhallen, Griechenland',
    coordinates: '38°28\'42"N 22°30\'05"E',
    relic: 'Vier Götterschlüssel (Thor, Damokles, Neptun & Atlas)',
    secrets: '4 / 4 Geheimnisse entdeckt',
    summary: 'Auf den Fersen von Pierre Dupont drang ich in das vertikale Labyrinth von St. Francis Folly vor und bestand die vier tödlichen Prüfungen von Thor, Damokles, Neptun und Atlas.',
    content: `Die Ausläufer des Parnass-Gebirges in Griechenland ragen schroff in den stürmischen Abendhimmel. Tief unter den verfallenen Mauern des mittelalterlichen Klosters St. Francis verbirgt sich ein uraltes Geheimnis: Eine titanische Anlage, errichtet über einem monumentalen Schacht, der direkt in das Herz der antiken Mythologie führt.

Kaum hatte ich die Vorhalle betreten, peitschten mir Schüsse entgegen. Pierre Dupont! Natlas französischer Auftragsmörder lauerte auf einem der oberen Säulenbalkone. Nach einem kurzen, heftigen Schusswechsel zog er sich feige ins Dunkel der Gänge zurück. Er weiß genau, dass ich die Arbeit für ihn erledigen soll.

Was mich hinter dem großen Portal erwartete, raubte mir den Atem: Ein schwindelerregender, mehrere Stockwerke tiefer Abgrund. Schwebende Steinplattformen ragen ins Nichts, umschwirrt von Fledermäusen, während aus der Tiefe das Fauchen hungriger Löwen widerhallt. An den Wänden dieses monumentalen Turms befinden sich die vier Prüfungskammern der Götter, deren Schlüssel das gewaltige Sanktum-Portal am Grund entriegeln:

1. Die Kammer des Thor: Ein Raum elektrischer Hochspannung. Über einem gewaltigen Amboss hängt ein tonnenschwerer Steinhammer. Als ich die Trittplatte betrat, zuckten Blitze durch den Raum und der Hammer krachte mit donnerndem Getöse herab – nur ein Hechtsprung im letzten Sekundenbruchteil rettete mich vor dem sicheren Zerquetschen.
2. Die Kammer des Damokles: Auf den ersten Blick eine friedliche Ruhmeshalle voller Säulen. Doch der Blick nach oben ließ mir das Blut in den Adern gefrieren: Die gesamte Decke ist gespickt mit Hunderten rasiermesserscharfen Klingen. Bei jedem Schritt lösten sich Schwerter und bohrten sich zischend in den Marmorboden.
3. Die Kammer des Neptun: Ein scheinbar bodenloser Wassertank mit reißenden Strömungswirbeln. Ich musste tief in das eisige Nass hinabtauchen, gegen den gewaltigen Sog ankämpfen und den geheimen Schalter hinter Neptuns Dreizack umlegen, bevor mir der Sauerstoff ausging.
4. Die Kammer des Atlas: Eine steile Rampe, auf deren Spitze der Schlüssel lockte. Kaum hatte ich die Mitte erklommen, löste sich die gigantische Steinkugel – die Last des Himmelsgewölbes – und rollte unaufhaltsam auf mich zu. Ein gezielter Rückwärtssalto in den Schutzgraben ließ die Kugel haarscharf über meinen Kopf hinwegdonnern.

Mit allen vier Schlüsseln im Rucksack stieg ich zum Grund des Schachtes hinab. Die vier Schlösser klickten ins Werk, und das massive Portal zum Kolosseum schwang auf. Dupont ist irgendwo vor mir – aber das zweite Fragment des Scion gehört mir!`,
    handwrittenNotes: [
      'Thor-Kammer: Das Zischen kündigt die Entladung an – sofort von der Trittplatte springen!',
      'Damokles: Ruhigen Schritt bewahren. Auf den Schattenwurf der fallenden Schwerter achten.',
      'Neptuns Zisterne: Atem haargenau einteilen; die Strömung zieht unbarmherzig nach unten.',
      'Atlas-Rampe: Kugel löst sich bei halber Steigung – Salto rückwärts in die Schutzgrube!',
      'Pierre Dupont meidet das offene Duell. Er wartet auf eine Schwachstelle – Pistolen griffbereit halten.'
    ],
    media: [
      {
        id: 'media-06-1',
        entryId: 'tr1996-06-st-francis-folly',
        type: 'image',
        title: 'Thors Hammer & Blitzkammer',
        caption: 'Der gigantische Steinhammer der Thor-Prüfung schlägt bei Betreten des Ambosses mit vernichtender Wucht nieder.',
        url: '/src/assets/images/thor.hammer.jpg',
        isPlaceholder: false,
        dateAdded: '1996-11-02',
        tags: ['Griechenland', 'Thor', 'Hammer', 'Prüfung', 'Schlüssel']
      },
      {
        id: 'media-06-2',
        entryId: 'tr1996-06-st-francis-folly',
        type: 'image',
        title: 'Die Schwerter des Damokles',
        caption: 'Dutzende rasiermesserscharfe Klingen hängen von der Decke – jede Erschütterung lässt sie unbarmherzig herabfallen.',
        url: '/src/assets/images/damocles.schwert.jpg',
        isPlaceholder: false,
        dateAdded: '1996-11-02',
        tags: ['Griechenland', 'Damokles', 'Schwert', 'Falle', 'Schlüssel']
      },
      {
        id: 'media-06-3',
        entryId: 'tr1996-06-st-francis-folly',
        type: 'image',
        title: 'Neptuns Dreizack & Flutkammer',
        caption: 'Tief unter Wasser liegt der Schlüssel des Meeresgottes; Gegenströmungen machen den Tauchgang zu einem Wettlauf gegen den Erstickungstod.',
        url: '/src/assets/images/neptuns.gabel.jpg',
        isPlaceholder: false,
        dateAdded: '1996-11-02',
        tags: ['Griechenland', 'Neptun', 'Dreizack', 'Wasser', 'Schlüssel']
      },
      {
        id: 'media-06-4',
        entryId: 'tr1996-06-st-francis-folly',
        type: 'image',
        title: 'Atlas Kugel & Steilrampe',
        caption: 'Die gigantische Steinkugel stürzt die Steigung hinab – nur ein gezielter Salto in die Fallgrube verhindert das Zerquetschen.',
        url: '/src/assets/images/atlas.kugel.jpg',
        isPlaceholder: false,
        dateAdded: '1996-11-02',
        tags: ['Griechenland', 'Atlas', 'Kugel', 'Prüfung', 'Schlüssel']
      }
    ],
    voiceName: 'Kore',
    estimatedReadTime: '4 Min.',
    mood: 'heroisch'
  },
  {
    id: 'tr1996-07-colosseum',
    entryNumber: 8,
    chapter: 'Kapitel 7/10: Griechenland',
    levelTitle: 'Das Kolosseum (The Colosseum)',
    date: '03. November 1996',
    location: '🏛️ Antikes Kolosseum & Arena, Griechenland',
    coordinates: '37°58\'12"N 23°43\'35"E',
    relic: '🔑 Rostiger Schlüssel & Magischer Wappen-Schlüssel',
    secrets: '3 / 3 Geheimnisse entdeckt',
    summary: 'Ich habe die Arena des antiken Kolosseums betreten. Die Hallen sind voller Gefahren, wilder Tiere und den Spuren früherer Gladiatorenkämpfe. Um tiefer vorzudringen, musste ich die Kaiserloge erreichen.',
    content: `Die gewaltigen Ausläufer des antiken Kolosseums ragen majestätisch in den griechischen Himmel. Wo einst Gladiatoren um ihr Leben kämpften, streifen heute hungrige Löwen, Gorillas und Fledermäuse durch die verfallenen Ränge.

Mein Weg in die Tiefe ist blockiert. Die kaiserliche Loge birgt die Mechanismen, doch die Tore dorthin sind fest verschlossen. Ich musste mich durch die dunklen Gänge unter der Arena kämpfen und die verborgenen Druckplatten aktivieren, um den Zugang zum obersten Balkon freizulegen. Jeder Schritt hier drinnen hallt wie ein Echo der Vergangenheit.

Pierre Dupont ist mir dicht auf den Fersen, ich kann seine Anwesenheit spüren. Er lauert auf den Rängen und wartet darauf, dass ich die Drecksarbeit für ihn erledige. Nachdem ich den rostigen Schlüssel im feuchten Kellerlabyrinth geborgen und den extrem knappen Zeitschalter für die oberste Loge mit einem gewagten Sprint bezwungen hatte, schwang das Gitter zur Arena auf. Der Weg in die tiefen Katakomben ist frei!`,
    handwrittenNotes: [
      'Löwen-Zwinger: Vorsicht beim Betreten der Sand-Arena! Sobald die Gitter hochgehen, stürmen Raubkatzen aus den Ecken – Pistolen bereithalten.',
      'Kaiserloge: Der Zeitschalter für das obere Tor ist extrem knapp bemessen. Nach dem Drücken der Platte sofort sprinten und die Ecken schneiden!',
      'Pierre Dupont: Er lauert auf den Rängen. Nicht auf einen langen Schusswechsel einlassen, sondern Deckung suchen und ihn in die Flucht schlagen.'
    ],
    media: [
      {
        id: 'media-07-1',
        entryId: 'tr1996-07-colosseum',
        type: 'sketch',
        title: 'Feldskizze des Kolosseums & Arena',
        caption: 'Handgezeichnete Skizze der monumentalen Arena-Bögen, Säulenreihen und Ränge des antiken Kolosseums.',
        url: '/src/assets/images/colosseum_sketch_1790853098391.jpg',
        isPlaceholder: false,
        dateAdded: '1996-11-03',
        tags: ['Griechenland', 'Kolosseum', 'Arena', 'Skizze', 'Ruinen']
      },
      {
        id: 'media-07-2',
        entryId: 'tr1996-07-colosseum',
        type: 'image',
        title: 'Dolch von Xian (Replika / Fundstück)',
        caption: 'Ein mystisches Relikt, das Legenden nach dem Kaiser von China die Macht eines Drachen verleiht. Gut versteckt in den oberen Kammern.',
        url: '/src/assets/images/dolch_von_xian.jpg',
        isPlaceholder: false,
        dateAdded: '1996-11-03',
        tags: ['Kolosseum', 'Dolch von Xian', 'Relikt', 'Artefakt']
      },
      {
        id: 'media-07-3',
        entryId: 'tr1996-07-colosseum',
        type: 'image',
        title: 'Rostiger Schlüssel & Kaiserlicher Wappen-Schlüssel',
        caption: 'Gefunden in den tiefen Kellern des Kolosseums, um das Haupttor zur Gladiatoren-Loge zu entriegeln.',
        url: '/src/assets/images/goldener_schlüssel_Bibliotek.jpg',
        isPlaceholder: false,
        dateAdded: '1996-11-03',
        tags: ['Kolosseum', 'Schlüssel', 'Mechanismus', 'Griechenland']
      },
      {
        id: 'media-07-4',
        entryId: 'tr1996-07-colosseum',
        type: 'image',
        title: 'Silberner Schlüssel der Katakomben',
        caption: 'Versteckt hinter den Säulen des Auditoriums – entriegelt die tiefste Kammer des Kolosseums.',
        url: '/src/assets/images/silbener.schlüssel.jpg',
        isPlaceholder: false,
        dateAdded: '1996-11-03',
        tags: ['Kolosseum', 'Silberner Schlüssel', 'Katakomben']
      }
    ],
    voiceName: 'Kore',
    estimatedReadTime: '4 Min.',
    mood: 'heroisch'
  },
  {
    id: 'tr1996-08-palace-midas',
    entryNumber: 9,
    chapter: 'Kapitel 8/10: Griechenland',
    levelTitle: 'Der Palast des Midas (Palace Midas)',
    date: '04. November 1996',
    location: '🏛️ Ruinen des Midas-Palastes, Griechenland',
    coordinates: '38°29\'01"N 22°30\'08"E',
    relic: '🔑 Drei goldene Barren für den Ausgang',
    secrets: '3 / 3 Geheimnisse entdeckt',
    summary: 'Im Palast des Königs Midas verbirgt eine verfluchte Statue das Geheimnis des Weiterkommens. Drei rohe Bleibarren müssen verwandelt werden, um das Tor im Midas-Garten zu öffnen.',
    content: `Ich habe die prachtvollen Hallen des Königs Midas betreten. Im Zentrum des Palastes steht seine riesige, zerbrochene Statue. Die Legende ist wahr: Ihre abgebrochene Hand besitzt noch immer die tödliche, magische Kraft, alles in reines Gold zu verwandeln. Ein einziger unvorsichtiger Schritt auf die Handfläche wäre mein Ende – eine goldene Gestalt eines früheren Abenteurers steht als stumme Warnung im Raum.

Um diesen Ort zu verlassen, musste ich das Geheimnis der drei großen Hallen lösen – der Garten mit dem Aquädukt, die Säulenhalle und der Raum mit den tödlichen Feuersäulen. In jeder Halle lag ein schwerer, wertloser Bleibarren:
1. Die Feuersäulen-Kammer: Glühende Pfeiler flammen in festem Rhythmus auf. Nur präzise Sprünge beim Verlöschen der Flammen verhindern den Feuertod.
2. Die Stachelhalle: Schwere Steinblöcke müssen bewegt werden, während von der Decke herabstürzende Stacheln drohen.
3. Der Aquädukt-Garten: Über schmale Felsvorsprünge und überflutete Grotten gelangte ich zum dritten Barren.

Erst als ich diese Bleibarren auf die ausgestreckte Hand des Midas legte, vollzog sich die Alchemie: Mit gleißendem Licht verwandelten sie sich in pures Gold. Eingesetzt in die drei Nischen am Gartentor schwang das massive Portal auf.`,
    handwrittenNotes: [
      'Die Midas-Hand: STRIKTES BETRETUNGSVERBOT! Die Magie ist aktiv. Wer die Handfläche berührt, erstarrt sofort zu einer goldenen Statue.',
      'Feuersäulen-Raum: Das Timing muss perfekt sein. Die Plattformen flammen in festem Rhythmus auf. Nur springen, wenn das Feuer gerade erlischt!',
      'Stachel-Halle: Die Kisten im Säulenraum aktivieren herabstürzende Deckenstacheln. Erst den Weg genau prüfen, bevor ein Block gezogen wird.'
    ],
    media: [
      {
        id: 'media-08-1',
        entryId: 'tr1996-08-palace-midas',
        type: 'image',
        title: 'Die magische Hand des Königs Midas',
        caption: 'Die abgebrochene Hand der kolossalen Midas-Statue verwandelt jede Berührung augenblicklich in 24-Karat Gold.',
        url: '/src/assets/images/midas-hand.jpg',
        isPlaceholder: false,
        dateAdded: '1996-11-04',
        tags: ['Palast des Midas', 'Midas-Hand', 'Gold', 'Magie', 'Relikt']
      },
      {
        id: 'media-08-2',
        entryId: 'tr1996-08-palace-midas',
        type: 'image',
        title: 'Bleibarren (Vor der Verwandlung)',
        caption: 'Drei rohe, schwere Metallblöcke, die über die verschiedenen Fallenräume des Palastes verteilt waren.',
        url: '/src/assets/images/bleibarren.jpg',
        isPlaceholder: false,
        dateAdded: '1996-11-04',
        tags: ['Midas', 'Bleibarren', 'Fallen', 'Griechenland']
      },
      {
        id: 'media-08-3',
        entryId: 'tr1996-08-palace-midas',
        type: 'image',
        title: 'Goldenes Medaillon / Vergoldetes Relikt',
        caption: 'Die durch die Berührung der Midas-Hand vergoldeten Barren. Sie passen exakt in die drei Aussparungen am Ausgang.',
        url: '/src/assets/images/goldenes.gredal.jpg',
        isPlaceholder: false,
        dateAdded: '1996-11-04',
        tags: ['Midas', 'Goldbarren', 'Relikt', 'Ausgang']
      },
      {
        id: 'media-08-4',
        entryId: 'tr1996-08-palace-midas',
        type: 'image',
        title: 'Goldene Totenmaske des Palastes',
        caption: 'Geborgen aus einer Geheimkammer im Aquädukt-Garten; Zeugnis des unermesslichen Reichtums und Fluchs des Königs.',
        url: '/src/assets/images/goldene-maske.jpg',
        isPlaceholder: false,
        dateAdded: '1996-11-04',
        tags: ['Palast des Midas', 'Goldene Maske', 'Geheimnis', 'Griechenland']
      }
    ],
    voiceName: 'Kore',
    estimatedReadTime: '4 Min.',
    mood: 'mystisch'
  },
  {
    id: 'tr1996-09-city-of-khamoon',
    entryNumber: 10,
    chapter: 'Kapitel 9/10: Ägypten',
    levelTitle: 'Die Stadt Khamoon (City of Khamoon)',
    date: '10. November 1996',
    location: '🏺 Versunkene Stadt Khamoon, Ägypten',
    coordinates: '25°43\'14"N 32°36\'02"E',
    relic: '🔑 Saphir-Schlüssel & Siegel von Anubis',
    secrets: '3 / 3 Geheimnisse entdeckt',
    summary: 'Unter den glühenden Wüstensanden Ägyptens entdeckte ich die geheimnisvolle Stadt Khamoon. In den monumentalen Granithallen lauern Panther, Mumien und uralte Mechanismen.',
    content: `Die Hitze Ägyptens ist erdrückend, doch unter der Erde herrscht die Kühle uralter Gräber. Nachdem ich Pierre Duponts Spuren bis nach Ägypten verfolgt hatte, stieß ich auf einen verborgenen Schacht, der mich tief unter den Wüstensand in die versunkene Stadt Khamoon führte.

Monumentale Sphinx-Statuen und Kolonnaden aus schwarzem Granit säumen die weiten Tempelhöfe. Doch die Stille trügt: Kaum betrat ich die Säulenhalle, sprangen angriffslustige Wüstenpanther und kriechende Skorpione aus dem Schatten! 

Um die Tore zu den inneren Heiligtümern zu öffnen, musste ich massive Sandsteinblöcke verschieben und hoch über den Abgründen an verzierten Deckenbalken entlanghangeln. In einer geheimen Krypta fand ich schließlich den leuchtend blauen Saphir-Schlüssel und das mystische Siegel von Anubis. Die ägyptischen Priester wussten genau um die Macht von Atlantis – alle Zeichen weisen auf das nahegelegene Heiligtum des Scion hin!`,
    handwrittenNotes: [
      'Panther-Lauer: Sie greifen paarweise an. Sofort Rückwärtssalto auf höhere Steinblöcke.',
      'Saphir-Schloss: Befindet sich auf der Plattform über dem trockenen Wasserbecken.',
      'Skarabäus-Gravuren an den Pfeilern markieren die Position der Hebelmechanismen.'
    ],
    media: [
      {
        id: 'media-09-1',
        entryId: 'tr1996-09-city-of-khamoon',
        type: 'image',
        title: 'Saphir-Schlüssel des Heiligtums',
        caption: 'Der leuchtend blaue Edelsteinschlüssel öffnet das Portal zu den inneren Tempelgärten von Khamoon.',
        url: '/src/assets/images/saphir-schlüssel.jpg',
        isPlaceholder: false,
        dateAdded: '1996-11-10',
        tags: ['Ägypten', 'Khamoon', 'Saphir-Schlüssel', 'Artefakt']
      },
      {
        id: 'media-09-2',
        entryId: 'tr1996-09-city-of-khamoon',
        type: 'image',
        title: 'Das Siegel von Anubis',
        caption: 'Antikes Schutzsiegel des Schakalgottes, geborgen aus der Sarkophaghalle der Priester.',
        url: '/src/assets/images/siegel-von-anubis.jpg',
        isPlaceholder: false,
        dateAdded: '1996-11-10',
        tags: ['Ägypten', 'Anubis', 'Siegel', 'Relikt']
      },
      {
        id: 'media-09-3',
        entryId: 'tr1996-09-city-of-khamoon',
        type: 'image',
        title: 'Der vergoldete Skarabäus',
        caption: 'Heiliges Amulett der Auferstehung, verborgen in der geheimen Kammer unter der Sphinx-Pfote.',
        url: '/src/assets/images/skarabeus.jpg',
        isPlaceholder: false,
        dateAdded: '1996-11-10',
        tags: ['Ägypten', 'Skarabäus', 'Gold', 'Amulett']
      }
    ],
    voiceName: 'Kore',
    estimatedReadTime: '4 Min.',
    mood: 'mystisch'
  },
  {
    id: 'tr1996-10-sanctuary-scion',
    entryNumber: 11,
    chapter: 'Kapitel 10/10: Ägypten',
    levelTitle: 'Das Heiligtum des Scion (Sanctuary of the Scion)',
    date: '12. November 1996',
    location: '🏺 Monumentale Sphinx-Kathedrale, Ägypten',
    coordinates: '25°44\'02"N 32°36\'48"E',
    relic: '🔱 Das Anch-Kreuz, Auge des Horus & Scion-Fragment',
    secrets: '1 / 1 Geheimnis entdeckt',
    summary: 'Im kolossalen Heiligtum der Sphinx stand ich Pierre Dupont im finalen Duell gegenüber. Mit dem Anch-Kreuz und dem Auge des Horus vereinte ich die Scion-Fragmente.',
    content: `Der Anblick verschlägt einem den Atem: Eine gigantische, unterirdische Sphinx ragt in einer unermesslich hohen Kaverne empor, flankiert von zwei gewaltigen Statuen der atlanteanischen Herrscher. Hier schlägt das Herz des uralten Wissens!

Bevor ich den Kopf der Sphinx erklimmen konnte, stellte sich mir Pierre Dupont zum Entscheidungskampf. Er hatte auf mich gewartet, doch seine Arroganz wurde ihm zum Verhängnis. Nach einem erbitterten Feuergefecht brach er zusammen. Bei ihm fand ich das zweite Scion-Fragment sowie seine Aufzeichnungen über Natlas wahren Plan.

Um das Allerheiligste im Inneren der Sphinx zu betreten, musste ich die vier heiligen Insignien bergen: Das goldene Anch-Kreuz des Lebens, das schützende Auge des Horus und die beiden Schlüssel der Götter. Als ich das Anch auf der Stirn der Sphinx einsetzte, öffnete sich der geheime Zugang zwischen ihren Pranken.

Im Sanktum ruhte das dritte Scion-Teil auf einer schwebenden Energiesäule. Als ich die Fragmente zusammenfügte, überkam mich eine Vision: Jacqueline Natla ist keine gewöhnliche Geschäftsfrau – sie ist die verbannte Königin von Atlantis!`,
    handwrittenNotes: [
      'Gefecht mit Pierre Dupont: Abstand halten, ständige Rollen und Ausweichsprünge.',
      'Anch-Kreuz passt exakt in die Aussparung auf der Stirn der Sphinx.',
      'Flugwesen bewachen die obere Plattform – Uzis oder Shotgun im Anschlag halten.',
      'Natla Technologies operiert auf einer einsamen Pazifikinsel. Mein nächstes Ziel!'
    ],
    media: [
      {
        id: 'media-10-1',
        entryId: 'tr1996-10-sanctuary-scion',
        type: 'image',
        title: 'Das heilige Anch-Kreuz',
        caption: 'Schlüssel zur Öffnung der Sphinx-Pforten im Allerheiligsten des Heiligtums.',
        url: '/src/assets/images/anch-kreuz.jpg',
        isPlaceholder: false,
        dateAdded: '1996-11-12',
        tags: ['Ägypten', 'Anch', 'Sphinx', 'Relikt']
      },
      {
        id: 'media-10-2',
        entryId: 'tr1996-10-sanctuary-scion',
        type: 'image',
        title: 'Amulett des Auge des Horus',
        caption: 'Göttliches Schutzamulett, geborgen aus der gefluteten Säulenkammer unter der Sphinx.',
        url: '/src/assets/images/auge-des-horus.jpg',
        isPlaceholder: false,
        dateAdded: '1996-11-12',
        tags: ['Ägypten', 'Horus', 'Amulett', 'Artefakt']
      },
      {
        id: 'media-10-3',
        entryId: 'tr1996-10-sanctuary-scion',
        type: 'image',
        title: 'Goldener Schlüssel der Sphinx',
        caption: 'Der meisterhaft geschmiedete Tempelschlüssel für die versiegelte Kammer der Pharaonen.',
        url: '/src/assets/images/goldener-schlüssel.jpg',
        isPlaceholder: false,
        dateAdded: '1996-11-12',
        tags: ['Ägypten', 'Goldener Schlüssel', 'Tempel']
      },
      {
        id: 'media-10-4',
        entryId: 'tr1996-10-sanctuary-scion',
        type: 'image',
        title: 'Lara Croft im Sanktum der Sphinx',
        caption: 'Bereit zum Aufbruch nach Atlantis, um Natlas dunkle Pläne ein für alle Mal zu vereiteln.',
        url: '/src/assets/images/Lara_Croft_Icon_lara-style-new_1024x1024.png',
        isPlaceholder: false,
        dateAdded: '1996-11-12',
        tags: ['Lara Croft', 'Sphinx', 'Finale', 'Atlantis']
      }
    ],
    voiceName: 'Kore',
    estimatedReadTime: '5 Min.',
    mood: 'triumphierend'
  }
];

