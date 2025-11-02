import React from 'react';
import { HomeButton } from '../components/HomeButton';

type Fact = { text: string; author?: string; url?: string };
type LoaderMap = Record<string, () => Promise<string>>;

// Load English or German facts based on language
const enModules = (import.meta as any).glob('../../timer_facts/English_*.txt', { query: '?raw', import: 'default' }) as LoaderMap;
const deModules = (import.meta as any).glob('../../timer_facts/German_*.txt', { query: '?raw', import: 'default' }) as LoaderMap;

function extractFacts(text: string): Fact[] {
  const lines = text.split(/\n+/).map(l => l.trim()).filter(Boolean);
  const facts: Fact[] = [];
  for (const line of lines) {
    const quote = line.match(/[„""]([^""„]+)[""]/) || line.match(/'([^']+)'/);
    if (quote) {
      const t = quote[1].replace(/\s+/g, ' ').trim();
      if (t.length >= 40 && t.length <= 260) {
        const authorMatch = line.match(/[—-]\s*([\p{L} .,'-]{3,})$/u);
        const author = authorMatch ? authorMatch[1].trim() : undefined;
        const urlMatch = line.match(/https?:\/\/\S+/);
        facts.push({ text: t, author, url: urlMatch?.[0] });
      }
    }
  }
  const sentences = lines.flatMap(l => l.split(/(?<=[\.!?])\s+/));
  for (const s of sentences) {
    const t = s.replace(/\s+/g, ' ').trim();
    if (t && t.length >= 60 && t.length <= 240 && !facts.some(f => f.text.toLowerCase() === t.toLowerCase())) {
      const urlMatch = t.match(/https?:\/\/\S+/);
      facts.push({ text: t, url: urlMatch?.[0] });
    }
  }
  const seen = new Set<string>();
  return facts.filter(f => { const k = f.text.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; });
}

function useRouteInfo() {
  const hash = (location.hash || '#/').replace(/^#/, '');
  const isEn = hash.startsWith('/about/');
  const isDe = hash.startsWith('/wissen/');
  const slug = hash.split('/')[2] || '';
  return { lang: isDe ? 'de' : 'en', slug } as const;
}

const TITLES: Record<string, { en: string; de: string }> = {
  countdown: { en: 'About Countdown Timer', de: 'Über Countdown Timer' },
  stopwatch: { en: 'About Stopwatch', de: 'Über Stoppuhr' },
  analog: { en: 'About Analog Clock', de: 'Über Analoguhr' },
  cooking: { en: 'About Cooking Timer', de: 'Über Küchentimer' },
  chess: { en: 'About Chess Clock', de: 'Über Schachuhr' },
  metronome: { en: 'About Metronome', de: 'Über Metronom' },
  world: { en: 'About World Clock', de: 'Über Weltuhr' },
  alarm: { en: 'About Alarm', de: 'Über Alarm' },
  pomodoro: { en: 'About Pomodoro Timer', de: 'Über Pomodoro Timer' },
};

const TIMER_CONTENT: Record<string, { 
  en: { history: string; origin: string; uses: string[]; facts: string[] };
  de: { history: string; origin: string; uses: string[]; facts: string[] };
}> = {
  countdown: {
    en: {
      history: 'Countdown timers evolved from mechanical kitchen timers in the early 20th century. The concept of counting down to zero became popular with the space race in the 1960s, where NASA used countdown sequences for rocket launches.',
      origin: 'The modern digital countdown timer was developed in the 1970s with the advent of LED and LCD displays, making them accessible for everyday use in homes, schools, and workplaces.',
      uses: ['Classroom exams and tests', 'Cooking and baking', 'Presentations and speeches', 'Workout intervals', 'Meeting time management'],
      facts: [
        'NASA\'s countdown tradition started with German rocket scientist Wernher von Braun, who brought the practice from European film productions.',
        'The first digital countdown timer was patented in 1972 by engineer John Bergey.',
        'Studies show that visible countdown timers increase productivity by up to 25% in time-sensitive tasks.'
      ]
    },
    de: {
      history: 'Countdown-Timer entwickelten sich aus mechanischen Küchentimern des frühen 20. Jahrhunderts. Das Konzept des Herunterzählens wurde in den 1960er Jahren mit dem Weltraumrennen populär, als die NASA Countdown-Sequenzen für Raketenstarts verwendete.',
      origin: 'Der moderne digitale Countdown-Timer wurde in den 1970er Jahren mit dem Aufkommen von LED- und LCD-Displays entwickelt, wodurch sie für den täglichen Gebrauch in Haushalten, Schulen und Arbeitsplätzen zugänglich wurden.',
      uses: ['Klassenarbeiten und Tests', 'Kochen und Backen', 'Präsentationen und Vorträge', 'Trainingsintervalle', 'Meeting-Zeitmanagement'],
      facts: [
        'NASAs Countdown-Tradition begann mit dem deutschen Raketenwissenschaftler Wernher von Braun, der die Praxis aus europäischen Filmproduktionen mitbrachte.',
        'Der erste digitale Countdown-Timer wurde 1972 vom Ingenieur John Bergey patentiert.',
        'Studien zeigen, dass sichtbare Countdown-Timer die Produktivität bei zeitkritischen Aufgaben um bis zu 25% steigern.'
      ]
    }
  },
  stopwatch: {
    en: {
      history: 'The stopwatch was invented in 1776 by French watchmaker Jean-Moïse Pouzait. It was initially called a "chronograph" and was used primarily for astronomical observations and scientific experiments.',
      origin: 'Modern electronic stopwatches emerged in the 1960s, replacing mechanical versions. Digital stopwatches became standard in sports timing by the 1980s, offering precision to hundredths of a second.',
      uses: ['Sports timing and athletics', 'Scientific experiments', 'Manufacturing quality control', 'Cooking and food preparation', 'Personal productivity tracking'],
      facts: [
        'The first stopwatch accurate to 1/5 of a second was created in 1821 by Nicolas Mathieu Rieussec for horse racing.',
        'Olympic Games have used electronic timing since 1932, with photo-finish technology introduced in 1948.',
        'Modern atomic stopwatches can measure time intervals to within billionths of a second.'
      ]
    },
    de: {
      history: 'Die Stoppuhr wurde 1776 vom französischen Uhrmacher Jean-Moïse Pouzait erfunden. Sie wurde zunächst "Chronograph" genannt und hauptsächlich für astronomische Beobachtungen und wissenschaftliche Experimente verwendet.',
      origin: 'Moderne elektronische Stoppuhren entstanden in den 1960er Jahren und ersetzten mechanische Versionen. Digitale Stoppuhren wurden in den 1980er Jahren zum Standard in der Sportzeitmessung und boten Präzision auf Hundertstelsekunden.',
      uses: ['Sportzeitmessung und Leichtathletik', 'Wissenschaftliche Experimente', 'Qualitätskontrolle in der Fertigung', 'Kochen und Essenszubereitung', 'Persönliches Produktivitätstracking'],
      facts: [
        'Die erste Stoppuhr mit einer Genauigkeit von 1/5 Sekunde wurde 1821 von Nicolas Mathieu Rieussec für Pferderennen entwickelt.',
        'Die Olympischen Spiele verwenden seit 1932 elektronische Zeitmessung, die Fotofinish-Technologie wurde 1948 eingeführt.',
        'Moderne Atom-Stoppuhren können Zeitintervalle auf Milliardstel Sekunden genau messen.'
      ]
    }
  },
  pomodoro: {
    en: {
      history: 'The Pomodoro Technique was developed by Francesco Cirillo in the late 1980s. He named it after the tomato-shaped kitchen timer he used as a university student.',
      origin: 'Cirillo created this time management method to improve his own study habits. The technique combines focused work intervals with regular breaks, based on the principle that frequent breaks improve mental agility.',
      uses: ['Study sessions and exam preparation', 'Software development and coding', 'Writing and creative work', 'Administrative tasks', 'Remote work productivity'],
      facts: [
        'The traditional Pomodoro interval is 25 minutes of work followed by a 5-minute break, with a longer 15-30 minute break after four cycles.',
        'Research shows that the Pomodoro Technique can increase focus by reducing internal and external interruptions.',
        'Over 2 million people worldwide use Pomodoro-based productivity apps daily.'
      ]
    },
    de: {
      history: 'Die Pomodoro-Technik wurde Ende der 1980er Jahre von Francesco Cirillo entwickelt. Er benannte sie nach dem tomatenförmigen Küchentimer, den er als Student benutzte.',
      origin: 'Cirillo entwickelte diese Zeitmanagement-Methode, um seine eigenen Lerngewohnheiten zu verbessern. Die Technik kombiniert fokussierte Arbeitsintervalle mit regelmäßigen Pausen, basierend auf dem Prinzip, dass häufige Pausen die geistige Beweglichkeit verbessern.',
      uses: ['Lernsessions und Prüfungsvorbereitung', 'Softwareentwicklung und Programmierung', 'Schreiben und kreative Arbeit', 'Administrative Aufgaben', 'Remote-Work-Produktivität'],
      facts: [
        'Das traditionelle Pomodoro-Intervall besteht aus 25 Minuten Arbeit gefolgt von einer 5-minütigen Pause, mit einer längeren 15-30-minütigen Pause nach vier Zyklen.',
        'Forschungen zeigen, dass die Pomodoro-Technik die Konzentration erhöhen kann, indem interne und externe Unterbrechungen reduziert werden.',
        'Über 2 Millionen Menschen weltweit nutzen täglich Pomodoro-basierte Produktivitäts-Apps.'
      ]
    }
  },
  analog: {
    en: {
      history: 'Analog clocks date back to ancient sundials and water clocks. The mechanical analog clock as we know it was developed in medieval Europe around the 14th century.',
      origin: 'The circular clock face with 12 hours became standard in the 16th century. The minute hand was added around 1680, and the second hand appeared in the 18th century.',
      uses: ['Wall clocks in homes and offices', 'Wristwatches', 'Public clocks in town squares', 'Teaching time-telling to children', 'Decorative timepieces'],
      facts: [
        'The oldest working mechanical clock is in Salisbury Cathedral, England, dating from 1386.',
        'Analog clocks move clockwise because early sundials in the Northern Hemisphere cast shadows that moved in that direction.',
        'Studies suggest that analog clock faces help people better visualize time passage and deadlines compared to digital displays.'
      ]
    },
    de: {
      history: 'Analoge Uhren gehen auf antike Sonnenuhren und Wasseruhren zurück. Die mechanische Analoguhr, wie wir sie kennen, wurde im mittelalterlichen Europa um das 14. Jahrhundert entwickelt.',
      origin: 'Das kreisförmige Zifferblatt mit 12 Stunden wurde im 16. Jahrhundert zum Standard. Der Minutenzeiger wurde um 1680 hinzugefügt, der Sekundenzeiger erschien im 18. Jahrhundert.',
      uses: ['Wanduhren in Häusern und Büros', 'Armbanduhren', 'Öffentliche Uhren auf Marktplätzen', 'Kindern die Uhrzeit beibringen', 'Dekorative Zeitmesser'],
      facts: [
        'Die älteste funktionierende mechanische Uhr befindet sich in der Kathedrale von Salisbury, England, und stammt aus dem Jahr 1386.',
        'Analoge Uhren bewegen sich im Uhrzeigersinn, weil frühe Sonnenuhren auf der Nordhalbkugel Schatten warfen, die sich in diese Richtung bewegten.',
        'Studien deuten darauf hin, dass analoge Zifferblätter Menschen helfen, den Zeitverlauf und Fristen besser zu visualisieren als digitale Anzeigen.'
      ]
    }
  },
  chess: {
    en: {
      history: 'Chess clocks were invented in 1883 by Thomas Bright Wilson of Manchester, England. The first mechanical chess clock used two separate clock faces connected by a rocking lever.',
      origin: 'Before chess clocks, games could last indefinitely. The introduction of time controls revolutionized competitive chess, making tournaments practical and exciting.',
      uses: ['Chess tournaments and competitions', 'Online chess platforms', 'Other two-player strategy games', 'Debate competitions', 'Turn-based game timing'],
      facts: [
        'The first official use of a chess clock was at the London 1883 tournament.',
        'Modern digital chess clocks can handle complex time controls including increment and delay modes.',
        'World Chess Championship matches typically use time controls of 120 minutes for 40 moves, then 60 minutes for the rest of the game, with 30-second increments.'
      ]
    },
    de: {
      history: 'Schachuhren wurden 1883 von Thomas Bright Wilson aus Manchester, England, erfunden. Die erste mechanische Schachuhr verwendete zwei separate Zifferblätter, die durch einen Kipphebel verbunden waren.',
      origin: 'Vor Schachuhren konnten Spiele unbegrenzt dauern. Die Einführung von Zeitkontrollen revolutionierte das Wettkampfschach und machte Turniere praktikabel und spannend.',
      uses: ['Schachturniere und Wettkämpfe', 'Online-Schachplattformen', 'Andere Zwei-Spieler-Strategiespiele', 'Debattenwettbewerbe', 'Rundenbasierte Spielzeitmessung'],
      facts: [
        'Die erste offizielle Verwendung einer Schachuhr war beim Londoner Turnier 1883.',
        'Moderne digitale Schachuhren können komplexe Zeitkontrollen einschließlich Inkrement- und Verzögerungsmodi handhaben.',
        'Schachweltmeisterschaftsmatches verwenden typischerweise Zeitkontrollen von 120 Minuten für 40 Züge, dann 60 Minuten für den Rest des Spiels, mit 30-Sekunden-Inkrementen.'
      ]
    }
  },
  metronome: {
    en: {
      history: 'The metronome was invented in 1815 by German inventor Johann Maelzel, though similar devices existed earlier. Maelzel\'s metronome became the standard for musical timing.',
      origin: 'Before metronomes, musicians used their pulse or pendulums to keep time. The mechanical metronome provided a reliable, adjustable tempo reference that revolutionized music practice and performance.',
      uses: ['Music practice and rehearsal', 'Teaching rhythm and timing', 'Recording studio work', 'Dance and choreography', 'Athletic training rhythm'],
      facts: [
        'Beethoven was one of the first composers to include metronome markings in his scores, starting in 1817.',
        'The traditional metronome range is 40-208 beats per minute, covering all common musical tempos.',
        'Digital metronomes can now subdivide beats and create complex polyrhythmic patterns impossible with mechanical versions.'
      ]
    },
    de: {
      history: 'Das Metronom wurde 1815 vom deutschen Erfinder Johann Maelzel erfunden, obwohl ähnliche Geräte bereits früher existierten. Maelzels Metronom wurde zum Standard für musikalisches Timing.',
      origin: 'Vor Metronomen verwendeten Musiker ihren Puls oder Pendel, um den Takt zu halten. Das mechanische Metronom bot eine zuverlässige, einstellbare Tempo-Referenz, die Musikpraxis und -aufführung revolutionierte.',
      uses: ['Musikpraxis und Probe', 'Rhythmus- und Timing-Unterricht', 'Tonstudio-Arbeit', 'Tanz und Choreographie', 'Athletisches Trainingsrhythmus'],
      facts: [
        'Beethoven war einer der ersten Komponisten, der ab 1817 Metronomangaben in seine Partituren aufnahm.',
        'Der traditionelle Metronombereich liegt bei 40-208 Schlägen pro Minute und deckt alle gängigen musikalischen Tempi ab.',
        'Digitale Metronome können jetzt Schläge unterteilen und komplexe polyrhythmische Muster erzeugen, die mit mechanischen Versionen unmöglich waren.'
      ]
    }
  },
  world: {
    en: {
      history: 'World clocks became necessary with the expansion of railways and telegraph systems in the 19th century. The concept of time zones was proposed by Sir Sandford Fleming in 1879.',
      origin: 'Before standardized time zones, each city kept its own local time based on the sun. The International Meridian Conference of 1884 established Greenwich Mean Time as the world\'s time standard.',
      uses: ['International business coordination', 'Travel planning', 'Remote team collaboration', 'Broadcasting schedules', 'Financial market tracking'],
      facts: [
        'There are 38 different time zones in use worldwide, including some that differ by 30 or 45 minutes rather than full hours.',
        'China uses a single time zone (UTC+8) despite spanning five geographical time zones.',
        'The International Date Line zigzags to avoid dividing countries, creating some unusual time zone boundaries.'
      ]
    },
    de: {
      history: 'Weltuhren wurden mit der Expansion von Eisenbahn- und Telegrafensystemen im 19. Jahrhundert notwendig. Das Konzept der Zeitzonen wurde 1879 von Sir Sandford Fleming vorgeschlagen.',
      origin: 'Vor standardisierten Zeitzonen hielt jede Stadt ihre eigene Ortszeit basierend auf der Sonne. Die Internationale Meridian-Konferenz von 1884 etablierte die Greenwich Mean Time als weltweiten Zeitstandard.',
      uses: ['Internationale Geschäftskoordination', 'Reiseplanung', 'Remote-Team-Zusammenarbeit', 'Sendezeiten', 'Finanzmärkte-Tracking'],
      facts: [
        'Es gibt weltweit 38 verschiedene Zeitzonen in Gebrauch, einschließlich einiger, die sich um 30 oder 45 Minuten statt voller Stunden unterscheiden.',
        'China verwendet eine einzige Zeitzone (UTC+8), obwohl es sich über fünf geografische Zeitzonen erstreckt.',
        'Die Internationale Datumsgrenze verläuft im Zickzack, um Länder nicht zu teilen, was einige ungewöhnliche Zeitzonengrenzen schafft.'
      ]
    }
  },
  alarm: {
    en: {
      history: 'The first mechanical alarm clock was invented by Levi Hutchins in 1787 in New Hampshire, USA. However, it could only ring at 4 AM and couldn\'t be adjusted.',
      origin: 'The first adjustable mechanical alarm clock was patented in 1847 by Antoine Redier in France. Electric alarm clocks appeared in the 1890s, and digital alarms became common in the 1970s.',
      uses: ['Waking up in the morning', 'Medication reminders', 'Meeting notifications', 'Cooking timers', 'Event reminders'],
      facts: [
        'Before alarm clocks, people hired "knocker-uppers" who would tap on windows with long poles to wake workers.',
        'The snooze button was invented in 1956 and typically adds 9 minutes because of the gear ratios in mechanical clocks.',
        'Studies show that waking to a gradual alarm or favorite music reduces sleep inertia compared to jarring alarm sounds.'
      ]
    },
    de: {
      history: 'Der erste mechanische Wecker wurde 1787 von Levi Hutchins in New Hampshire, USA, erfunden. Er konnte jedoch nur um 4 Uhr morgens klingeln und war nicht einstellbar.',
      origin: 'Der erste einstellbare mechanische Wecker wurde 1847 von Antoine Redier in Frankreich patentiert. Elektrische Wecker erschienen in den 1890er Jahren, digitale Wecker wurden in den 1970er Jahren üblich.',
      uses: ['Morgendliches Aufwachen', 'Medikamentenerinnerungen', 'Meeting-Benachrichtigungen', 'Koch-Timer', 'Ereigniserinnerungen'],
      facts: [
        'Vor Weckern stellten Menschen "Knocker-Upper" ein, die mit langen Stangen an Fenster klopften, um Arbeiter zu wecken.',
        'Die Schlummertaste wurde 1956 erfunden und fügt typischerweise 9 Minuten hinzu wegen der Übersetzungsverhältnisse in mechanischen Uhren.',
        'Studien zeigen, dass das Aufwachen mit einem graduellen Alarm oder Lieblingsmusik die Schlafträgheit im Vergleich zu schrillen Alarmtönen reduziert.'
      ]
    }
  },
  cooking: {
    en: {
      history: 'Kitchen timers evolved from hourglasses and mechanical egg timers in the early 1900s. The first spring-wound mechanical timer was patented in 1918.',
      origin: 'Digital kitchen timers became popular in the 1980s with the rise of microwave ovens. Modern smart kitchen timers can handle multiple dishes simultaneously and connect to recipe apps.',
      uses: ['Baking and roasting', 'Boiling eggs', 'Steeping tea', 'Marinating food', 'Multiple dish coordination'],
      facts: [
        'The standard egg timer runs for 3 minutes, the time needed to soft-boil an egg at sea level.',
        'Professional chefs often use multiple timers simultaneously, with some kitchens having 10+ timers running at once.',
        'The "ding" sound of kitchen timers was specifically designed to be heard over kitchen noise but not be startling.'
      ]
    },
    de: {
      history: 'Küchentimer entwickelten sich aus Sanduhren und mechanischen Eieruhren der frühen 1900er Jahre. Der erste federgetriebene mechanische Timer wurde 1918 patentiert.',
      origin: 'Digitale Küchentimer wurden in den 1980er Jahren mit dem Aufkommen von Mikrowellenherden populär. Moderne smarte Küchentimer können mehrere Gerichte gleichzeitig handhaben und sich mit Rezept-Apps verbinden.',
      uses: ['Backen und Braten', 'Eier kochen', 'Tee ziehen lassen', 'Lebensmittel marinieren', 'Koordination mehrerer Gerichte'],
      facts: [
        'Die Standard-Eieruhr läuft 3 Minuten, die Zeit, die benötigt wird, um ein Ei auf Meereshöhe weich zu kochen.',
        'Professionelle Köche verwenden oft mehrere Timer gleichzeitig, wobei einige Küchen 10+ Timer gleichzeitig laufen haben.',
        'Das "Ding"-Geräusch von Küchentimern wurde speziell entwickelt, um über Küchengeräusche hinweg gehört zu werden, aber nicht erschreckend zu sein.'
      ]
    }
  }
};

export default function TimerAbout() {
  const { lang, slug } = useRouteInfo();
  const [facts, setFacts] = React.useState<Fact[]>([]);

  React.useEffect(() => {
    (async () => {
      const source = lang === 'en' ? enModules : deModules;
      const modules = await Promise.all(Object.values(source).map(l => l()));
      let parsed = extractFacts(modules.join('\n'));
      if (!parsed.length) parsed = [{ text: lang === 'en' ? 'No facts available yet.' : 'Noch keine Fakten verfügbar.' }];
      setFacts(parsed);
    })();
  }, [lang]);

  const t = TITLES[slug] || { en: 'About Timer', de: 'Über Timer' };
  const title = lang === 'en' ? t.en : t.de;
  const content = TIMER_CONTENT[slug];
  const timerInfo = content ? (lang === 'en' ? content.en : content.de) : null;

  return (
    <div className="page" style={{ padding: '96px 16px 48px', maxWidth: '1200px', margin: '0 auto' }}>
      <HomeButton />
      <h1 className="timer-title">{title}</h1>
      
      {timerInfo && (
        <>
          <section style={{ marginBottom: '32px', color: 'var(--neutral-white)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>
              {lang === 'en' ? 'History' : 'Geschichte'}
            </h2>
            <p style={{ lineHeight: 1.7, marginBottom: '16px' }}>{timerInfo.history}</p>
            <p style={{ lineHeight: 1.7 }}>{timerInfo.origin}</p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>
              {lang === 'en' ? 'Common Uses' : 'Häufige Anwendungen'}
            </h2>
            <ul style={{ lineHeight: 1.8, paddingLeft: '24px' }}>
              {timerInfo.uses.map((use, i) => (
                <li key={i}>{use}</li>
              ))}
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>
              {lang === 'en' ? 'Three Interesting Facts' : 'Drei interessante Fakten'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {timerInfo.facts.map((fact, i) => (
                <div key={i} className="facts-frame" style={{ padding: '16px' }}>
                  <div className="facts-screen">
                    <span className="facts-prefix">{lang === 'en' ? 'Fact' : 'Fakt'} {i + 1}</span>
                    <span className="facts-text">{fact}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Fun facts removed from here - they should only appear in the home page display */}
    </div>
  );
}