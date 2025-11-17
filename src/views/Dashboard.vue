<template>
  <div class="wrap">
    <header class="header">
      <h1 class="heading">Metrics</h1>
      <p class="sub">Overview of key business metrics — clean, focused and actionable.</p>
    </header>

    <div class="grid">
      <!-- Metric cards -->
      <article v-for="m in metrics" :key="m.id" class="card" :style="{ '--accent': m.color }">
        <div class="left">
          <svg :viewBox="ringViewBox" :width="ringSize" :height="ringSize" class="ring">
            <defs>
              <linearGradient :id="`g-${m.id}`" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" :stop-color="m.color" stop-opacity="1" />
                <stop offset="100%" stop-color="#ffffff" stop-opacity="0.18" />
              </linearGradient>
              <filter id="ring-shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="rgba(8,25,45,0.08)" />
              </filter>
            </defs>

            <g :transform="ringTranslate" filter="url(#ring-shadow)">
              <circle
                :r="ringRadius"
                fill="none"
                :stroke="trackColor"
                :stroke-width="ringThickness"
              />
              <circle
                :r="ringRadius"
                fill="none"
                :stroke="`url(#g-${m.id})`"
                :stroke-width="ringThickness"
                stroke-linecap="round"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="circumOffset(m.percent)"
                transform="rotate(-90)"
                class="ring-progress"
              />
              <text x="0" y="-2" text-anchor="middle" class="ring-val">{{ m.percent }}%</text>
            </g>
          </svg>
        </div>

        <div class="right">
          <div class="row">
            <div class="title">{{ m.title }}</div>
            <component v-if="m.icon" :is="m.icon" class="icon" />
          </div>

          <div class="amount">{{ m.amount }}</div>

          <div class="row meta">
            <div class="growth">
              <svg class="chev" viewBox="0 0 8 8">
                <path
                  d="M0 5 L4 1 L8 5"
                  fill="none"
                  stroke="#16a34a"
                  stroke-width="1.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span class="grow-text">{{ m.sub }}</span>
            </div>
            <div class="hint">{{ m.note }}</div>
          </div>
        </div>
      </article>

      <!-- Product sales (wide) -->
      <article class="card wide">
        <div class="chart-area">
          <svg viewBox="0 0 140 60" preserveAspectRatio="none" class="spark">
            <defs>
              <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#34c38f" stop-opacity="0.22" />
                <stop offset="100%" stop-color="#34c38f" stop-opacity="0" />
              </linearGradient>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <path :d="smoothPath(sparkPoints, 140, 60, 0.2)" fill="url(#sparkGrad)" stroke="none" />
            <path
              :d="smoothStroke(sparkPoints, 140, 60, 0.2)"
              fill="none"
              stroke="#10b981"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
              filter="url(#glow)"
            />
            <!-- optional circles at last point -->
            <circle
              :cx="lastPointX"
              :cy="lastPointY"
              r="3.2"
              fill="#10b981"
              stroke="#fff"
              stroke-width="1"
            />
          </svg>
        </div>

        <div class="right">
          <div class="row">
            <div class="title">Product Sales</div>
            <ShoppingBagIcon class="icon" />
          </div>
          <div class="amount">$ 14,546</div>
          <div class="row meta">
            <div class="growth">
              <svg class="chev" viewBox="0 0 8 8">
                <path
                  d="M0 5 L4 1 L8 5"
                  fill="none"
                  stroke="#16a34a"
                  stroke-width="1.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span class="grow-text">+20.12%</span>
            </div>
            <div class="hint">Month to date</div>
          </div>
        </div>
      </article>
    </div>

    <div class="grid" style="margin-top: 20px; grid-template-columns: repeat(2, 1fr)">
      <MarketChart />
      <TrendingList />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import {
  CurrencyDollarIcon,
  CreditCardIcon,
  BanknotesIcon,
  ShoppingBagIcon,
} from '@heroicons/vue/24/solid';

import MarketChart from '@/components/MarketChart/MarketChart.vue';
import TrendingList from '@/components/TrendingList/TrendingList.vue';
// ---- data ----
const metrics = [
  {
    id: 1,
    title: 'Total Income',
    percent: 80,
    amount: '$ 8,210.00',
    sub: '+3.96%',
    note: 'This week',
    color: '#ff6b9a',
    icon: CurrencyDollarIcon,
  },
  {
    id: 2,
    title: 'Total Payments',
    percent: 79,
    amount: '$ 8,210.00',
    sub: '+20.90%',
    note: 'All payments',
    color: '#9b7bff',
    icon: BanknotesIcon,
  },
  {
    id: 3,
    title: 'Balance',
    percent: 52,
    amount: '$ 192.00',
    sub: '+20.90%',
    note: 'Available',
    color: '#4aa3ff',
    icon: CreditCardIcon,
  },
];

