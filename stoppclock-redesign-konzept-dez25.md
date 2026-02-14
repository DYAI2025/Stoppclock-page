1. Kontext & Ziel
Du hast mit stoppclock.com bereits eine schöne Sammlung von Timern, die „Zeit leicht halten“ sollen – als kleines Tool und als Mini-Philosophie.
stoppclock.com

Gesucht ist jetzt eine Idee, wie jeder Timer (Countdown, Stopwatch, Pomodoro, etc.) eine eigene, besondere Seite bekommt: mit Story, spannenden Time-Facts und einem eigenständigen, aber markenkonsistenten Design.

2. Ideenlandschaft
Timer als Charaktere („Time Spirits“)
Jede Timer-Art bekommt eine eigene Persönlichkeit, Origin-Story, visuelle Welt und ein paar „Fun Facts“ aus der Zeitgeschichte.

Timer als Rituale („Time Rituals“)
Pro Timer eine Seite, die zeigt, welche Rituale er unterstützt (z.B. Fokusritual mit Pomodoro, „Deep Work Stopwatch“, „Ruhige Minuten“ beim Analog-Timer), plus psychologische Fakten.

Timer als Zeitmuseum („Time Museum Pages“)
Jede Seite ist wie eine kleine Ausstellung: Herkunft des Timers, historische Meilensteine, Zitate, interaktive Timeline.

Timer als User-Stories („Moments that Matter“)
Pro Timer echte oder fiktive Mini-Stories, wie Menschen ihn nutzen – eher emotionales Storytelling, weniger Fakten.

Ausgewählt & kombiniert:
Ich nehme 1 (Charaktere) als Hauptidee und mische Elemente aus 2 (Rituale) und 3 (Time Museum), damit jede Seite gleichzeitig emotional, nützlich und informativ ist. Diese strukturierte Kombination folgt dem mehrstufigen Kreativprozess aus deinem Creative-Idea-Orchestrator.

3. Ausgewählte Top-Idee
Idee „Timer-Welten“ – jede Uhr bekommt ein eigenes Universum
Jeder Timer auf stoppclock.com bekommt eine eigene Unterseite im Stil einer „Character Card“:
/timers/stopwatch, /timers/countdown, /timers/pomodoro …
Dort treffen sich: Story (Personifizierung), Praxis (Wann nutze ich ihn?), Time-Facts (Geschichte & Wissenschaft) und ein passendes Micro-Design.

Technologischer Layer
Struktur & Routing

Für jeden Timer ein eigener Route/Slug: z.B. /timer/stopwatch, /timer/analog, /timer/pomodoro – verlinkt aus der Startseite und direkt aus dem jeweiligen Timer-UI („i“-Icon oder „About this timer“).

Inhalt technisch als konfigurierbare JSON/YAML-Module oder über ein kleines CMS (z.B. Notion, Headless CMS), damit du pro Timer die gleichen Bausteine pflegen kannst (Story, Fakten, Zitate, Bilder).

Designsystem & Theme-Engine

Ein zentrales Designsystem (Farben, Typografie, Spacing), dazu pro Timer Theme-Variablen:

Stopwatch → sportlicher, klarer Look, etwas „digitaler“.

Countdown → leicht dramatisch, bold Typo.

Pomodoro → warm, fokussiert (vielleicht leicht rötliche Akzente).

Analog → ruhiger, „analoge“ Serifenschriften, dezente Texturen.

Technisch: CSS-Variablen/Tailwind-Themes pro Route.

Komponenten

Wiederverwendbare React/Svelte/Vue-Komponenten:

<TimerHero /> (Titel, Subclaim, Illu)

<TimerStory /> (Geschichtenabschnitt)

<TimerFacts /> (Fun-Facts-Kacheln)

<TimerUseCases /> (Konkrete Anwendungsfälle)

<TimerCTA /> (Button „Diesen Timer starten“ oder „Fullscreen öffnen“)

Performance & Offline

Seiten statisch vorgerendert (z.B. Next.js SSG), damit sie super schnell laden.

Bilder/Illustrationen als optimierte SVGs oder leichte WebP-Grafiken.

Optional: leichte Scroll-Animationen (CSS/IntersectionObserver), ohne schwere Libraries.

Inhaltlicher Layer
Jede Timer-Seite folgt demselben Inhaltsgerüst, aber mit eigener Farbe, eigener Story und eigenen Fakten:

Hero-Section – „Wer bin ich?“

Titel:

Stopwatch: „Der Jäger der Sekunden“

Countdown: „Der Hüter der Deadlines“

Pomodoro: „Dein Beschützer der Fokusinseln“

1–2 Sätze, die den Timer emotional rahmen:

„Ich bin der Momentzähler. Ich springe an, wenn du startest, und halte fest, was für dich zählt – vom 100-Meter-Sprint bis zum Espresso-Experiment.“

Story-Block – Mini-Origin-Story (ca. 150–250 Wörter)

Beispiel Stopwatch:

Wie sie aus Sport, Industrie und Laboren kommt.

Was sie im stoppclock-Universum „fühlt“ (leicht personifiziert: „Ich liebe klare Starts und starke Ziele.“).

Optional: ein kleiner Dialog:

„‚Bin ich schnell genug?‘, fragt der Läufer.
‚Lass es uns herausfinden‘, sagt die Stoppuhr und wartet auf den Start.“

Use Cases – „Wo ich dir helfe“

3–5 konkrete Szenarien als Cards:

„Sprinten & Training“

„Deep Work in Sprints“

„Meetings kurz halten“

„Experimente & Tests“

Jeder mit 1–2 Sätzen: Problem + wie der Timer unterstützt.

Time Facts – „Das wusstest du noch nicht …“

3–7 kurze, nerdige Fakten:

Geschichte (z.B. erste Stoppuhren im 19. Jh., Olympische Spiele).

Wissenschaft (Zeitwahrnehmung, Aufmerksamkeitsspannen).

Kultur (ikonische Momente, die mit Stoppuhren gemessen wurden).

Als visuelle Kacheln, damit man sie beim Scrollen „entdeckt“ – passend zur Teaser-Zeile „Things that you didn’t know about the time“.
stoppclock.com

Micro-Guide – „So nutzt du mich am besten“

Konkrete Tipps (2–4 Bulletpoints):

„Nutze mich im Vollbild auf dem Beamer, wenn du Workshops moderierst.“

„Lege dir feste ‚Sprint-Blöcke‘ an und notiere die Ergebnisse.“

Optional: ein kleiner „Ritual-Block“:

z.B. „Das 25-Minuten-Fokusritual“ beim Pomodoro mit kurzer Schritt-für-Schritt-Anleitung.

Call to Action

Am Ende immer: „Jetzt [Timername] starten“ → Direkt in den Fullscreen-Timer.

Optional: „Timer als Standard merken“ / „Zu Favoriten hinzufügen“.

Beispiel-Microcopy für den Countdown-Hero:

Der Hüter deiner Deadlines
Wenn etwas wichtig ist, braucht es einen Rahmen. Ich zähle von jetzt bis zu deinem Moment herunter – und erinnere dich daran, dass jede Sekunde, die vergeht, dich näher dorthin bringt.

Narrativer Layer
Leitmetapher

Jeder Timer ist ein Charakter in einer kleinen „Time Crew“:

Stopwatch = Athlet / Forscher

Countdown = Regisseur / Raketenleiter

Pomodoro = Mentor / Fokus-Coach

Analog = Zen-Mönch der Zeit

Cooking Timer = Küchenchef

Chess Clock = Strategin

Kurz illustriert und in 3–4 Sätzen beschrieben: „Was macht mich aus?“

Wiederkehrende Narrative Elemente

Wiederkehrende Fragen:

„Was zählt für dich in dieser Zeit?“

„Woran willst du dich erinnern, wenn die Zeit abgelaufen ist?“

Kleine „Philosophie“-Absätze, die zur Marke passen („Time, held lightly“):

Zeit nicht nur als Druck, sondern als Bewusstseins-Rahmen.

Cross-Story

Auf jeder Seite gibt es einen kleinen Abschnitt „Meine Freunde“:

z.B. auf der Countdown-Seite: „Wenn du nach dem Endpunkt weiter messen willst, lern meinen Freund, die Stoppuhr, kennen.“

Dadurch wird das ganze Timer-Set als verbundene Welt erfahrbar.

Modus-spezifische Artefakte (Web-/Marketing-/Story-Modus)
a) Seitentemplate (Wireframe in Worten)

Hero (Viewport hoch)

Titel, Claim, kurze Beschreibung, Illustration.

Story über den Timer

2–3 Absätze, ggf. kleiner Dialog oder Szene.

Use Cases / Rituale

3–5 Cards im Grid.

Time Facts

Gallery/Grid mit „Flip Cards“ oder Fact-Kacheln.

Philosophie & Cross-Links

Kurzer Abschnitt „Wie dieser Timer in dein Leben passt“ + Links zu anderen Timer-Seiten.

Footer-CTA

Button „Timer öffnen“ + ggf. „Zu Favoriten hinzufügen“.

b) Beispiel-Sektion „Time Facts“ für Pomodoro

„Die Pomodoro-Technik wurde Ende der 1980er Jahre von Francesco Cirillo mit einer Küchenuhr in Tomatenform entwickelt.“

„25 Minuten Fokus + 5 Minuten Pause entsprechen ziemlich genau unserer typischen Aufmerksamkeitsspanne, bevor die Fehlerquote steigt.“

„Viele Entwickler:innen nutzen Pomodoro, um lange Projekte in kleine, schaffbare Episoden zu zerlegen.“

Risiken & Abhängigkeiten
Content-Lastigkeit
– Du brauchst für jeden Timer etwas Text (Story + Fakten). Lösung: erst „MVP-Texte“ (Hero + 3 Facts), später ausbauen.

Ton & Marke
– Die Personifizierung darf nicht kitschig wirken. Lösung: klare Style-Guidelines (leicht, minimalistisch, nie zu „quirky“).

Pflegeaufwand
– Wenn du später weitere Timer hinzufügst, müssen neue Seiten erstellt werden. Lösung: Template + Config-System, damit das in Minuten geht.

Fakten-Qualität
– Time-Facts sollten akkurat sein (History/Science). Für Launch kannst du wenige gut recherchierte Facts pro Timer nutzen und sie nach und nach erweitern.

