# SEO Monitoring Setup - Google Search Console & GA4

**Erstellt:** 31. Dezember 2025
**Status:** Ready for Implementation
**Zeitaufwand:** 1-2 Stunden

---

## Überblick

Diese Anleitung zeigt dir, wie du Google Search Console (GSC) und Google Analytics 4 (GA4) für Stoppclock einrichtest, um:

- 📊 Organischen Traffic zu monitoren
- 🔍 Keywords zu tracken
- 📈 Ranking-Entwicklung zu beobachten
- 🎯 Conversion-Metriken zu messen

---

## Teil 1: Google Search Console Setup

### Schritt 1: Property erstellen (5 Minuten)

1. **Gehe zu Google Search Console**
   ```
   https://search.google.com/search-console
   ```

2. **Klicke "Property hinzufügen"**
   - Wähle "Domain" oder "URL-Präfix"
   - Empfohlen: **Domain** (erfasst www und non-www)

3. **Domain eingeben**
   ```
   stoppclock.com
   ```

### Schritt 2: Domain verifizieren (10 Minuten)

**Methode 1: DNS-Verifizierung (Empfohlen)**

1. GSC zeigt dir einen TXT-Record:
   ```
   Name: @
   Type: TXT
   Value: google-site-verification=XYZ123ABC...
   ```

2. Gehe zu deinem DNS-Provider (z.B. Cloudflare, Namecheap)

3. Füge den TXT-Record hinzu:
   - **Host:** @ (oder leer lassen)
   - **Type:** TXT
   - **Value:** [Der Wert von GSC]
   - **TTL:** Auto oder 3600

4. Warte 5-10 Minuten

5. Klicke in GSC auf "Verifizieren"

**Methode 2: HTML-Tag (Alternative)**

1. GSC zeigt dir einen Meta-Tag:
   ```html
   <meta name="google-site-verification" content="XYZ123..." />
   ```

2. Füge ihn in `index.html` im `<head>` Bereich ein

3. Deploy die Änderung

4. Klicke "Verifizieren"

### Schritt 3: Sitemap einreichen (5 Minuten)

1. In GSC: **Sitemaps** → **Neue Sitemap hinzufügen**

2. Gebe die Sitemap-URL ein:
   ```
   https://stoppclock.com/sitemap.xml
   ```

3. Klicke "Senden"

4. **Wichtig:** Sitemap wird automatisch generiert bei jedem Build
   ```bash
   npm run build
   # Generiert dist/sitemap.xml
   ```

### Schritt 4: Indexierung anfordern (5 Minuten)

1. In GSC: **URL-Prüfung** (oben)

2. Gebe folgende URLs ein und klicke "Indexierung beantragen":
   ```
   https://stoppclock.com/
   https://stoppclock.com/#/pomodoro
   https://stoppclock.com/#/countdown
   https://stoppclock.com/#/timer-for-students
   https://stoppclock.com/#/timer-for-productivity
   https://stoppclock.com/#/timer-for-fitness
   https://stoppclock.com/#/blog/pomodoro-timer-online
   https://stoppclock.com/#/blog/pomodoro-vs-countdown
   ```

3. Google indexiert die Seiten innerhalb von 1-7 Tagen

### Schritt 5: Überwachung einrichten (5 Minuten)

1. **Leistung-Dashboard**
   - Gehe zu: **Leistung** → **Suchanfragen**
   - Hier siehst du: Klicks, Impressionen, CTR, Position

2. **Benachrichtigungen aktivieren**
   - Einstellungen → E-Mail-Benachrichtigungen aktivieren
   - Erhältst Mails bei:
     - Indexierungsproblemen
     - Manuellen Maßnahmen
     - Sicherheitsproblemen

3. **Wichtige Metriken tracken:**
   - **Klicks:** Organischer Traffic
   - **Impressionen:** Wie oft in Suchergebnissen gezeigt
   - **CTR (Click-Through-Rate):** % der Impressionen → Klicks
   - **Position:** Durchschnittliche Ranking-Position

---

## Teil 2: Google Analytics 4 (GA4) Setup

### Schritt 1: GA4-Property erstellen (10 Minuten)

1. **Gehe zu Google Analytics**
   ```
   https://analytics.google.com
   ```

2. **Erstelle ein neues Konto**
   - Klicke "Verwaltung" (unten links)
   - Klicke "Konto erstellen"
   - Kontoname: `Stoppclock`

3. **Erstelle eine Property**
   - Property-Name: `Stoppclock Web`
   - Zeitzone: `Europe/Berlin` (oder deine Region)
   - Währung: `EUR`

4. **Wähle "Web" als Plattform**

5. **Datenstream erstellen**
   - Website-URL: `https://stoppclock.com`
   - Stream-Name: `Stoppclock Main Site`
   - Enhanced Measurement: **Ein** (empfohlen)

### Schritt 2: Tracking-Code implementieren (15 Minuten)

