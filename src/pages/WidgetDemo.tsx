/**
 * WidgetDemo Page
 * 
 * Experimental page showcasing modern widget-style design language.
 * Features: 4 color themes, responsive grid, live timers, and interactive widgets.
 */

import React, { useState } from 'react';
import { ArrowLeft, Clock, Timer, TrendingUp, Zap, Activity, Heart, Calendar } from 'lucide-react';
import { WidgetGrid } from '../components/widget/WidgetGrid';
import { WidgetCard } from '../components/widget/WidgetCard';
import { WidgetTimer } from '../components/widget/WidgetTimer';
import { WidgetClock } from '../components/widget/WidgetClock';
import { WidgetStat } from '../components/widget/WidgetStat';
import { WidgetPill } from '../components/widget/WidgetPill';
import { ThemeSwitcher, WidgetTheme } from '../components/widget/ThemeSwitcher';
import '../styles/widget-base.css';

export default function WidgetDemo() {
  const [theme, setTheme] = useState<WidgetTheme>('arctic-blue');

  return (
    <div className="widget-canvas" data-widget-theme={theme}>
      {/* Header */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto var(--widget-space-8) auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--widget-space-6)'
        }}
      >
        {/* Back Navigation */}
        <a
          href="#/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--widget-space-2)',
            color: 'var(--widget-text-secondary)',
            textDecoration: 'none',
            fontSize: 'var(--widget-text-base)',
            fontWeight: 'var(--widget-font-medium)',
            transition: 'color var(--widget-transition-fast)',
            width: 'fit-content'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--widget-accent-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--widget-text-secondary)';
          }}
        >
          <ArrowLeft size={20} />
          Back to Timers
        </a>

        {/* Title Section */}
        <div>
          <h1
            style={{
              fontSize: 'var(--widget-text-3xl)',
              fontWeight: 'var(--widget-font-bold)',
              color: 'var(--widget-text-primary)',
              margin: '0 0 var(--widget-space-3) 0',
              lineHeight: 'var(--widget-leading-tight)'
            }}
          >
            Widget Design System
          </h1>
          <p
            style={{
              fontSize: 'var(--widget-text-lg)',
              color: 'var(--widget-text-secondary)',
              margin: '0 0 var(--widget-space-4) 0',
              lineHeight: 'var(--widget-leading-normal)'
            }}
          >
            Experimental modern UI with clean widgets, soft shadows, and four beautiful themes.
          </p>

          {/* Theme Pills */}
          <div style={{ display: 'flex', gap: 'var(--widget-space-2)', flexWrap: 'wrap' }}>
            <WidgetPill accent icon={<Zap size={14} />}>
              Modular Grid
            </WidgetPill>
            <WidgetPill accent icon={<Activity size={14} />}>
              Live Updates
            </WidgetPill>
            <WidgetPill accent icon={<Heart size={14} />}>
              4 Themes
            </WidgetPill>
          </div>
        </div>
      </div>

      {/* Widget Grid */}
      <WidgetGrid>
        {/* Large Timer Widget */}
        <WidgetTimer
          initialSeconds={300}
          label="Countdown Timer"
          span={2}
        />

        {/* Clock Widget */}
        <WidgetClock label="Current Time" />

        {/* Statistics Widgets */}
        <WidgetStat
          label="Focus Sessions"
          value="12"
          subtitle="This week"
          trend="up"
          trendValue="+3 from last week"
          icon={<Timer size={18} />}
        />

        <WidgetStat
          label="Total Time"
          value="6h 24m"
          subtitle="Today"
          progress={65}
          icon={<Clock size={18} />}
        />

        <WidgetStat
          label="Productivity"
          value="89%"
          subtitle="Average"
          trend="up"
          trendValue="+12%"
          icon={<TrendingUp size={18} />}
        />

        {/* Pomodoro Widget */}
        <WidgetCard span={2}>
          <div className="widget-flex widget-flex-col widget-gap-4">
            <div className="widget-flex widget-justify-between widget-items-center">
              <span className="widget-text-tertiary">POMODORO SESSION</span>
              <WidgetPill accent>In Progress</WidgetPill>
            </div>

            <div className="widget-flex widget-items-center widget-gap-6">
              {/* Session Indicator */}
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: 'var(--widget-radius-full)',
                  background: 'var(--widget-accent-primary-light)',
                  display: 'grid',
                  placeItems: 'center'
                }}
              >
                <div
                  style={{
                    fontSize: 'var(--widget-text-2xl)',
                    fontWeight: 'var(--widget-font-bold)',
                    color: 'var(--widget-accent-primary)'
                  }}
                >
                  3/4
                </div>
              </div>

              {/* Session Info */}
              <div className="widget-flex widget-flex-col widget-gap-2" style={{ flex: 1 }}>
                <div className="widget-text-primary" style={{ fontSize: 'var(--widget-text-xl)' }}>
                  Focus Time
                </div>
                <div className="widget-text-secondary">25:00 remaining</div>
                <div className="widget-progress-bar">
                  <div
                    className="widget-progress-bar-fill"
                    style={{ width: '40%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </WidgetCard>

        {/* Weekly Overview Widget */}
        <WidgetCard>
          <div className="widget-flex widget-flex-col widget-gap-4">
            <span className="widget-text-tertiary">WEEKLY OVERVIEW</span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--widget-space-3)' }}>
              {[
                { day: 'Mon', value: 90 },
                { day: 'Tue', value: 75 },
                { day: 'Wed', value: 100 },
                { day: 'Thu', value: 60 },
                { day: 'Fri', value: 85 },
                { day: 'Sat', value: 45 },
                { day: 'Sun', value: 30 }
              ].map((item) => (
                <div key={item.day} className="widget-flex widget-items-center widget-gap-3">
                  <span
                    style={{
                      fontSize: 'var(--widget-text-sm)',
                      fontWeight: 'var(--widget-font-medium)',
                      color: 'var(--widget-text-secondary)',
                      width: '32px'
                    }}
                  >
                    {item.day}
                  </span>
                  <div style={{ flex: 1 }} className="widget-progress-bar">
                    <div
                      className="widget-progress-bar-fill"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: 'var(--widget-text-xs)',
                      color: 'var(--widget-text-tertiary)',
                      width: '36px',
                      textAlign: 'right'
                    }}
                  >
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </WidgetCard>

        {/* Upcoming Events Widget */}
        <WidgetCard span={2}>
          <div className="widget-flex widget-flex-col widget-gap-4">
            <div className="widget-flex widget-justify-between widget-items-center">
              <span className="widget-text-tertiary">UPCOMING EVENTS</span>
              <Calendar size={18} color="var(--widget-text-tertiary)" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--widget-space-4)' }}>
              {[
                { time: '09:00', title: 'Team Standup', duration: '15 min' },
                { time: '14:00', title: 'Project Review', duration: '1 hour' },
                { time: '16:30', title: 'Client Call', duration: '30 min' }
              ].map((event, idx) => (
                <div
                  key={idx}
                  className="widget-flex widget-items-center widget-gap-4"
                  style={{
                    padding: 'var(--widget-space-4)',
                    background: 'var(--widget-accent-primary-light)',
                    borderRadius: 'var(--widget-radius-md)',
                    borderLeft: '4px solid var(--widget-accent-primary)'
                  }}
                >
                  <div
                    style={{
                      fontSize: 'var(--widget-text-base)',
                      fontWeight: 'var(--widget-font-bold)',
                      color: 'var(--widget-accent-primary)',
                      minWidth: '48px'
                    }}
                  >
                    {event.time}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 'var(--widget-text-base)',
                        fontWeight: 'var(--widget-font-semibold)',
                        color: 'var(--widget-text-primary)',
                        marginBottom: '2px'
                      }}
                    >
                      {event.title}
                    </div>
                    <div style={{ fontSize: 'var(--widget-text-xs)', color: 'var(--widget-text-tertiary)' }}>
                      {event.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </WidgetCard>

        {/* Typography Showcase */}
        <WidgetCard span={3}>
          <div className="widget-flex widget-flex-col widget-gap-6">
            <span className="widget-text-tertiary">TYPOGRAPHY HIERARCHY</span>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--widget-space-6)' }}>
              <div>
                <div className="widget-text-display">Display</div>
                <div className="widget-text-tertiary" style={{ marginTop: 'var(--widget-space-2)' }}>
                  56px / Bold / Tabular
                </div>
              </div>

              <div>
                <div className="widget-text-primary">Primary Text</div>
                <div className="widget-text-tertiary" style={{ marginTop: 'var(--widget-space-2)' }}>
                  40px / Bold / Headings
                </div>
              </div>

              <div>
                <div className="widget-text-secondary">Secondary Text</div>
                <div className="widget-text-tertiary" style={{ marginTop: 'var(--widget-space-2)' }}>
                  15px / Medium / Body
                </div>
              </div>

              <div>
                <div className="widget-text-tertiary">TERTIARY TEXT</div>
                <div className="widget-text-tertiary" style={{ marginTop: 'var(--widget-space-2)' }}>
                  11px / Regular / Labels
                </div>
              </div>
            </div>
          </div>
        </WidgetCard>
      </WidgetGrid>

      {/* Theme Switcher */}
      <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} />
    </div>
  );
}