4. Reasoning & Selection
Ich habe mehrere Richtungen exploriert (Charaktere, Rituale, Museum, User-Stories).

Charaktere + Rituale + Facts wurden gewählt, weil:

sie klar differenzieren (jede Seite fühlt sich einzigartig an),

gleichzeitig in einem wiederholbaren Template umsetzbar sind,

perfekt zur vorhandenen Ausrichtung von stoppclock („kleine Philosophie & Grund zum Lächeln“) passen.

Die anderen Ideen bleiben als Ergänzung:

„Time Museum“ kannst du später als tieferes Modul integrieren (Timeline, weitere Facts),

„User-Stories“ lassen sich als Blog/Stories-Sektion neben den Timer-Welten ausspielen.

Ich habe die Idee entlang eines strukturierten Kreativ-Workflows mit Briefing, Ideenästen, Auswahl und Ausarbeitung entwickelt und am Ende kritisch auf Konsistenz geprüft.

5. Validation & Next Steps
Konkrete nächsten Schritte:

MVP für 1–2 Timer bauen

Z.B. Countdown und Pomodoro:

je eine Seite nach dem oben skizzierten Template,

sehr einfache Illustration (zur Not nur Icons + Typo),

3–4 Facts, 3 Use Cases, 1 Origin-Story.

Design-Richtlinien definieren

Kleine Brand-Notiz:

„Minimalistisch, leicht, humorvoll. Keine Angst vor Weißraum. Zeit wirkt nie aggressiv, sondern klar.“

Nutzer-Feedback einsammeln

Kleiner Banner: „Neu: Die Geschichte hinter diesem Timer – Feedback?“

Messen: Klickrate auf „About“-Link, Scrolltiefe, Verweildauer.

Skalierung auf alle Timer

Wenn das Konzept funktioniert:

Template als JSON-/CMS-Struktur definieren,

pro Timer Inhalte nachziehen,

ggf. mit wenig Aufwand KI-gestützte Textentwürfe generieren und manuell kuratieren.

Wenn du magst, kann ich dir im nächsten Schritt eine konkrete Beispielseite (kompletter Text + Layoutbeschreibung) für einen spezifischen Timer (z.B. Pomodoro oder Countdown) komplett ausformulieren.







Quellen
Du:
Kannst du das mit den folgenden Design-Ideen verknüpfen und ein großes Konzept davon machen? Ich finde das sehr gut mit dem Charaktere Ritual Effects. Welches Design-Konzept von dem hier passt am besten?

Design-Konzepte für „Timer-Seiten“ auf stoppclock.com
Überblick


Briefing-Zusammenfassung
Stoppclock ist eine Sammlung projektorfreundlicher Timer & Uhren – von Countdown, Stopwatch und Analog Clock über Pomodoro und Cooking Timer bis hin zu World Clock, Alarm, Metronome und Chess Clock. Die App ist minimal, offline-fähig und soll „Werkzeug, täglicher Helfer, Denkanstoß, kleine Philosophie und manchmal ein Grund zum Lächeln“ sein. Stoppclock
Ziel: Jeder Timer bekommt eine eigene Seite mit Text, Geschichte, spannenden Fakten und einem klaren, schönen Design – ohne die Minimalität des Tools zu zerstören.


Konzept-Vorschau
Ich schlage drei Richtungen vor:


Konzept 1 – „Calm Stories“: Sehr ruhige, typografische Microsites für jeden Timer. Fokus auf Lesbarkeit, Geschichte, Anwendungsfälle + 2–3 Fun Facts.


Konzept 2 – „Time Lab“: Interaktive Timer-Seiten mit kleinen Experimenten, Visualisierungen und spielerischen Microinteractions.


Konzept 3 – „Time Museum“: Jede Timer-Seite als kuratierte Ausstellung über Zeit, Kultur und Verwendung – mit starken, aber weiterhin klaren Visuals.




Diese drei Richtungen unterscheiden sich im Mut-Level (ruhig vs. verspielt), im Interaktionsgrad und im Story-Fokus, basieren aber alle auf den gleichen Gestaltungsprinzipien und UI-Patterns.  

Konzept 1 – „Calm Stories“
(Timer-Microsites wie kleine Essays)
High-Level-Idee
Jeder Timer bekommt eine extrem ruhige, textgetriebene Seite – wie ein kleines „Time Essay“.
Die Seite erklärt:


Was der Timer macht (funktional).


Warum es ihn gibt (Geschichte / Philosophie).


Wann er besonders nützlich ist (Use Cases).


2–4 „Time Facts“ (historisch, kulturell, wissenschaftlich).


Stimmung: klar, gelassen, ohne Ablenkung – perfekt passend zur bestehenden, minimalen Stoppclock-UI.
Informationsarchitektur & Layout


Views


/timers: Übersicht aller Timer als einfache Liste oder Card-Grid.


/timers/stopwatch, /timers/countdown, /timers/pomodoro, … je eigene Detailseite.




Navigation


Global: ein neuer Eintrag in der Hauptnavigation, z. B. „About the Timers“ → /timers. (Den vorhandenen Link „About the Timers“ könntest du zur neuen Übersicht ausbauen.) Stoppclock


Auf Timer-Detailseiten: Breadcrumb („Timers > Pomodoro“) + „Nächster Timer“ / „Vorheriger Timer“ Links.




Layout-Strategie


Einspaltiges Layout mit klarer Hierarchie:


Hero: Timer-Name, kurze Tagline („Pomodoro – Fokus in 25-Minuten-Wellen“).


„Was dieser Timer macht“ – funktionale Beschreibung.


„Wann du ihn nutzen solltest“ – Use Cases in Stichpunkten.


„Geschichte & Herkunft“ – 1–2 kurze Absätze.


„Zeit-Fakten“ – 3–4 Fun Facts als Liste.






Responsive Verhalten


Mobile: Single Column, großzügiges Line-Height, Abstand zwischen Sektionen.


Desktop: maximal ~70–80 Zeichen Zeilenlänge, viel Whitespace links/rechts. 




Visuelle Sprache & UI-Elemente


Farbwelt


Monochromatische Basis (helles Grau / Off-White) mit einem Timer-spezifischen Akzent (z. B. Pomodoro = warmes Rot, Cooking = Gelb/Orange, World Clock = Blau). 




Typografie


Headlines: geometrische Sans-Serif (z. B. Inter/Roboto) in größeren Stufen für klare Hierarchie.


Fließtext: gleiche Sans, aber leichter und kleiner für ruhiges Lesen.




Komponenten


Flache Cards (z. B. für Fun Facts).


Dezente Divider zwischen Sektionen.


Kleine Icon-Illustration des Timers im Hero (einheitlicher ikonischer Stil).




Interaktionen


Sehr reduzierte Microinteractions: leichte Hover-States, sanfte Fade-ins beim Scrollen.


Fokuszustände klar sichtbar (Kontrast für A11y).




Inhaltlich & narrativ


Tonalität


Sachlich, aber warm; leicht philosophisch („Zeit ist…“), mit kleinen humorvollen Einwürfen.




Kernbotschaften (Beispiele)


Stopwatch: „Zeit messen, ohne Drama.“


Countdown: „Ein klares Ende gibt dir Fokus.“


Pomodoro: „Kurze Sprints, lange Wirkung.“




Content-Struktur


Ein klarer „Story-Faden“: von „Was ist es?“ → „Warum existiert es?“ → „Wie nutzt du es sinnvoll?“ → „Was sagt die Zeitforschung dazu?“




Technisch / Frontend-Architektur


Empfohlener Stack


Astro oder Next.js für inhaltsstarke, SEO-freundliche Static/SSG-Seiten.


Content als MDX: Timer-Texte in Markdown + leichte Komponenten (Fun-Fact-Blocks, Callouts). 




Architektur


Timer-Daten als strukturierte JSON/YAML-Konfiguration (Name, Slug, Sections, Fun Facts).


Je Timer eine Seite, generiert über getStaticPaths (Next) oder Content-Collections (Astro).




Performance & A11y


Minimaler JS-Footprint (fast nur statisches HTML + CSS).


Hoher Kontrast, klare Fokus-Indikatoren, Screenreader-freundliche Landmark-Roles. 




Erweiterbarkeit & Zukunftssicherheit


Skalierbarkeit


Neue Timer = neuer Eintrag in der Content-Datei → neue Seite ohne Code-Änderung.




Risiken


Content-Pflege wird wichtig (aber gut beherrschbar mit Markdown/MDX oder kleinem CMS wie Netlify CMS / Contentful).





Konzept 2 – „Time Lab“
(Timer-Seiten als kleine Experimente)
High-Level-Idee
Hier wird jede Timer-Seite zu einem kleinen „Labor für Zeit“: weniger Essay, mehr Interaktion.
Die Seite beantwortet nicht nur „Was macht dieser Timer?“, sondern lässt Nutzer:innen Zeit fühlen:


Mini-Simulationen („So fühlt sich ein 25-Minuten-Pomodoro an“).


Interaktive Visualisierungen (z. B. Balken, wie viele Pomodoros ein 8-Stunden-Tag sind).


Kleine „Rechenspiele“ (z. B. Cooking Timer: „Wenn du 10 Eier kochst, verbringst du in einem Jahr X Stunden mit Warten.“).


Stimmung: verspielt, aber weiterhin reduziert und projektorfreundlich.
Informationsarchitektur & Layout


Views


/timers als Kachel-Übersicht: jeder Timer mit kurzer Beschreibung + „Explore“ Button.


Timer-Detailseiten mit klaren Sektionen:


Hero: Titel, Untertitel, kurzer Pitch, Start-Button zum echten Timer.


„So funktioniert dieser Timer“ – Kurzbeschreibung + animated diagram.


„Time Experiments“ – interaktive Module.


„Fun Facts“ – kleine Kacheln mit Zahlen & Visualisierung.






Navigation


Sekundäre Navigation (Tabs oder Sticky-Subnav) innerhalb der Timer-Seite: „Überblick | Experimente | Fakten“.




Layout-Strategie


Card Grid & diagrammähnliche Layouts, inspiriert von Dashboard-UI, aber deutlich luftiger. 




Responsive Verhalten


