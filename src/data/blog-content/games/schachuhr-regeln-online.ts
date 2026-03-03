import type { BlogPostContent } from '../../../types/blog-types';

export const schachuhrRegelnOnline: BlogPostContent = {
  frontmatter: {
    title: 'Schachuhr Online — Regeln, Zeitkontrollen & Nutzung',
    slug: 'schachuhr-regeln-online',
    description: 'Alle Schachuhr-Regeln erklärt. Blitz, Rapid, Classical Zeitkontrolle. Wie man eine digitale Schachuhr nutzt. Mit kostenloser Online-Schachuhr.',
    image: 'https://stoppclock.com/og/timer-og.png',
    author: 'Stoppclock',
    publishedAt: '2026-02-20',
    updatedAt: '2026-03-01',
    readingTime: 8,
    category: 'Spiele',
    tags: ['schach', 'schachuhr', 'chess', 'timer', 'spielregeln'],
    keywords: ['schachuhr online', 'schachuhr regeln', 'chess clock', 'blitzschach timer'],
    relatedPosts: ['stoppuhr-online-guide', 'countdown-timer-klasse'],
  },
  sections: [
    {
      type: 'quick-answer',
      props: {
        heading: 'Schachuhr: Das Wichtigste',
        summary: 'Eine <strong>Schachuhr</strong> misst die Denkzeit jedes Spielers separat. Wenn du deinen Zug gemacht hast, drückst du einen Knopf — deine Zeit stoppt und die des Gegners läuft. Wer seine Zeit aufgebraucht hat, verliert (unabhängig vom Brettstand).',
        bulletPoints: [
          { label: 'Blitzschach', value: '3-5 Minuten pro Spieler' },
          { label: 'Rapid', value: '10-25 Minuten pro Spieler' },
          { label: 'Classical', value: '90+ Minuten pro Spieler' },
          { label: 'Online-Nutzung', value: 'Kostenlos, für Freizeitpartien' },
        ],
      },
    },
    {
      type: 'text',
      props: {
        html: `
          <h2>Wie funktioniert eine Schachuhr?</h2>
          <p>Eine Schachuhr besteht aus <strong>zwei Zeitmessern</strong> — einen für jeden Spieler. Die Grundregel:</p>
          <ol>
            <li>Spieler A macht einen Zug</li>
            <li>Spieler A drückt auf seinen Knopf der Schachuhr</li>
            <li>Spieler A's Zeit stoppt, Spieler B's Zeit beginnt zu laufen</li>
            <li>Spieler B macht einen Zug, drückt seinen Knopf...</li>
            <li>...und so weiter bis ein Spieler seine Zeit aufgebraucht hat oder das Spiel endet</li>
          </ol>

          <p>Wer seine Zeit aufgebraucht hat und noch keine Partie gewonnen hat, verliert — das nennt man <strong>"Zeitüberschreitung"</strong> oder im Englischen "Time Out". Selbst wenn man eine gewonnene Stellung auf dem Brett hat, verliert man bei Zeitüberschreitung.</p>

          <h2>Die wichtigsten Schach-Zeitkontrollen</h2>

          <h3>Bullet (< 3 Minuten)</h3>
          <p>Weniger als 3 Minuten Gesamtzeit pro Spieler. Extrem schnell — jeder Zug dauert nur Sekunden. Beliebt auf Online-Plattformen, aber für Anfänger nicht empfehlenswert da das Spiel zu hektisch ist.</p>
          <ul>
            <li>1+0: 1 Minute, kein Inkrement</li>
            <li>2+1: 2 Minuten + 1 Sekunde Inkrement pro Zug</li>
          </ul>

          <h3>Blitzschach (3-5 Minuten)</h3>
          <p>Blitzschach (oder "Blitz") ist die populärste informelle Zeitkontrolle. 3-5 Minuten pro Spieler, manchmal mit Inkrement:</p>
          <ul>
            <li>3+0: 3 Minuten, Standard-Blitz</li>
            <li>3+2: 3 Minuten + 2 Sekunden pro Zug (Fischer-Regelung)</li>
            <li>5+0: 5 Minuten, etwas ruhiger</li>
          </ul>

          <h3>Rapid (10-25 Minuten)</h3>
          <p>Rapid (auch "Schnellschach") bietet mehr Denkzeit für strategische Überlegungen:</p>
          <ul>
            <li>10+0: 10 Minuten — häufig bei Turnieren</li>
            <li>15+10: 15 Minuten + 10 Sekunden/Zug</li>
            <li>25+10: 25 Minuten — ausreichend für komplexe Varianten</li>
          </ul>

          <h3>Classical / Standard (90+ Minuten)</h3>
          <p>Für ernsthafte Partien und Turnierschach. Die Weltmeisterschaft nutzt 120 Minuten + 60 Sekunden/Zug:</p>
          <ul>
            <li>90+30: FIDE-Standard für Turniere</li>
            <li>120+60: WM-Format</li>
            <li>Oft mit "Double Time Control": z.B. 40 Züge in 2h, dann weitere 30 Min</li>
          </ul>

          <h2>Das Inkrement (Fischer-Regelung)</h2>
          <p>Das <strong>Inkrement</strong> (auch Fischer Inkrement, benannt nach Bobby Fischer) fügt nach jedem Zug eine bestimmte Zeit zur Uhr hinzu. Das verhindert extremes Zeitdruck bei den letzten Zügen.</p>

          <p>Beispiel: 10+5 bedeutet:</p>
          <ul>
            <li>Jeder Spieler startet mit 10 Minuten</li>
            <li>Nach jedem gemachten Zug werden +5 Sekunden gutgeschrieben</li>
            <li>Selbst in Zeitnot kannst du weiterspielen wenn du schnell genug ziehst</li>
          </ul>

          <h2>Unsere Online-Schachuhr nutzen</h2>
          <p>Öffne <a href="/#/chess">stoppclock.com → Schachuhr</a>.</p>

          <h3>Einrichtung:</h3>
          <ol>
            <li>Wähle eine vorkonfigurierte Zeitkontrolle (Blitz, Rapid, Classical) oder stelle sie manuell ein</li>
            <li>Weißer Spieler drückt auf seinen Bereich um die Partie zu starten</li>
            <li>Nach jedem Zug: Drücke deinen Bereich → Uhr wechselt zum Gegner</li>
            <li>Das Spiel endet automatisch wenn eine Seite 0:00 erreicht</li>
          </ol>

          <h3>Tastaturkürzel:</h3>
          <ul>
            <li><kbd>Space</kbd> — Pausieren/Fortsetzen</li>
            <li><kbd>R</kbd> — Reset (zurück zu Anfang)</li>
            <li>Klick auf Spieler-Bereich — Zug bestätigen und Uhr wechseln</li>
          </ul>

          <h2>Schachregeln und die Uhr: Was viele nicht wissen</h2>

          <h3>Regel 1: Finger weg vor dem Drücken</h3>
          <p>Laut FIDE-Regeln: Man darf den Uhr-Knopf erst drücken, nachdem man die Figur losgelassen hat. Wer die Uhr drückt und die Figur noch hält, spielt nach dem Ermessen des Schiedsrichters.</p>

          <h3>Regel 2: Mit welcher Hand drücken?</h3>
          <p>Man muss die Uhr mit derselben Hand drücken, mit der man den Zug gemacht hat. Das soll Schummeln verhindern (gleichzeitiges Ziehen und Drücken).</p>

          <h3>Regel 3: Was passiert bei Zeitüberschreitung?</h3>
          <p>Wer keine Zeit mehr hat, verliert — AUSSER der Gegner hat kein Material mehr um mattsetzen zu können (z.B. nur noch König). Dann ist es Remis.</p>

          <h3>Regel 4: Die Uhr kann angehalten werden bei...</h3>
          <ul>
            <li>Remis-Angebot oder Ablehnung</li>
            <li>Regelverstoß-Reklamation</li>
            <li>Schiedsrichter-Fragen</li>
            <li>Partie-Ende</li>
          </ul>

          <h2>Für wen ist eine Schachuhr relevant?</h2>

          <h3>Für Freizeitschach zu zweit</h3>
          <p>Eine Schachuhr macht Freizeitpartien fairer und verhindert stundenlanges Grübeln. Für entspannte Heimpartien empfehlen wir <strong>10-15 Minuten pro Spieler</strong>.</p>

          <h3>Für Schulschach-AGs</h3>
          <p>Schach-AGs in Schulen nutzen oft Schachuhren um Schüler zu zeitlich begrenztem Spiel zu erziehen. Eine kostenlose Online-Schachuhr ist ideal wenn keine echten Uhren vorhanden sind.</p>

          <h3>Für Online-Turniere</h3>
          <p>Für ernsthafte Online-Turniere nutzen etablierte Plattformen (Chess.com, Lichess) eingebaute Zeitkontrollen. Unsere Schachuhr eignet sich für informelle Turniere und Duell-Partien.</p>
        `,
      },
    },
    {
      type: 'comparison-table',
      props: {
        heading: 'Zeitkontrollen im Überblick',
        columns: ['Format', 'Zeit pro Spieler', 'Typische Partie', 'Für wen?'],
        rows: [
          ['Bullet', '< 3 Minuten', '< 6 Min', 'Erfahrene Spieler'],
          ['Blitz', '3-5 Minuten', '< 12 Min', 'Alle ab Mittelstufe'],
          ['Rapid', '10-25 Minuten', '20-60 Min', 'Freizeitschach, Turniere'],
          ['Classical', '90+ Minuten', '3-6 Stunden', 'Ernst-Turniere, Vereine'],
        ],
      },
    },
    {
      type: 'faq',
      props: {
        heading: 'Häufige Fragen zur Schachuhr',
        items: [
          {
            question: 'Was bedeutet "+0" oder "+5" nach der Zeitangabe?',
            answer: 'Das ist das Inkrement (Fischer-Regelung). "3+5" bedeutet: 3 Minuten Grundzeit + 5 Sekunden werden nach jedem Zug zur Uhr addiert. "+0" bedeutet kein Inkrement — die Zeit läuft einfach durch.',
          },
          {
            question: 'Wie stellt man eine Schachuhr für Anfänger ein?',
            answer: 'Für Anfänger empfehlen wir 10+10 (10 Minuten + 10 Sekunden Inkrement pro Zug). So gibt es keinen extremen Zeitdruck aber trotzdem eine klare Zeitstruktur. Kinder unter 10 Jahren: 15+0 ist entspannter.',
          },
          {
            question: 'Kann man bei einem Remis die Zeit weiterlaufen lassen?',
            answer: 'Nein. Bei Remis endet die Partie und die Uhren werden angehalten. In einem formellen Turnier muss der Schiedsrichter ein Remis bestätigen.',
          },
          {
            question: 'Braucht man eine physische Schachuhr für Turniere?',
            answer: 'Ja, für offizielle FIDE-Turniere sind homologierte Schachuhren (oft DGT-Uhren) Pflicht. Für informelle Partien, Schulschach und Freizeitspiel ist unsere kostenlose Online-Schachuhr voll ausreichend.',
          },
          {
            question: 'Was ist der Unterschied zwischen Chess.com und Stoppclock für Schach?',
            answer: 'Chess.com und Lichess.org sind Online-Schachspielplattformen — du spielst dort gegen andere über das Internet. Stoppclock ist ein Schachuhr-Tool für physische Partien vor Ort (zwei Spieler, ein Gerät). Völlig unterschiedliche Anwendungsfälle.',
          },
        ],
      },
    },
    {
      type: 'cta',
      props: {
        heading: 'Schachpartie starten',
        description: 'Kostenlose Online-Schachuhr — einfach einrichten',
        buttons: [
          { label: 'Schachuhr öffnen', href: '/#/chess', variant: 'primary', emoji: '♟️' },
          { label: 'Countdown (alternativ)', href: '/#/countdown', variant: 'secondary', emoji: '⏳' },
        ],
      },
    },
  ],
};