// donut config
const ringSize = 72;
const ringThickness = 8;
const ringRadius = (ringSize - ringThickness) / 2;
const circumference = 2 * Math.PI * ringRadius;
const trackColor = '#eef6ff';
const ringViewBox = `0 0 ${ringSize} ${ringSize}`;
const ringTranslate = `translate(${ringSize / 2},${ringSize / 2})`;

const circumOffset = (pct) => {
  return circumference * (1 - pct / 100);
};

// ---- sparkline data and helpers ----
const sparkPoints = [4, 6, 5, 7, 9, 8, 10, 9, 11, 10, 12];
const lastPointX = computed(() => {
  const n = sparkPoints.length;
  return n > 1 ? ((n - 1) / (n - 1)) * 140 : 0;
});
const lastPointY = computed(() => {
  const max = Math.max(...sparkPoints);
  const min = Math.min(...sparkPoints);
  const range = max - min || 1;
  const last = sparkPoints[sparkPoints.length - 1];
  return 60 - ((last - min) / range) * 60;
});

// Build a smooth area path (closed) and stroke path (open) using simple Catmull-Rom → Bezier approximation
function getPointsScaled(points, w, h) {
  const n = points.length;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  return points.map((p, i) => {
    const x = (i / (n - 1)) * w;
    const y = h - ((p - min) / range) * h;
    return { x, y };
  });
}

// Convert to smooth cubic bezier path (open)
function smoothStroke(points, w = 140, h = 60, tension = 0.2) {
  const pts = getPointsScaled(points, w, h);
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  return d;
}

// Smooth closed area path (stroke path + vertical closure to bottom)
function smoothPath(points, w = 140, h = 60, tension = 0.2) {
  const stroke = smoothStroke(points, w, h, tension);
  if (!stroke) return '';
  // find last x (should be w) and close to bottom
  return `${stroke} L ${w},${h} L 0,${h} Z`;
}
</script>

<style scoped>
/* Base */
.wrap {
  padding: 28px;
  background: linear-gradient(180deg, #f7fbff 0%, #f9f0f0 100%);
  box-sizing: border-box;
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial;
  color: #071234;
}
.header {
  margin-bottom: 12px;
}
.heading {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}
.sub {
  margin: 6px 0 18px 0;
  color: #6b7280;
  font-size: 13px;
}

/* Grid */
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
@media (max-width: 1100px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 560px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

/* Card */
.card {
  display: flex;
  gap: 14px;
  align-items: center;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.95));
  border-radius: 12px;
  padding: 14px;
  box-shadow: 0 10px 30px rgba(12, 30, 60, 0.06);
  border: 1px solid rgba(10, 30, 60, 0.04);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
}
.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 48px rgba(12, 30, 60, 0.1);
}

/* wide card spans one column but visually larger */
.wide {
  grid-column: span 1;
  display: flex;
  align-items: center;
}

/* left ring */
.left {
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ring {
  overflow: visible;
  display: block;
}

/* ring visuals */
.ring text,
.ring .ring-val {
  font-weight: 700;
  font-size: 12px;
  fill: #071234;
}
.ring circle {
  transition:
    stroke-dashoffset 1s cubic-bezier(0.2, 0.9, 0.35, 1),
    stroke 0.4s;
}

/* value text vertically centered (slightly upward for optical balance) */
.ring-val {
  dominant-baseline: central;
}

/* right block */
.right {
  flex: 1;
  min-width: 0;
}
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}
.title {
  font-size: 13px;
  color: #6b7280;
}
.icon {
  width: 18px;
  height: 18px;
  color: var(--accent);
  opacity: 0.95;
}
.amount {
  margin-top: 8px;
  font-size: 18px;
  font-weight: 700;
  color: #071234;
}
.meta {
  margin-top: 10px;
  align-items: center;
}
.hint {
  color: #94a3b8;
  font-size: 12px;
}

/* growth chip */
.growth {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #16a34a;
  font-size: 13px;
}
.chev {
  width: 12px;
  height: 12px;
  transform: translateY(-1px);
}

/* spark / chart area */
.chart-area {
  width: 140px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.spark {
  width: 140px;
  height: 60px;
}

/* last data dot */
.spark circle {
  transition: r 0.2s ease;
}

/* small accessibility tweaks */
.card .title,
.card .hint {
  user-select: none;
}

/* polish for better contrast on small screens */
@media (max-width: 420px) {
  .amount {
    font-size: 16px;
  }
  .ring {
    width: 60px;
    height: 60px;
  }
}
</style>