Mobile: Experimente als vertikale Module; kein horizontales Scrollen.


Desktop: 2-Spalten-Layout: Text links, interaktive Visualisierung rechts.




Visuelle Sprache & UI-Elemente


Farbwelt


Helle Basis, Akzentfarben pro Experiment (z. B. ein dezenter Verlauf für aktive Interaktionsmodule).




Typografie


Gleiche geometrische Sans wie Konzept 1 für Konsistenz.


Ziffern und KPIs etwas größer und schwerer, damit Zahlen „knallen“.




Komponenten


KPI Cards („25 Minuten“, „4 Sprints“, „5 Minuten Pause“).


Slider (z. B. „Wie lange willst du fokussiert arbeiten?“ → zeigt, wie viele Pomodoros das sind).


Kleine Charts (Balken/Kreise) für Zeitverteilung. 




Interaktionen


Sanfte Animationen bei Slider-Bewegungen.


Hover-Effekte auf Fun-Fact-Kacheln („flip“ zu einer zweiten Info).


Microcopy, die gelegentlich schmunzeln lässt („Ja, auch 5-Minuten-Timer fühlen sich manchmal ewig an.“).




Inhaltlich & narrativ


Tonalität


Spielerisch, neugierig, leicht nerdig – aber nicht übertrieben.




Kernbotschaften (Beispiele)


Pomodoro: „Experimentiere mit deiner Fokus-Spanne.“


World Clock: „Zeit ist relativ – schau, wer gerade schläft oder arbeitet.“


Metronome: „Finde deinen Rhythmus – im Takt und im Alltag.“




Content-Struktur


Kurze Intro-Story, danach Fokus auf „Hands-on“-Experimente, die mit einfachen Interaktionen eine kleine Erkenntnis erzeugen.




Technisch / Frontend-Architektur


Empfohlener Stack


Next.js (oder SvelteKit) als App-Framework.


UI mit Tailwind CSS für konsistente Spacing/Typo/Colors. 




Architektur


Timer-Definitionen als JSON mit Konfiguration für Experimente (Ranges, Texte, Formeln).


Interaktive Elemente als wiederverwendbare Komponenten („TimeSlider“, „FactCard“, „ChartBlock“).


State-Management: lokal per Hooks/Stores (keine komplexe globale State-Architektur nötig).




Performance & A11y


Charts als SVG mit zugänglichen Beschreibungen.


Interaktive Elemente (Slider, Buttons) mit ARIA-Labels und Tastatursteuerung.




Erweiterbarkeit & Zukunftssicherheit


Skalierbarkeit


Neue Experimente = neue Konfiguration + ggf. kleines Component-Update.




Risiken


Höherer UX- und Implementierungsaufwand (Interaktionen müssen sich gut anfühlen).


Etwas mehr JS, deshalb bewusster Performance-Check auf Low-End-Geräten.





Konzept 3 – „Time Museum“
(Timer als kuratierte Ausstellungsstücke)
High-Level-Idee
Die Idee: Stoppclock wird zu einem kleinen „Museum der Zeitwerkzeuge“.
Jede Timer-Seite ist wie ein Ausstellungsraum:


Ein „Exponat“ (der Timer selbst, als große Visualisierung).


„Kuratorentext“ (philosophischer Kontext).


„Historische Vitrine“ (wie wurde diese Art von Timer früher genutzt?).


„Heute im Einsatz“ (Workshops, Unterricht, Meditation, Kochen, …).


Damit schlägst du eine Brücke zur Formulierung „kleine Philosophie“ aus deiner eigentlichen Positionierung. Stoppclock
Informationsarchitektur & Layout


Views


/timers als „Museumskarte“: Karten mit kleinen Illustrationen (z. B. stilisierte Analoguhr, Teekessel, Weltkarte).


Timer-Detailseiten:


Hero mit großem Exponat (Illustration / Mockup).


„Warum dieses Exponat hier hängt“ – kuratorische Einordnung.


„Zeitreise“ – Timeline mit 3–5 Meilensteinen.


„Heute“ – konkrete Szenarien, wie du den Timer im Alltag oder in Gruppen nutzt.


Optional: „Weiterlesen“ – Links zu Space-for-Time-Texten / Blog. Stoppclock






Navigation


In-Page-Timeline als horizontale Scrollbar (Desktop) / vertikale Liste (Mobile).


„Zurück zur Karte“ Button wie im Museum.




Layout-Strategie


Split-Screen im Hero (links Text, rechts Exponat).


Danach modularer Aufbau mit Cards und Timeline-Komponenten.




Responsive Verhalten


Mobile: Sektionen untereinander; Timeline als simple Liste mit Jahreszahl + Text.


Desktop: etwas „editorial“ mit größeren typografischen Akzenten.




Visuelle Sprache & UI-Elemente


Farbwelt


Helle, neutrale Basis plus leicht „museumshafte“ Akzente: z. B. gedämpfte Farben, die an Plakate/Exponate erinnern.




Typografie


Kombination aus:


Geometrischer Sans für UI-Labels.


Leicht editorialer Serif oder Display-Font nur für Headlines („Exponat-Titel“), um kuratorisches Gefühl zu erzeugen. 






Komponenten


„Exponat-Card“ mit großem Icon oder Illustration.


Timeline-Elemente mit Jahr, Ereignis, kurzer Erklärung.


„Plaque“-Style Textboxen (wie Museumsbeschriftungen).




Interaktionen


Leichtes Parallax/Scroll-Play im Hero (Exponat bewegt sich minimal).


Timeline-Highlight, wenn man scrollt („Jetzt bist du im Jahr 1980“).




Inhaltlich & narrativ


Tonalität


Nachdenklich, inspirierend, manchmal poetisch – passend zu „Space for Time“.




Kernbotschaften (Beispiele)


Analog Clock: „Seit Jahrhunderten übersetzen wir die Bewegung der Erde in Zahlen auf einem Zifferblatt.“


Chess Clock: „Zeit als Ressource im Wettbewerb – was du opferst, ist nicht nur Material, sondern Sekunden.“




Content-Struktur


Pro Timer ein kleiner „Narrativbogen“: Herkunft → Wandel → heutige Interpretation durch Stoppclock.




Technisch / Frontend-Architektur


Empfohlener Stack


SvelteKit oder Next.js – gut geeignet für leichte Animations- und Storytelling-Seiten. 


Styling via Tailwind CSS + individuelle Komponenten für Exponate & Timeline.




Architektur


Timer-Metadaten mit:


era-Infos (Historische Daten).


storySections (Abschnitte mit Titel, Text, optionalem Media).




Animationslogik in eigenen UI-Komponenten, damit wartbar und abschaltbar (z. B. Motion-Preference-Check).




Performance & A11y


Animationsreduktion für prefers-reduced-motion.


Fokus-Reihenfolge logisch (Timeline + Haupttext).




Erweiterbarkeit & Zukunftssicherheit


Skalierbarkeit


Jeder neue Timer wird ein neues „Exponat“ – strukturell identisch, aber inhaltlich anders.




Risiken


Anspruchsvolle Content-Produktion (Texte wollen „kuratierte Qualität“ haben).


Illustrationen/Icons brauchen konsistenten Stil (evtl. Design-Aufwand).





Vergleich & Empfehlung
Vergleichstabelle
FeatureKonzept 1 – Calm StoriesKonzept 2 – Time LabKonzept 3 – Time MuseumStilMinimal, textzentriertSpielerisch, interaktivEditorial/kurativer LookInteraktivitätGeringMittel–hoch (Slider, kleine Tools)Mittel (Timeline, leichte Animationen)Aufwand UmsetzungNiedrig–mittelMittel–hochMittel–hoch (Content & Visuals)Aufwand ContentKurztexte, Fun FactsTexte + Experimente erklärenStorytelling, Historie, evtl. mehr RechercheFlexibilitätSehr hochHoch, aber technisch anspruchsvollerHoch, aber inhaltlich stärker kuratiertRisikoGering (sehr nah am Status quo)Moderat (muss „fun“ aber nicht chaotisch sein)Moderat (erwartet konsistente Narrative)Impact auf MarkeVerstärkt Klarheit & RuhePositioniert Stoppclock als „Time Playground“Positioniert Stoppclock als „Time Culture Brand“Ideal für…Fokus auf Lesbarkeit & SEOWenn du Nutzer:innen aktiv „spielen“ lassen willstWenn du die philosophische Seite betonen willst
Empfehlung


Wenn du schnell starten willst und vor allem „jedem Timer etwas Besonderes“ in Form von klaren Stories & Fakten geben möchtest, ist Konzept 1 – Calm Stories der beste Startpunkt.


Wenn du Stoppclock stärker als spielerisches Werkzeug gegen Zeitblindheit positionieren willst, würde ich Konzept 2 – Time Lab wählen oder später aus Konzept 1 heraus dorthin weiterentwickeln.


Wenn deine Marke langfristig Richtung „Zeitkultur“ und „Philosophie der Zeit“ gehen soll, ist Konzept 3 – Time Museum sehr spannend – vielleicht zuerst für ausgewählte Timer (Analog, World Clock, Chess Clock) als Pilot.


Du kannst auch kombinieren:


Basis: Konzept 1 (strukturiertes Content-Fundament).


Für prominente Timer (Pomodoro, Countdown, World Clock): ausgewählte „Experiments“ aus Konzept 2.


Für 1–2 „Flaggschiff-Timer“: ein „Museumsspecial“ im Stil von Konzept 3.



Nächste Schritte (Deep Dive)


Timer-Priorisierung


Liste aller Timer (Stopwatch, Countdown, Analog, Pomodoro, Cooking, World Clock, Alarm, Metronome, Chess Clock).


Entscheiden: welche bekommen zuerst eine Seite (z. B. Top 3 meistgenutzte).




Content-Schema festlegen (für alle Konzepte gleich):


Felder wie: intro, function, useCases, history, funFacts[], optional experimentConfig.


Dies direkt so definieren, dass es später headless-CMS-fähig ist. 




1 Timer als Prototyp


Z. B. Pomodoro wählen und eine vollständige Page in Konzept 1 oder 2 ausarbeiten (Wireframes + Text).


Testen mit echten Nutzer:innen oder Workshop-Leiter:innen, wie sie diese Seite nutzen (Lesen? Teilen? Vorstellen?).




