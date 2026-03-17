import { AdUnit } from '../components/AdUnit';
import { getAdUnit } from '../config/ad-units';
import { AdSlot } from '../components/ads/AdSlot'; // Import AdSlot

interface World {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  heroStory: string;
}

interface TimerWorldsData {
  version: number;
  generatedAt: string;
  worlds: Record<string, World>;
}

export default function TimerWorldsIndex() {
  const [data, setData] = useState<TimerWorldsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/timer-worlds.json')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Failed to load worlds:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page p-8 text-center">Loading Worlds...</div>;
  if (!data) return <div className="page p-8 text-center">Failed to load Timer Worlds.</div>;

  const worldsList = Object.values(data.worlds);

  return (
    <div className="timer-worlds-page">
      <header className="timer-worlds-header">
        <HomeButton />
        <h1>Timer Worlds</h1>
        <p className="subtitle">Discover the philosophy behind time.</p>
      </header>

      {/* AdSlot: Top */}
      <div className="ad-container-top">
        <AdSlot placement="hori2" />
      </div>

      <div className="worlds-grid">
        {worldsList.map(world => (
          <a key={world.id} href={`#/wissen/${world.slug}`} className="world-card">
            <div className="world-card-content">
              <h2>{world.name}</h2>
              <p>{world.tagline}</p>
              <span className="read-more">Enter World →</span>
            </div>
          </a>
        ))}
      </div>
      
      {/* Fallback/Empty State if needed, but we have data */}
      {worldsList.length === 0 && (
         <div className="empty-state">
            <p>No worlds discovered yet.</p>
         </div>
      )}

      {/* Fun Facts Section */}
      <section className="facts-section">
        <header className="facts-header">
          <h2>Did You Know?</h2>
          <p>Curiosities from the world of timekeeping.</p>
        </header>

        <div className="facts-grid">
          {worldsList.flatMap(world => 
            // @ts-ignore - didYouKnow might be implicit in JSON but not in interface yet
            (world.didYouKnow || []).map((fact: any, i: number) => (
              <div key={`${world.id}-fact-${i}`} className="fact-card">
                <h3>{fact.title}</h3>
                <p>{fact.text}</p>
                {fact.source && <span className="fact-source">Source: {fact.source}</span>}
              </div>
            ))
          ).slice(0, 6) /* Limit to 6 facts for now */}
        </div>
      </section>

      {/* AdSlot: Bottom */}
      <div className="ad-container-bottom">
        <AdSlot placement="hori2" />
      </div>
    </div>
  );
}
