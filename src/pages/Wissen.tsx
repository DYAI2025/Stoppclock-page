import React, { useEffect, useState } from 'react';
import { HomeButton } from '../components/HomeButton';
import { TimerWorldLayout } from '../components/timer-world/TimerWorldLayout';
import { TimerWorldsIndex } from '../types/timer-worlds-types';

const Wissen = () => {
    const hash = window.location.hash;
    const timerSlug = hash.split('/')[2];
    const [worldsData, setWorldsData] = useState<TimerWorldsIndex | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/data/timer-worlds.json');
                if (!response.ok) throw new Error('Failed to load timer worlds data');
                const data = await response.json();
                setWorldsData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const renderContent = () => {
        if (loading) return <div className="loading" style={{ textAlign: 'center', padding: '100px 0' }}>Loading the world of time...</div>;
        if (error) return <div className="error" style={{ textAlign: 'center', color: 'red', padding: '100px 0' }}>Error: {error}</div>;
        if (!worldsData) return <div className="error" style={{ textAlign: 'center', padding: '100px 0' }}>No data available.</div>;

        const world = worldsData.worlds[timerSlug];
        if (!world) {
            return (
                <div style={{ textAlign: 'center', padding: '100px 20px' }}>
                    <h2 style={{ fontSize: '2rem', color: 'var(--neutral-800)' }}>A World in Preparation</h2>
                    <p style={{ fontSize: '1.25rem', color: 'var(--neutral-500)', marginTop: '16px' }}>
                        Information about the "{timerSlug}" timer is currently being gathered for our museum.
                    </p>
                    <div style={{ marginTop: '40px' }}>
                        <a href="#/" style={{ color: 'var(--primary-600)', textDecoration: 'none', fontWeight: 'bold' }}>
                            Back to Overview
                        </a>
                    </div>
                </div>
            );
        }

        return <TimerWorldLayout data={world} />;
    };

    return (
        <div className="page" style={{ padding: '48px 0', minHeight: '100vh', background: 'var(--neutral-white)' }}>
            <HomeButton />
            <div style={{ marginTop: '40px' }}>
                {renderContent()}
            </div>
        </div>
    );
};

export default Wissen;