Design System Light


Ein kleines Style-Token-Set (Farben, Typo-Scale, Spacing) definieren, das für alle Timer-Seiten gilt.  




Tech-Stack-Entscheidung


Zwischen Astro/Next.js/SvelteKit entscheiden und die Timer-Seiten entweder als neuen Content-Bereich zu deiner bestehenden App hinzufügen oder die Seiten sogar als Content-Layer vorschalten. 




Wenn du möchtest, kann ich im nächsten Schritt für einen konkreten Timer (z. B. Pomodoro oder Countdown) eine vollständig ausgearbeitete Beispielseite in einem der Konzepte durchdeklinieren – inklusive konkreter Abschnitts-Texte, Beispiel-Fun-Facts und genauer Seitenstruktur.


DYAI_IdeaGPT sagte:

Nachgedacht für 13s
Kurz gesagt:
Bestes Grund-Design für „Charakter · Ritual · Effect“ ist Konzept 1 – „Calm Stories“
…und du erweiterst es gezielt mit ein paar Elementen aus „Time Lab“ (Konzept 2) und einem Hauch „Time Museum“ (Konzept 3) für die „Time Facts“. Daraus wird EIN großes, konsistentes Konzept.

Ich baue dir das mal als Gesamtbild auf.

1. Wie „Character · Ritual · Effect“ zu den 3 Design-Konzepten passt
Stell dir jede Timer-Seite als drei inhaltliche Layer vor:

Character (Wer?)
– Der Timer als Figur/Archetyp mit Persönlichkeit & kurzer Origin-Story.
→ passt perfekt zu Konzept 1 – Calm Stories (ruhige, textliche Microsite).

Ritual (Wie & Wann?)
– Konkrete Einsatz-Situationen, kleine Routinen, „Time Rituals“ im Alltag.
→ ebenfalls gut in Konzept 1, als Use-Case-/Ritual-Sektion.

Effect (Was verändert sich dadurch?)
– Welche Wirkung hat der Timer auf Fokus, Stimmung, Gruppe, Zeitgefühl?
– Optional mit Mini-Experiments / Visualisierungen („Time Lab“).
→ hier kommen Elemente aus Konzept 2 – Time Lab ins Spiel.

Und die „Time Facts“ (History, Kultur, Wissenschaft) sind quasi der leichte „Time Museum“-Anteil:
– kuratierte kleine Ausstellungsstücke in Textform, nicht gleich eine volle Museumsshow.

Fazit zur Frage „Welches Design-Konzept passt am besten?“

Basis & Layout & Mood → Konzept 1 – Calm Stories

Effect-Sektion (optional interaktiv) → ein kleiner Layer aus Konzept 2 – Time Lab

Time Facts → leichtes „Time Museum“-Feeling aus Konzept 3

2. Das große Konzept: „Calm Characters & Ritual Effects“
Arbeitstitel: „Calm Characters & Ritual Effects“
Jede Timer-Seite folgt einem festen, super einfachen Schema:

Character → Rituals → Effects → Time Facts → Start Timer

2.1 Informationsarchitektur
Neue Struktur

/timers
Übersicht aller Timer als ruhiges Grid: Name, Mini-Charakter, Kurzclaim.

/timers/<slug>
z. B. /timers/pomodoro, /timers/countdown, /timers/analog etc.

Navigation

Hauptnavigation: „About the Timers“ → /timers

Auf Timer-Seite:

Breadcrumb: Timers > Pomodoro

Am Seitenanfang eine kleine Sub-Navigation (nur Textlinks):
Character · Rituals · Effects · Time Facts

2.2 Seitenaufbau (Template für alle Timer)
1. Hero – Character

Design: Konzept 1 – Calm Stories

Inhalt:

Name & Archetyp
„Pomodoro – dein Fokus-Mentor“
„Countdown – der Hüter deiner Deadlines“
„Analog – der ruhige Zeitgefährte“

1–2 Sätze Charakterbeschreibung:

„Ich zähle deine Fokus-Sprints. 25 Minuten lang halte ich die Welt klein, damit du bei einer Sache bleiben kannst.“

Kleine, einfache Illustration / Icon des Timers.

2. Character Story

Kurzer, ruhiger Essay-Block (200–300 Wörter):

Wo kommt diese Timer-Art her? (Historisch/Alltag)

Wie sieht sie sich selbst in deinem Alltag?

Ton: sachlich + warm + kleine philosophische Note.

Design: wieder Calm Stories – Einspaltig, viel Whitespace.

3. Rituals – „Wie du mich nutzt“

Hier wird Ritualisierung konkret:

Abschnitts-Titel:
„Rituale mit diesem Timer“ oder „Wofür ich gut bin“

3–5 Use-Case-Cards, jeweils:

Titel (z. B. „Deep-Work-Sprints“, „Kurz-Check-In im Meeting“, „Experiment-Zyklus“)

1–2 Sätze „so machst du es“:

„Stell mich auf 25 Minuten, leg dein Handy weg, wähle eine Sache. Wenn ich klingele: kurz notieren, was du geschafft hast – dann 5 Minuten Pause.“

Design:

Ruhige Cards (Konzept 1), grid- oder listenartig.

Hier kannst du später bei Bedarf vereinzelt kleine Time-Lab-Mini-Interaktionen ergänzen (z. B. ein Slider: „Wie viele Pomodoros hat dein Tag?“).

4. Effects – „Was das mit dir macht“

Hier kommt das „Lab-Gefühl“ dazu, aber klein & gezielt.

Inhaltlich:

Überschrift:
„Was dieser Timer mit deiner Zeit macht“ oder „Effekte im Alltag“

2 Ebenen von Effekten:

Praktische Effekte
– „Weniger Überziehen von Meetings“
– „Klarer Anfang & klares Ende“
– „Kurze, planbare Fokusinseln“

Subjektive/psychologische Effekte
– „Stress sinkt, weil das Ende klar ist“
– „Zeit vergeht weniger diffus“

Optional 1–2 kleine Time-Lab-Module:

Pomodoro: Slider „Fokusstunden am Tag“ → zeigt als Balken, wie viele Pomodoros das sind.

Countdown: kleiner Rechner „Wenn du deine Meetings 10 Minuten kürzer machst, sparst du pro Woche …“

Cooking Timer: „So viele Minuten wartest du im Jahr auf Wasser, das kocht.“

Design:

Basis weiter Calm Stories, mit einzelnen interaktiven Komponenten aus Konzept 2 – Time Lab:

einfache Slider

einfache Balken oder Kreise

minimale Animationen (kein buntes Dashboard)

Damit bleiben die Seiten ruhig, aber du hast pro Timer 1–2 „Aha-Momente“, die die Effects fühlbar machen.

5. Time Facts – „Kleine Ausstellung“

Hier lebt deine „Time Museum“-Idee – aber auf 1–2 Screens komprimiert.

Titel:
„Time Facts“ oder „Kleine Ausstellung zu diesem Timer“

3–5 kuratierte Fakten:

1 historisch (z. B. wann Stoppuhren/Alarm-Uhren/Metronome aufkamen)

1 kulturell (Olympia, Bahnverkehr, Musikpraxis, Schachturniere …)

1 psychologisch (Zeitwahrnehmung, Aufmerksamkeit, Takt)

Im Layout wie kleine Museumsschilder:

Jahr / Ort / Stichwort

1–2 Sätze Erklärung

Design:

Visuell angelehnt an Konzept 3 – Time Museum:

leichte Rahmen/„Plaques“

vielleicht eine andere, etwas „editorial“ wirkende Headline-Schrift (aber subtil, um Minimalität nicht zu brechen)

6. CTA – „Start the timer“

Ganz unten (und gern auch oben im Hero):

Primärer Button: „Timer starten“ / „Open Stopwatch“

Zweiter Link: „Zurück zur Timer-Übersicht“

3. Wie du es technisch & inhaltlich sauber aufziehst
3.1 Content-Schema (für alle Timer gleich)
Du kannst im Code/CMS pro Timer sowas haben wie:

yaml
Code kopieren
slug: "pomodoro"
name: "Pomodoro"
character:
  archetype: "Fokus-Mentor"
  tagline: "Fokus in 25-Minuten-Wellen"
  heroText: "Ich halte dir 25 Minuten lang den Rahmen, damit du bei einer Sache bleiben kannst."
  story: "..."
rituals:
  - title: "Deep-Work-Sprint"
    text: "..."
  - title: "Lernsession"
    text: "..."
effects:
  practical:
    - "Du arbeitest in klar abgegrenzten Blöcken."
    - "Pausen sind fest eingeplant."
  psychological:
    - "Du erlebst Fortschritt in kleinen Episoden."
timeLab:
  hasModule: true
  type: "pomodoroCalculator"
timeFacts:
  - label: "1980er"
    text: "Francesco Cirillo nutzt eine Tomatenküchenuhr für seine ersten Experimente."
  - label: "25 Minuten"
    text: "..."
Frontend-seitig kannst du dann:

Calm Stories über Standard-Layout + Typo lösen.

Time Lab über einige wenige, wiederverwendbare Komponenten (<PomodoroCalculator />, <MeetingTimeSaver /> etc.).

Time Museum Light über ein generisches <FactPlaque />-Element.

4. Konkrete Empfehlung & nächste Schritte
Antwort auf deine Frage ganz explizit:

Best passend zu deiner Marke & dem „Charakter · Ritual · Effect“-Prinzip ist Konzept 1 – Calm Stories.

Konzept 2 (Time Lab) solltest du punktuell in der „Effect“-Sektion einsetzen, als kleine Interaktions-Module – nicht als ganze „Spielwiese“.

Konzept 3 (Time Museum) ist ideal für die Time-Facts-Sektion und vielleicht 1–2 „Flaggschiff-Timer“ (Analog, World Clock, Chess Clock) mit etwas mehr Ausstellungsgefühl.

Empfohlene nächsten Schritte:

Einen Timer als Prototypen wählen
– z. B. Pomodoro oder Countdown.

Für diesen Timer die 5 Sektionen ausfüllen

Character-Hero + Story

3–4 Rituale

3–4 Effects (davon 1 kleiner Time-Lab-Mini-Slider o. Ä.)