Nach Property-Erstellung zeigt GA4 einen **Measurement ID**:
```
G-XXXXXXXXXX
```

**Option A: Direkt in index.html (Empfohlen ohne Consent)**

Wenn du KEINE Consent-Verwaltung brauchst:

```html
<!-- In public/index.html, vor </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Option B: Mit Consent-Management (Für GDPR-Compliance)**

Bereits implementiert in `src/utils/analytics.ts`:

1. Öffne `src/utils/analytics.ts`

2. Ersetze die Measurement ID:
   ```typescript
   const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Deine echte ID
   ```

3. Das Consent-System lädt GA4 nur, wenn User zustimmt

### Schritt 3: Events konfigurieren (10 Minuten)

GA4 trackt automatisch (Enhanced Measurement):
- ✅ Page Views
- ✅ Scrolls (90%)
- ✅ Outbound Clicks
- ✅ Site Search
- ✅ Video Engagement

**Custom Events hinzufügen:**

In `src/utils/analytics.ts` sind bereits definiert:
- `timer_start` - Timer gestartet
- `timer_complete` - Timer abgeschlossen
- `preset_selected` - Preset ausgewählt

Beispiel: Timer-Start tracken
```typescript
import { trackEvent } from '../utils/analytics';

const handleStartTimer = () => {
  // Timer-Logik...

  trackEvent('timer_start', {
    timer_type: 'pomodoro',
    duration_seconds: 1500 // 25 Min
  });
};
```

### Schritt 4: Conversions definieren (5 Minuten)

1. In GA4: **Konfigurieren** → **Ereignisse**

2. Markiere folgende Events als **Conversions**:
   - `timer_complete` (User hat Timer abgeschlossen)
   - `preset_selected` (User hat Preset gewählt)
   - `pin_timer` (User hat Timer angepinnt - falls implementiert)

3. Conversions erscheinen im Reporting

### Schritt 5: Berichte erstellen (10 Minuten)

1. **Standard-Berichte nutzen**
   - **Echtzeit:** Live-Traffic
   - **Nutzer:** Demografien, Technologie
   - **Akquisition:** Traffic-Quellen
   - **Engagement:** Seiten, Events

2. **Custom Report: Blog-Traffic**
   - Gehe zu **Erkunden** → **Leere Vorlage**
   - Name: "Blog-Artikel Traffic"
   - Dimensionen: Seitenpfad (Page path)
   - Filter: Seitenpfad **enthält** `/blog/`
   - Messwerte: Sitzungen, Nutzer, Engagement-Rate

3. **Custom Report: Timer-Nutzung**
   - Name: "Timer Usage Dashboard"
   - Dimensionen: Ereignisname (Event name)
   - Filter: Ereignisname **enthält** `timer_`
   - Messwerte: Ereignisanzahl, Nutzer

---

## Teil 3: Rank Tracking Setup (Optional)

### Kostenlose Tools

**1. Google Search Console (Integriert)**
- Vorteil: Kostenlos, offiziell von Google
- Nachteil: Nur Durchschnittswerte, keine täglichen Updates

**2. Ahrefs Webmaster Tools (Kostenlos)**

1. Gehe zu: https://ahrefs.com/webmaster-tools

2. Registriere dich kostenlos

3. Füge Property hinzu:
   ```
   https://stoppclock.com
   ```

4. Verifiziere via HTML-Tag oder DNS

5. Features:
   - Site Audit (technische SEO-Checks)
   - Backlink-Monitoring
   - Keyword-Ranking (begrenzt)

**3. Ubersuggest (Neil Patel) - Limitiert kostenlos**

1. https://neilpatel.com/ubersuggest/

2. Füge Domain hinzu

3. Tracke bis zu 25 Keywords kostenlos

**4. Google Sheets + Manual Tracking**

Template erstellen:
```
Keyword               | Woche 1 | Woche 2 | Woche 3 | Trend
pomodoro timer online | Position 50 | Position 42 | Position 35 | ↑
countdown timer       | Position 30 | Position 28 | Position 25 | ↑
timer für studenten   | Position 60 | Position 55 | Position 48 | ↑
```

Wöchentlich manuell in Google Incognito suchen und Position notieren.

---

## Teil 4: Wöchentliche Monitoring-Routine

### Jeden Montag (15 Minuten):

**Google Search Console:**
1. **Leistung** prüfen:
   - Klicks vs. letzte Woche
   - Top 10 Keywords
   - Neue Keywords (Position 11-30)

2. **Abdeckung** prüfen:
   - Fehler beheben
   - Ausgeschlossen → Warum?

3. **Sitemaps** Status:
   - Alle URLs indexiert?

**Google Analytics 4:**
1. **Echtzeit** prüfen:
   - Aktive Nutzer gerade online?

2. **Letzte 7 Tage** analysieren:
   - Sitzungen vs. Vorwoche
   - Top 5 Seiten
   - Traffic-Quellen (Organic, Direct, Social)

3. **Events** prüfen:
   - `timer_start` Count
   - `timer_complete` Count
   - Conversion-Rate (Complete / Start)

### Jeden Monat (30 Minuten):

1. **Keyword-Performance-Report**
   - GSC: Export Top 20 Keywords als CSV
   - Vergleich zu Vormonat
   - Welche Keywords steigen?

2. **Content-Performance**
   - GA4: Welche Blog-Artikel performen am besten?
   - Welche Landing Pages konvertieren?

3. **Technical SEO Check**
   - GSC: Core Web Vitals OK?
   - Mobile Usability Probleme?

4. **Backlink-Check (Ahrefs)**
   - Neue Backlinks?
   - Verlorene Backlinks?

---

## Erwartete Metriken (Nach 8 Wochen)

### Google Search Console:

| Metrik | Woche 1-2 | Woche 3-4 | Woche 5-6 | Woche 7-8 |
|--------|-----------|-----------|-----------|-----------|
| **Impressionen** | 100-500 | 500-1,500 | 1,500-5,000 | 5,000-15,000 |
| **Klicks** | 5-20 | 20-80 | 80-250 | 250-780 |
| **CTR** | 2-5% | 3-6% | 4-7% | 5-8% |
| **Position (Durchschn.)** | 50-80 | 30-50 | 20-35 | 10-25 |

### Google Analytics 4:

| Metrik | Woche 1-2 | Woche 3-4 | Woche 5-6 | Woche 7-8 |
|--------|-----------|-----------|-----------|-----------|
| **Sitzungen** | 20-100 | 100-300 | 300-800 | 800-2,000 |
| **Nutzer** | 15-80 | 80-250 | 250-650 | 650-1,500 |
| **Engagement-Rate** | 40-60% | 50-65% | 55-70% | 60-75% |
| **Ø Sitzungsdauer** | 1-2 min | 2-3 min | 2-4 min | 3-5 min |

### Conversions:

- **timer_start:** 50-200 Events/Woche → 200-800/Woche
- **timer_complete:** 30-120 Events/Woche → 120-500/Woche
- **Conversion Rate:** 40-60% (complete/start)

---

## Troubleshooting

### Problem: Keine Daten in GSC nach 7 Tagen

**Lösung:**
1. Verifizierung korrekt? (Check in GSC Settings)
2. Sitemap eingereicht?
3. Robots.txt blockiert Google? (Check: `/robots.txt`)
4. Indexierung angefordert?

### Problem: GA4 zeigt 0 Sitzungen

**Lösung:**
1. **Ad Blocker:** Teste in Incognito ohne Extensions
2. **Tracking-Code:** View Source → Suche nach `G-XXXXXXXXXX`
3. **Consent:** Hast du Tracking erlaubt? (Cookie-Banner)
4. **Realtime-Test:** GA4 → Echtzeit → Selbst Seite besuchen

### Problem: Hohe Impressionen, niedrige Klicks

**Lösung:**
- **CTR zu niedrig:** Verbessere Title & Meta Description
- **Ranking zu niedrig:** Position 50+ → Niemand klickt
- **Falsche Keywords:** Impressionen für irrelevante Begriffe

---

## Checkliste: Setup Complete

- [ ] **GSC:** Property erstellt
- [ ] **GSC:** Domain verifiziert (DNS oder HTML)
- [ ] **GSC:** Sitemap eingereicht (`/sitemap.xml`)
- [ ] **GSC:** 7+ URLs zur Indexierung beantragt
- [ ] **GSC:** E-Mail-Benachrichtigungen aktiviert
- [ ] **GA4:** Property erstellt (G-XXXXXXXXXX)
- [ ] **GA4:** Tracking-Code implementiert
- [ ] **GA4:** Enhanced Measurement aktiviert
- [ ] **GA4:** Custom Events definiert (timer_start, etc.)
- [ ] **GA4:** Conversions markiert
- [ ] **GA4:** Custom Reports erstellt (Blog, Timer)
- [ ] **Rank Tracking:** Tool gewählt (Ahrefs/Ubersuggest/Manual)
- [ ] **Rank Tracking:** Top 20 Keywords hinzugefügt
- [ ] **Routine:** Wöchentliche Checks im Kalender

---

## Nächste Schritte

1. ✅ **Jetzt:** GSC & GA4 einrichten (1-2h)
2. ⏳ **Woche 1:** Erste Daten sammeln
3. ⏳ **Woche 2:** Ersten Report erstellen
4. ⏳ **Woche 4:** Keywords optimieren basierend auf Daten
5. ⏳ **Woche 8:** Vollständiger Performance-Review

---

**Fragen?** Check:
- Google Search Console Help: https://support.google.com/webmasters
- GA4 Documentation: https://support.google.com/analytics

**Erstellt von:** Claude Code
**Für:** Stoppclock SEO Monitoring Phase 2.5