3–5 Time Facts in „Museumsschilder“-Optik

CTA

Visuell einmal das Calm-Stories-Layout bauen
– einspaltig, viel Luft, Akzentfarbe je Timer.

Danach entscheiden:

Wie viel „Lab“ und wie viel „Museum“ du pro Timer möchtest.

Ob es „Special Editions“ (z. B. eine besonders reichhaltige Analog-Clock-Seite) geben soll.

Wenn du magst, mache ich dir im nächsten Schritt eine komplett ausgearbeitete Beispielseite (Texte + Section-Struktur) für einen spezifischen Timer im Stil von „Calm Characters & Ritual Effects“. Sag einfach, welchen: Pomodoro, Countdown, Analog oder Stopwatch.





Du:
Im Vorfeld müssen wir erst einmal recherchieren. Zähle bitte die Dinge auf, die recherchiert werden müssen, damit wir eine Wissensdatenbank anlegen können, um das dann kontinuierlich zu füllen.


DYAI_IdeaGPT sagte:

Nachgedacht für 8s
Alles klar – wir bauen quasi eine Recherche-Checkliste für eure zukünftige Wissensdatenbank, damit jede Timer-Seite später easy befüllt werden kann (Character · Ritual · Effect · Time Facts etc.).

Ich gliedere dir das in Wissensbereiche, die ihr dann als Felder / Tabellen / Collections anlegen könnt.

1. Basis: Allgemeines Wissen zu „Zeit & Aufmerksamkeit“
Das ist euer Fundament, aus dem ihr immer wieder schöpft:

Zeitwahrnehmung & Psychologie

Wie nehmen Menschen Zeit subjektiv wahr (zu schnell, zu langsam usw.)?

Effekte von Deadlines, Countdowns, klaren Zeitblöcken auf Motivation & Stress.

Warum helfen Zeitrahmen bei Fokus (Attention, Flow, Cognitive Load)?

Zeit & Gruppen

Was passiert in Gruppen ohne klare Zeitstruktur (Meetings, Workshops, Unterricht)?

Welche bekannten Moderations- und Zeitmethoden gibt es (Timeboxing, Standups, Sprints)?

Zeit & Produktivität

Unterschied zwischen „viel Zeit haben“ und „gute Zeitnutzung“.

Typische Produktivitätsmethoden (Pomodoro, Timeboxing, Deep Work, Fokus-Sprints).

👉 Diese Dinge könnt ihr einmal gut recherchieren und immer wieder für „Effects“ und kleine Erklärtexte einsetzen.

2. Allgemeines Timer-Wissen (über alle Timer hinweg)
Hier geht es um das, was alle Timer verbindet:

Typen & Kategorien

Welche Timer-Typen gibt es (Countdown, Stopwatch, Alarm, Analog, World Clock, Metronome, Chess Clock, Cooking Timer etc.)?

Worin unterscheiden sie sich funktional & mental (offen vs. geschlossen, Start/Stop vs. Ende fix usw.)?

Historische Entwicklung von Zeitmessung

Kurzer Überblick: Sonnenuhren → mechanische Uhren → Stoppuhren → digitale Timer.

Wie sich der Umgang mit Zeit im Alltag verändert hat (Industrialisierung, Bahnverkehr, Schichtarbeit, digitale Arbeit).

Zeitkultur & Philosophie

Zentrale Ideen: „Zeit als Ressource“, „Zeit als Rahmen“, „Zeit als Erlebnis“.

Spannende Gedanken aus Philosophie, Kultur, Literatur zu Zeit (ohne direkt Zitate, eher Themen).

3. Pro Timer-Typ: Funktion & Kontext
Für jeden konkreten Timer (z. B. Pomodoro, Countdown, Stopwatch, Analog, Cooking, World Clock, Alarm, Metronome, Chess Clock) braucht ihr ein Standard-Set an Wissen:

Funktion & Mechanik

Was macht dieser Timer genau?

Typische Variationen (z. B. Countdown mit fester Dauer vs. frei einstellbar, Metronom mit BPM-Bereich etc.).

Wofür ist er nicht geeignet? (Edge Cases)

Typische Einsatzkontexte

Einzelperson (Fokus, Sport, Lernen, Kochen …)

Gruppe (Workshops, Meetings, Unterricht, Sporttraining …)

Spezialdomänen (Musik für Metronom, Schachturnier für Chess Clock, global verteilte Teams für World Clock).

Praktische „Best Practices“

Wie nutzen Profis / typische Rollen diesen Timer? (Moderatoren, Lehrkräfte, Entwickler:innen, Musiker:innen, Coaches etc.)

Typische Fehler oder Missverständnisse bei der Nutzung.

👉 Das sind gute Felder wie:
function, variants, contexts, bestPractices, notRecommendedFor.

4. Character-Layer: Recherche für die „Figur“ des Timers
Damit jede Timer-Seite ihren Charakter bekommt, braucht ihr:

Archetypen & Rollenbilder

Welche Rolle spielt dieser Timer in einer Story?

Stopwatch → „Trainer“, „Forscher“, „Sprinter“.

Countdown → „Regisseur“, „Raketenstartleiter“, „Event-Organisator“.

Pomodoro → „Coach“, „Mentor“, „Fokus-Buddy“.

Mögliche Archetypen pro Timer recherchieren & sammeln (auch Metaphern aus Literatur, Film, Popkultur – ohne Markenbindung).

Symbolik & Metaphern

Welche Metaphern passen:

„Hüter der Deadlines“, „Jäger der Sekunden“, „Zen-Begleiter“, „Rhythmusgeber“ usw.

Welche Bilder/Emotionen löst dieser Timer aus (Spannung, Ruhe, Fokus, Spiel, Wettkampf)?

Ton & Sprache je Timer

Wie „spricht“ dieser Timer, wenn man ihn personifiziert?

eher ruhig, sachlich, humorvoll, streng, verspielt?

Wörter, die passen vs. Wörter, die ihr vermeiden wollt.

👉 Diese Infos landen in Feldern wie:
archetype, metaphors, toneOfVoice, characterNotes.

5. Ritual-Layer: Routinen & Anwendungsszenarien
Für „Rituale“ braucht ihr konkrete Abläufe aus der echten Welt:

Standard-Rituale pro Timer

Pomodoro:

Klassische 25/5-Struktur.

Long Breaks, typische Anzahl am Tag.

Countdown:

Meetings zeitlich rahmen.

Übungen/Spiele mit fester Dauer.

Stopwatch:

Sprints, Tests, „wie lange brauche ich für…?“

Cooking Timer:

Typische Kochzeiten (Eier, Pasta, Reis etc.) – nur grob, nicht als Rezepte.

Metronome:

BPM-Range für übliche Übesituationen.

Chess Clock:

gängige Bedenkzeiten (Blitz, Rapid, Klassisch).

World Clock:

typische Zeitzonen-Kombis (z. B. Remote-Teams: San Francisco–Berlin–Tokyo).

Gruppenrituale & Workshop-Formate

Welche gängigen Methoden nutzen Timer?

Timeboxed-Brainstormings

Lightning Talks

Silent Work Phasen

Wie lange dauern typische Slots (5, 10, 15, 25 Minuten …)?

Rituale für verschiedene Zielgruppen

Schüler:innen / Unterricht.

Remote-Teams / Meetings.

Kreative / Schreib- und Denkphasen.

Sport & Training.

👉 Felder z. B.:
rituals[] mit title, duration, context, steps, notes.

6. Effect-Layer: Wirkung, Forschung, Anekdoten
Hier kommt rein, was der Timer bewirkt – objektiv und subjektiv:

Praktische Effekte

Was verändert sich konkret?

„Meetings werden kürzer.“

„Fokusphasen werden planbarer.“

„Weniger Multitasking.“

Wo hilft der Timer, Frust zu verringern (z. B. unendliche Diskussionen, offene Enden, Zeitblindheit)?

Psychologische & kognitive Effekte

Studien oder Artikel zu:

Wirkung klarer Zeitgrenzen (Deadlines, Timeboxing).

Aufmerksamkeitsspannen & Pausen (z. B. Nutzen von kurzen Pausen).

Wirkung von Rhythmen (z. B. Metronom auf Übeverhalten).

Relevante psychologische Konzepte (Flow, Zeitsouveränität, Cognitive Load).

Subjektives Zeitgefühl

Wie fühlt sich ein 2-Minuten-Countdown vs. 25 Minuten an?

Warum fühlen sich 5 Minuten manchmal „ewig“ an?

👉 Felder z. B.:
effects_practical, effects_psychological, insights, researchLinks.

7. Time Facts & Mini-Museum: Historie & Kultur
Für die „Time Facts“-Sektion je Timer:

Historische Meilensteine

Wann wurde dieser Timer-Typ erfunden / populär?

Wichtige Daten/Personen (z. B. Erfinder von Pomodoro-Technik, erste Stoppuhren, Entwicklung der Schachuhr).

Kulturelle & gesellschaftliche Bezüge

Wo taucht der Timer-Typ in Kultur/Alltag besonders auf?

Olympische Spiele → Stoppuhr.

Bahn & Industrie → Zeitsignale, Uhren.

Musik → Metronom.

Schach → Chess Clock.

Kuriose, überraschende Fakten

Dinge der Art: „Wenn du jedes Meeting 10 Minuten kürzer machst, sparst du über ein Jahr…“

Fun Facts zu extremen Zeitmessungen, Weltrekorden, historischen Anekdoten.

👉 Felder:
timeFacts[] mit label, category (history/culture/science), text, optional source.

8. Zitate, Mini-Storys & Sprachbausteine
Damit die Seiten lebendig werden:

Allgemeine Zeit-Zitate & Gedanken

Kein Zitat-Sammelwahn, eher: 10–20 gut passende Gedanken zur Zeit, Arbeit, Fokus, Pausen, Rhythmus.

Je Timer 1–2 passende Zitat-/Gedanken-Kandidaten.

Microcopy & Formulierungen

Typische Satzmuster für:

Einleitungen („Ich bin…“, „Dieser Timer…“)

Übergänge („Wenn dieser Timer endet…“, „Zwischen zwei Läufen…“)

Worte & Phrasen, die ihr oft verwenden wollt (z. B. „Fokusinsel“, „Zeitfenster“, „klarer Rahmen“).

Mini-Stories / Szenen

Kleine, generische Szenen:

„Ein Workshop, 12 Leute, 45 Minuten Zeit…“

„Du sitzt vor deinem Laptop, 25 Minuten auf der Uhr…“

Diese könnt ihr später pro Timer-Seite einsetzen oder variieren.

👉 Felder:
quotes[], microcopyPatterns, storySnippets[].

9. Nutzungskontext & Personas
Um später zielgerichtete Rituale & Texte zu schreiben:

Typische Nutzer:innen-Personas

Moderator:in / Workshop-Leiter:in.

Lehrer:in / Dozent:in.

Entwickler:in / Wissensarbeiter:in.

Musiker:in.

Schachspielende / Brettspieler:innen.

Home-Cook / Hobbyköch:in.

Deren Ziele & Pain Points

„Meetings laufen aus dem Ruder.“

„Ich verliere den Fokus bei längeren Aufgaben.“

„Ich will meine Übezeit strukturieren.“

„Ich brauche ein einfaches Tool für die Leinwand.“

👉 Felder:
personas[], goals, painPoints, howThisTimerHelps.

10. Meta & Orga: Damit die DB pflegbar bleibt
Nicht direkt „Inhalt“, aber wichtig für die Wissensdatenbank:

Struktur je Timer

IDs, Slug, Kategorie (z. B. „Focus“, „Event“, „Music“, „Game“).

Priorität (wichtigste Timer zuerst).

Status-Felder

„Research-Tiefe“ (grober Indikator: basic / gut / sehr tief).

„Content-Status“: Idee → Entwurf → fertig → live.

Quellen-Verweise (für Fakten & Studien).

Wenn du willst, kann ich im nächsten Schritt aus dieser Liste ein konkretes Datenmodell machen (z. B. als Tabellen-/Notion-Schema oder JSON-Struktur) und dir zeigen, wie du das Character · Ritual · Effect-Modell direkt als Felder abbildest.





Du:
Character-Layer: Recherche für die „Figur“ des Timers ----------------------------------------------------- Damit jede Timer-Seite ihren **Charakter** bekommt, braucht ihr: 1. **Archetypen & Rollenbilder** * Welche Rolle spielt dieser Timer in einer Story? * Stopwatch → „Trainer“, „Forscher“, „Sprinter“. * Countdown → „Regisseur“, „Raketenstartleiter“, „Event-Organisator“. * Pomodoro → „Coach“, „Mentor“, „Fokus-Buddy“. * Mögliche Archetypen pro Timer recherchieren & sammeln (auch Metaphern aus Literatur, Film, Popkultur – ohne Markenbindung). 2. **Symbolik & Metaphern** * Welche Metaphern passen: * „Hüter der Deadlines“, „Jäger der Sekunden“, „Zen-Begleiter“, „Rhythmusgeber“ usw. * Welche Bilder/Emotionen löst dieser Timer aus (Spannung, Ruhe, Fokus, Spiel, Wettkampf)? 3. **Ton & Sprache je Timer** * Wie „spricht“ dieser Timer, wenn man ihn personifiziert?

Das muss auch gender-konform sein. Das heißt, wir können nicht nur der Trainer, der Regisseur, der Coach, der Mentor, der Forscher...


DYAI_IdeaGPT sagte:

Nachgedacht für 11s
Voll gut, dass du das direkt mitdenkst – wenn die Timer schon „Zeitbewusstsein“ bringen sollen, sollten sie sprachlich auch im Jahr 2025 sein und nicht im „Der Trainer“-Default hängen bleiben.

Ich mache zwei Sachen:

Wie wir das Character-Layer grundsätzlich gendergerecht denken.

Was ihr zusätzlich recherchieren/definieren müsst, damit das in der Wissensdatenbank sauber abbildbar ist.

1. Grundsatz: Wie sprechen die Timer gendergerecht?
1.1. Drei mögliche Sprachstrategien
Du musst dich nicht sofort festlegen, aber für die DB ist gut, eine bevorzugte Linie zu definieren:

Neutrale Rollen & Begriffe (empfohlen für stoppclock)

Statt: „der Trainer, der Regisseur, der Mentor“

Besser:

„Fokus-Coach“

„Zeit-Begleitung“

„Regiefigur“

„Fokus-Buddy“

„Zeitguide“ / „Zeit-Guide“

Der Trick: Rolle beschreiben, ohne grammatisch männliche Berufsbezeichnung.

Explizit gegenderte Formen (Trainer*in / Trainer:in)

Headlines und Texte mit Trainerin, Regisseurin, Mentor*in etc.

Vorteil: klar sichtbar inklusiv.

Nachteil: optisch etwas „unruhiger“, weniger „calm“.

Ich-/Du-Perspektive ohne Geschlecht

Timer spricht als „ich“:

„Ich bin dein Fokus-Buddy.“

„Ich halte deine Deadlines im Blick.“

Und spricht den/die User:in mit „du“ an:

„Wenn du mich startest, …“

Da braucht es gar keine Rollenbezeichnungen wie Trainer:in im grammatischen Sinn.

Für stoppclock (ruhig, minimal, projektorfähig) würde ich kombinieren:

Primär: neutrale Begriffe + Ich-/Du-Perspektive.

Sekundär: wenn nötig, in erklärenden Texten mal „wie eine Art Trainer*in“ – also gegendert, aber nicht in jeder Headline.

1.2. Konkrete Anpassung eurer Archetypen
Statt:

Stopwatch → „Trainer“, „Forscher“, „Sprinter“

Countdown → „Regisseur“, „Raketenstartleiter“, „Event-Organisator“

Pomodoro → „Coach“, „Mentor“, „Fokus-Buddy“

Könnte in der Wissensbasis eher stehen:

Stopwatch

Archetyp: „Fokus-Guide für Sekunden und Sprints“

Vergleiche: „wie eine Trainingsbegleitung beim Laufen“, „wie ein Forschungs-Tool im Labor“

Countdown

Archetyp: „Regie über klare Endpunkte“

Vergleiche: „wie eine Regiefigur bei einem Live-Event“, „Zeitregie bei einem Raketenstart“

Pomodoro

Archetyp: „Fokus-Buddy für Arbeit in Wellen“

Vergleiche: „wie jemand, der dir sanft sagt: Jetzt konzentriert, gleich Pause.“

Wichtig:
In eurer Wissens-Datenbank trennt ihr:

Archetyp-Label (neutral): „Fokus-Buddy“, „Zeitguide“, „Rhythmusgeber“, „Ruheanker“, „Regiefigur“

Erklärende Analogien (können gegendert sein, aber dann inklusiv):

„wie eine gute Trainer*in im Hintergrund“

„wie eine Regisseur*in, die dir das Ende vorgibt“

2. Was ihr dafür gezielt recherchieren & definieren müsst
Damit die Wissensdatenbank genderkonform wird, braucht ihr ein paar zusätzliche „Schubladen“ in der Recherche:

2.1. Styleguide „Gendergerechte Sprache“
Zu klären (und in einem kleinen Style-Dokument festzuhalten):

Welche Form wollt ihr nutzen?

Sternchen (Trainer*in)?

Doppelpunkt (Trainer:in)?

Nur neutrale Begriffe?

Mischung aus neutral + gelegentlich *in?

Welche Person-Perspektive ist Standard?

Immer „du“ im Text?

Timer spricht als „ich“ (neutral)?

Sagt der Timer z. B. „ich bin dein Fokus-Buddy“ statt „dein Trainer“?

No-Gos

z. B. kein generisches Maskulinum („der Nutzer“, „der Trainer“).

Keine rein männlichen Rollenbilder („der Chef“, „der Regisseur“, „der Forscher“) in Beispielen ohne Kennzeichnung.

👉 Recherche-Aufgabe:

Bestehende Guidelines zu gendergerechter Sprache im Deutschen anschauen

Eine eigene, leichte und gut zu stoppclock passende Variante definieren.

2.2. Genderneutrale Archetypen-Liste pro Timer
Pro Timer:

Genderneutrale Archetypen & Metaphern sammeln

Stichwort-Liste pro Timer:

Stopwatch: „Sprints“, „Tests“, „Momente messen“, „Sprint-Buddy“, „Zeit-Lupe“

Countdown: „Rahmen geben“, „Endpunkte setzen“, „Time-Director“, „Abschluss-Begleitung“

Pomodoro: „Wellen“, „Fokusinseln“, „Fokus-Buddy“, „Rhythmusgeber für Arbeit“

Ziel: für jede Timerseite 2–3 neutrale Kernbegriffe, die ihr immer wieder verwendet.

Analogien genderneutral formulieren

Statt: „wie ein Trainer“ → „wie eine Trainingsbegleitung“

Statt: „wie ein Regisseur“ → „wie eine Regiefigur hinter der Bühne“

Statt: „wie ein Mentor“ → „wie eine verlässliche Unterstützung im Hintergrund“

👉 Recherche-Aufgabe:

Listen mit genderneutralen Berufs- und Rollenbeschreibungen anlegen, die zum Timer passen.

Prüfen, welche Formulierungen in eurer Zielgruppe natürlich klingen und nicht zu bürokratisch.

2.3. Genderkonforme Personas & Use Cases
Für die Rituale:

Personas neutral benennen

Statt „der Lehrer“, „der Moderator“:

„Lehrkraft“

„Moderation“ / „Workshop-Leitung“

„Teamleitung“

„Person, die das Meeting hostet“

Beispiele so schreiben, dass sie inklusiv sind

„In deinem Workshop mit 10 Teilnehmer*innen…“

„Wenn du als Lehrkraft eine ruhige Arbeitsphase anleitest…“

„Wenn ihr im Team einen Daily Standup macht…“

👉 Recherche-Aufgabe:

Pro Persona (Lehrkraft, Moderator:in, Entwickler:in etc.) 1–2 neutrale oder gegenderte Formvarianten festlegen.

Beispiele durchgehen und „der X“ vermeiden.

2.4. Timer-„Stimme“: Pronomen & Charakterstil
Damit es konsistent bleibt:

Pronomen für den Timer festlegen

Timer spricht als „ich“ (kein Geschlecht).

Spricht zum „du“.

In der 3. Person lieber „dieser Timer“, „diese Uhr“, „dieses Tool“ als „er“.

Charakter-Speech-Patterns sammeln

Beispiele für genderneutrale Selbstbeschreibung:

„Ich bin der ruhige Rahmen für deinen Fokus.“ → besser: „Ich bin ein ruhiger Rahmen für deinen Fokus.“

„Ich helfe dir, deine Meetings im Blick zu behalten.“

Textbausteine, die ihr wiederverwenden könnt, ohne ständig in gender-Fallen zu laufen.

👉 Recherche-Aufgabe:

Pro Timer einige Beispielsätze definieren, die ihr als „Stimme“ im Styleguide hinterlegt.

Testlesen: Wirkt das inklusiv, natürlich, leicht?

2.5. Meta: Felder in der Wissensdatenbank
Damit das nicht nur „in Köpfen“ existiert, sondern strukturiert ist, würde ich in der DB u. a. solche Felder einplanen:

languageStyle: Kurzbeschreibung eurer Gender-Strategie (z. B. „neutrale Rollen + du-Ansprache + gelegentlich *in“).

neutralArchetypes[]: Liste neutraler Begriffe pro Timer.

analogyExamples[]: Beispiel-Analogien in gendergerechter Form.

personaLabels[]: neutrale/genderinklusive Bezeichnungen („Lehrkraft“, „Workshop-Leitung“, „Teammitglied…“).

timerVoiceExamples[]: Beispiel-Sätze, wie der Timer spricht (Ich-/Du-Form).

Wenn du magst, kann ich dir im nächsten Schritt:

entweder eine kleine „Language-Policy“ für stoppclock formulieren (1–2 Seiten, die ihr intern nutzen könnt),

oder konkrete Beispieltexte für einen Timer (z. B. Pomodoro) so schreiben, wie sie später aussehen könnten – komplett gendergerecht, mit Charakter, Rituals und Effects.





Du:
Mischung aus neutral + gelegentlich `*in`?

das am besten
Da es standardmäßig englisch sein soll ist das du (you) passend


DYAI_IdeaGPT sagte:

Nachgedacht für 15s
Perfekt, dann nehmen wir genau diese Richtung:
👉 englische UI, Timer spricht als „I“, User als „you“, und wir achten allgemein auf genderneutrale, inklusive Formulierungen.

Ich pack dir das einmal als kompakte „Language & Voice Policy“ zusammen, die direkt in eure Wissensdatenbank integriert werden kann.

1. Grundregeln für Sprache & Perspektive (EN)
Person & Pronomen

Der Timer spricht in der Ich-Form:

„I keep your sessions on track.“

„I count the seconds for you.“

Nutzer:in ist immer „you“:

„When you start me, I…“

Für generische Personen:

statt „he“ oder „she“ → „they“

statt „a user” → oft einfach „you“, sonst „people“, „someone“, „participants“.

Gender & Inklusion

Kein generisches „he“, keine Beispiele nur mit „he/him“.

Rollen & Berufe so wählen, dass sie neutral sind:

gut: teacher, facilitator, coach, team lead, musician, player, student

eher vermeiden: policeman, chairman etc. (alles mit „-man“).

Wenn Beispiele konkrete Rollen brauchen:

„As a teacher…“, „As a facilitator…“, „As a team lead…“ – das ist im Englischen bereits neutral genug.

2. Archetypen & Rollen (Character-Layer) – englisch & neutral
Statt deutsche „der Trainer, der Regisseur…“ definieren wir englische Archetypen, die schon per se neutral sind.

Beispiele, die ihr so in der Wissensdatenbank hinterlegen könnt:

Stopwatch

archetype: „Sprint companion for short bursts and tests“

metaphors: „like a magnifying glass for moments“, „your quiet pace-keeper“

Countdown

archetype: „Director of clear endings“

metaphors: „like a stage manager behind the scenes“, „a gentle time director for your sessions“

Pomodoro

archetype: „Focus buddy for work in waves“

metaphors: „like a calm coach for your attention“, „your rhythm for deep work and breaks“

Analog Clock

archetype: „Quiet companion that just keeps moving“

metaphors: „like a window into the flow of time“

Regel fürs Wording in EN:

Fokus auf Funktion & Stimmung, nicht auf „der/die Beruf“:

„focus buddy“, „time guide“, „session companion“, „rhythm keeper“, „quiet anchor“

Wenn ihr doch vergleichen wollt:

„like a good coach in the background“

„like a calm facilitator for your meeting“

3. Personas & Use Cases – inklusiv formuliert
Für Rituale / Use Cases:

Personas neutral:

„a teacher“, „a facilitator“, „a workshop host“, „a developer“, „a musician“, „a chess player“

Beispiele:

„If you’re a teacher, you can use this timer to frame quiet work phases.“

„As a facilitator, you can keep discussions from drifting by giving them a clear time box.“

Gruppen neutral:

„your team“, „your group“, „participants“, „students“, „players“

Das kann in der DB z. B. so aussehen:

yaml
Code kopieren
personas:
  - label: "teacher"
    description: "Uses timers to frame quiet work and group activities."
  - label: "facilitator"
    description: "Uses timers to keep discussions and exercises on track."
  - label: "developer"
    description: "Uses timers to protect focus blocks and breaks."
4. Felder für eure Wissensdatenbank (Language-Teil)
Zusätzlich zu Character · Ritual · Effect würde ich in der DB ein paar kleine Sprach-Felder anlegen:

yaml
Code kopieren
languageStyle:
  person_perspective: "Timer: I, User: you"
  generic_pronoun: "they"
  notes: "Avoid generic 'he'. Prefer neutral roles like teacher, facilitator, team lead."

neutralArchetypes:
  - "focus buddy"
  - "time guide"
  - "session companion"
  - "rhythm keeper"

timerVoiceExamples:
  - "I keep your session within a clear time frame."
  - "When you start me, I hold the space so you can focus."
  - "If you need a clear end, I’m here for that."

personaLabels:
  - "teacher"
  - "facilitator"
  - "team lead"
  - "musician"
  - "student"
  - "chess player"
Damit ist in der Wissensbasis schon fest verdrahtet, wie der Timer spricht und wen ihr wie ansprecht.

5. Mini-Beispiel: Pomodoro-Section im finalen Stil (EN)
Nur damit du ein Gefühl bekommst, wie das dann klingt:

Character (Hero)

Pomodoro – Focus in small, clear waves
I’m your focus buddy. When you start me, I hold a 25-minute space for one thing – then I remind you to come up for air.

Ritual (Use Case)

Deep work sprint
Choose one task, start me for 25 minutes, and stay with it. When I ring, you take a short break – then you decide if you want another round.

Effect

What this does for you
You stop treating your day as one endless block. Instead, you move through it in clear, manageable waves. Many people notice it’s easier to start, because they only commit to one short round.

Alles durchgängig: I / you, neutrale Rollen, keine gendered Pronomen.

Wenn du möchtest, kann ich als nächstes:

das Datenmodell (JSON/YAML/Notion-Tabellenstruktur) für „Character · Ritual · Effect · Time Facts“ inkl. Language-Feldern einmal komplett skizzieren,

oder eine voll ausgearbeitete Pomodoro- oder Countdown-Seite auf Basis dieser Regeln schreiben.





Du:
das **Datenmodell** (JSON/YAML/Notion-Tabellenstruktur) für „Character · Ritual · Effect · Time Facts“ inkl. Language-Feldern einmal komplett skizzieren,

das bitte


DYAI_IdeaGPT sagte:

Nachgedacht für 5s
Alles klar, dann baue ich dir jetzt ein konkretes Datenmodell für eure Wissensbasis:

Kern-Entity: Timer

Inhalte in Blöcken: Character · Ritual · Effect · Time Facts · Language

In zwei Formen:

JSON/YAML-Struktur (technisch)

Notion-/Tabellen-Struktur (für Content-Redaktion)

1. Überblick: Welche Entities gibt es?
Hauptobjekt „Timer“ (eine Seite bei stoppclock):

Basis-Infos

Character

Rituals

Effects

Time Facts

Language & Voice

Verknüpfungen (Personas, verwandte Timer)

Weitere Tabellen/Collections:

Personas (teacher, facilitator, developer …)

Global Language Settings (einmal pro Projekt)

Optional: Interactive Modules / Experiments (für „Time Lab“-Effekte)

2. JSON-Modell für einen Timer (Beispiel: Pomodoro)
Das ist eine Beispiel-Instanz. Du kannst daraus sehr leicht ein Schema ableiten.

json
Code kopieren
{
  "id": "timer_pomodoro",
  "slug": "pomodoro",
  "name": "Pomodoro",
  "category": "focus",
  "priority": 1,
  "status": "published",

  "meta": {
    "shortDescription": "Focus in small, clear waves.",
    "icon": "pomodoro-tomato",
    "accentColor": "#E4573D"
  },

  "character": {
    "archetype": "Focus buddy for work in waves",
    "tagline": "Focus in small, clear waves.",
    "heroText": "I’m your focus buddy. When you start me, I hold a short, clear space for one thing — then I remind you to come up for air.",
    "story": "I was inspired by a simple kitchen timer in the shape of a tomato. People started using short focus blocks with regular breaks to make long tasks feel lighter. Today, I help you turn your day into a sequence of small, clear waves instead of one endless blur.",
    "metaphors": [
      "like a calm coach for your attention",
      "like a rhythm that holds your focus and your breaks"
    ],
    "toneOfVoice": "calm, encouraging, clear",
    "imageRef": "illustrations/timers/pomodoro.svg"
  },

  "rituals": [
    {
      "id": "pomodoro_deep_work_sprint",
      "title": "Deep work sprint",
      "description": "Use me to create short, focused blocks for demanding tasks.",
      "steps": [
        "Pick one concrete task.",
        "Start me for 25 minutes and stay with that task only.",
        "When I ring, take a short break.",
        "Repeat if you still have energy for another round."
      ],
      "duration": {
        "workMinutes": 25,
        "breakMinutes": 5,
        "optionalLongBreakMinutes": 15
      },
      "context": ["solo", "desktop"],
      "personas": ["developer", "writer", "student"],
      "tags": ["focus", "productivity"]
    },
    {
      "id": "pomodoro_study_block",
      "title": "Study block",
      "description": "Use me to break your study time into clear, manageable sessions.",
      "steps": [
        "Decide what you want to learn in this session.",
        "Start me and keep your materials in front of you.",
        "When I ring, stretch, drink water, and let your mind reset."
      ],
      "duration": {
        "workMinutes": 25,
        "breakMinutes": 5
      },
      "context": ["solo", "classroom"],
      "personas": ["student", "teacher"],
      "tags": ["learning", "study"]
    }
  ],

  "effects": {
    "summary": "I turn your day into short, clear focus waves instead of one endless block.",
    "practical": [
      "You stop treating your work as one long session and move in short, defined blocks.",
      "It becomes easier to start, because you only commit to one round.",
      "Breaks are built-in, so you are less likely to work past your energy."
    ],
    "psychological": [
      "Time feels less overwhelming, because each block has a clear end.",
      "You experience more small wins, which makes it easier to stay motivated.",
      "Your attention has a rhythm instead of being constantly on."
    ],
    "researchNotes": [
      {
        "label": "Attention span",
        "text": "Short, uninterrupted focus blocks often align better with how long people can keep deep attention on one task.",
        "sourceType": "article",
        "sourceUrl": "",
        "sourceNote": "Fill with actual reference later."
      }
    ],
    "interactiveModules": [
      {
        "type": "pomodoro_day_calculator",
        "title": "How many focus blocks fit into your day?",
        "description": "Let people adjust how many hours they want to focus and show how many sessions that becomes.",
        "config": {
          "minHours": 1,
          "maxHours": 8,
          "defaultHours": 4,
          "workMinutes": 25,
          "breakMinutes": 5
        }
      }
    ]
  },

  "timeFacts": [
    {
      "id": "fact_pomodoro_origin",
      "label": "Late 1980s",
      "category": "history",
      "text": "The Pomodoro Technique was created by Francesco Cirillo, inspired by a small tomato-shaped kitchen timer.",
      "era": "1980s",
      "sourceUrl": "",
      "sourceNote": "Check and add proper reference."
    },
    {
      "id": "fact_pomodoro_blocks",
      "label": "Blocks and breaks",
      "category": "science",
      "text": "Short focus blocks with regular breaks can help reduce mental fatigue and make it easier to come back to demanding tasks.",
      "era": null,
      "sourceUrl": "",
      "sourceNote": "Link to cognitive fatigue / breaks research."
    }
  ],

  "language": {
    "perspective": {
      "timer": "I",
      "user": "you",
      "genericPronoun": "they"
    },
    "styleNotes": [
      "Keep the tone calm, encouraging, and clear.",
      "Avoid gendered pronouns for generic people; use 'they' instead.",
      "Prefer neutral roles like 'teacher', 'facilitator', 'team lead', 'musician', 'student'."
    ],
    "microcopyPatterns": [
      "When you start me, I hold the space so you can focus.",
      "If you need a clear end, I’m here for that.",
      "You don’t have to do everything at once — just this one round."
    ],
    "personaLabels": [
      "teacher",
      "facilitator",
      "team lead",
      "developer",
      "musician",
      "student",
      "chess player"
    ]
  },

  "relationships": {
    "relatedTimers": ["timer_countdown", "timer_analog"],
    "tags": ["focus", "productivity", "study"]
  }
}
3. YAML-Variante (gleiche Struktur, nur anderes Format)
Falls du z. B. mit Astro Content Collections, Eleventy, Hugo oder einem Flat-File-Setup arbeiten willst.

yaml
Code kopieren
id: "timer_pomodoro"
slug: "pomodoro"
name: "Pomodoro"
category: "focus"
priority: 1
status: "published"

meta:
  shortDescription: "Focus in small, clear waves."
  icon: "pomodoro-tomato"
  accentColor: "#E4573D"

character:
  archetype: "Focus buddy for work in waves"
  tagline: "Focus in small, clear waves."
  heroText: "I’m your focus buddy. When you start me, I hold a short, clear space for one thing — then I remind you to come up for air."
  story: >
    I was inspired by a simple kitchen timer in the shape of a tomato. People started
    using short focus blocks with regular breaks to make long tasks feel lighter.
    Today, I help you turn your day into a sequence of small, clear waves instead
    of one endless blur.
  metaphors:
    - "like a calm coach for your attention"
    - "like a rhythm that holds your focus and your breaks"
  toneOfVoice: "calm, encouraging, clear"
  imageRef: "illustrations/timers/pomodoro.svg"

rituals:
  - id: "pomodoro_deep_work_sprint"
    title: "Deep work sprint"
    description: "Use me to create short, focused blocks for demanding tasks."
    steps:
      - "Pick one concrete task."
      - "Start me for 25 minutes and stay with that task only."
      - "When I ring, take a short break."
      - "Repeat if you still have energy for another round."
    duration:
      workMinutes: 25
      breakMinutes: 5
      optionalLongBreakMinutes: 15
    context: ["solo", "desktop"]
    personas: ["developer", "writer", "student"]
    tags: ["focus", "productivity"]

  - id: "pomodoro_study_block"
    title: "Study block"
    description: "Use me to break your study time into clear, manageable sessions."
    steps:
      - "Decide what you want to learn in this session."
      - "Start me and keep your materials in front of you."
      - "When I ring, stretch, drink water, and let your mind reset."
    duration:
      workMinutes: 25
      breakMinutes: 5
    context: ["solo", "classroom"]
    personas: ["student", "teacher"]
    tags: ["learning", "study"]

effects:
  summary: "I turn your day into short, clear focus waves instead of one endless block."
  practical:
    - "You stop treating your work as one long session and move in short, defined blocks."
    - "It becomes easier to start, because you only commit to one round."
    - "Breaks are built-in, so you are less likely to work past your energy."
  psychological:
    - "Time feels less overwhelming, because each block has a clear end."
    - "You experience more small wins, which makes it easier to stay motivated."
    - "Your attention has a rhythm instead of being constantly on."
  researchNotes:
    - label: "Attention span"
      text: "Short, uninterrupted focus blocks often align better with how long people can keep deep attention on one task."
      sourceType: "article"
      sourceUrl: ""
      sourceNote: "Fill with actual reference later."
  interactiveModules:
    - type: "pomodoro_day_calculator"
      title: "How many focus blocks fit into your day?"
      description: "Let people adjust how many hours they want to focus and show how many sessions that becomes."
      config:
        minHours: 1
        maxHours: 8
        defaultHours: 4
        workMinutes: 25
        breakMinutes: 5

timeFacts:
  - id: "fact_pomodoro_origin"
    label: "Late 1980s"
    category: "history"
    text: "The Pomodoro Technique was created by Francesco Cirillo, inspired by a small tomato-shaped kitchen timer."
    era: "1980s"
    sourceUrl: ""
    sourceNote: "Check and add proper reference."
  - id: "fact_pomodoro_blocks"
    label: "Blocks and breaks"
    category: "science"
    text: "Short focus blocks with regular breaks can help reduce mental fatigue and make it easier to come back to demanding tasks."
    era: null
    sourceUrl: ""
    sourceNote: "Link to cognitive fatigue / breaks research."

language:
  perspective:
    timer: "I"
    user: "you"
    genericPronoun: "they"
  styleNotes:
    - "Keep the tone calm, encouraging, and clear."
    - "Avoid gendered pronouns for generic people; use 'they' instead."
    - "Prefer neutral roles like 'teacher', 'facilitator', 'team lead', 'musician', 'student'."
  microcopyPatterns:
    - "When you start me, I hold the space so you can focus."
    - "If you need a clear end, I’m here for that."
    - "You don’t have to do everything at once — just this one round."
  personaLabels:
    - "teacher"
    - "facilitator"
    - "team lead"
    - "developer"
    - "musician"
    - "student"
    - "chess player"

relationships:
  relatedTimers:
    - "timer_countdown"
    - "timer_analog"
  tags:
    - "focus"
    - "productivity"
    - "study"
4. Notion-/Tabellen-Struktur (für Redaktion)
Wenn ihr das in Notion (oder Airtable o. Ä.) abbilden wollt, würde ich es so strukturieren:

4.1. Tabelle „Timers“
Spalten (Auszug):

Name (Pomodoro)

Slug (pomodoro)

Category (focus, event, music, game …)

Priority (Number)

Status (Select: idea / draft / review / published)

Short description (Focus in small, clear waves.)

Archetype (Focus buddy for work in waves)

Tagline

Hero text

Story (Long text)

Tone of voice (calm, encouraging, clear)

Icon (File/Relation)

Accent color (Text/Select)

Related timers (Relation → Timers)

Relations:

Rituals (Relation → Tabelle „Rituals“)

Effects (Relation → Tabelle „Effects“)

Time facts (Relation → Tabelle „Time Facts“)

4.2. Tabelle „Rituals“
Spalten:

Title (Deep work sprint)

Timer (Relation → Timers)

Description

Steps (Long text / Checkbox-Liste)

Work minutes (Number)

Break minutes (Number)

Long break minutes (Number, optional)

Context (Multi-select: solo / group / classroom / desktop / mobile / projector …)

Personas (Relation → Personas)

Tags (Multi-select)

4.3. Tabelle „Effects“
Spalten:

Timer (Relation → Timers)

Summary

Practical effects (Long text / Bullet-Liste)

Psychological effects (Long text / Bullet-Liste)

Research notes (Long text oder Relation zu eigener Tabelle „Research“)

Interactive modules (Text oder Relation zu Tabelle „Interactive Modules“)

4.4. Tabelle „Time Facts“
Spalten:

Timer (Relation → Timers)

Label (Late 1980s, Blocks and breaks…)

Category (Select: history / culture / science / fun)

Text

Era / Year (Text/Number)

Source URL

Source note (z. B. „check before publishing“)

4.5. Tabelle „Personas“
Spalten:

Name (teacher, facilitator, developer…)

Description (Short text)

Typical goals (Long text)

Pain points (Long text)

Relevant timers (Relation → Timers)

4.6. Tabelle „Language & Voice (global)“
Einmalig oder als Seite/DB:

Timer perspective: „I“

User perspective: „you“

Generic pronoun: „they“

Style notes: Bullet-Liste

Preferred roles: teacher, facilitator, team lead, musician, student, chess player

Patterns: typische Microcopy-Formeln