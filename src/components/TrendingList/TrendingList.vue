<template>
  <div class="trending-card">
    <div class="card-inner">
      <h3 class="card-title">Trending</h3>

      <div class="list">
        <div class="row" v-for="item in itemsToRender" :key="item.symbol">
          <!-- left: icon + name -->
          <div class="cell left">
            <div class="icon" v-html="renderIconSvg(item)"></div>
            <div class="meta">
              <div class="name">{{ item.name }}</div>
              <div class="symbol">{{ item.symbol }}</div>
            </div>
          </div>

          <!-- center: sparkline -->
          <div class="cell spark">
            <svg class="sparkline" viewBox="0 0 100 30" preserveAspectRatio="none">
              <defs>
                <linearGradient :id="`g-${item.symbol}`" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="rgba(0,0,0,0)" />
                  <stop offset="100%" stop-color="rgba(0,0,0,0)" />
                </linearGradient>
              </defs>

              <!-- area faint fill -->
              <path
                :d="areaPath(item.spark)"
                :fill="
                  item.sparkDelta >= 0 ? 'rgba(36, 197, 131, 0.06)' : 'rgba(255, 84, 101, 0.06)'
                "
                stroke="none"
              />

              <!-- spark line -->
              <path
                :d="linePath(item.spark)"
                :stroke="item.sparkDelta >= 0 ? '#24C583' : '#FF5465'"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>

          <!-- last24h -->
          <div class="cell stat-col">
            <div class="label">last 24h</div>
            <div class="stat">
              <svg class="arrow" viewBox="0 0 10 10" v-html="arrowSvg(item.last24h >= 0)"></svg>
              <span :class="['pct', item.last24h >= 0 ? 'pos' : 'neg']">
                {{ formatPct(item.last24h) }}
              </span>
            </div>
          </div>

          <!-- alltime high -->
          <div class="cell stat-col">
            <div class="label">alltime high</div>
            <div class="stat">
              <svg class="arrow" viewBox="0 0 10 10" v-html="arrowSvg(item.alltime >= 0)"></svg>
              <span :class="['pct', item.alltime >= 0 ? 'pos' : 'neg']">
                {{ formatPct(item.alltime) }}
              </span>
            </div>
          </div>

          <!-- current -->
          <div class="cell current-col">
            <div class="label">current</div>
            <div class="price">{{ formatPrice(item.current) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type Row = {
  name: string;
  symbol: string;
  // spark array of numbers (relative values)
  spark: number[];
  // percent numbers: last24h and alltime in percent (e.g. 5.7 means +5.7%)
  last24h: number;
  alltime: number;
  // current price number
  current: number;
  // optional iconUrl - if not provided we render a default colored circle with initials
  iconUrl?: string;
  // computed delta of spark end-start for color selection
  sparkDelta?: number;
};

// --- Props / default data ---
const props = defineProps<{
  data?: Row[];
  maxRows?: number;
}>();

const defaultData: Row[] = [
  {
    name: 'Binance',
    symbol: 'BNB',
    spark: genSpark(12, 1),
    last24h: 5.7,
    alltime: 5.7,
    current: 42004.01,
  },
  {
    name: 'Helium',
    symbol: 'HNT',
    spark: genSpark(12, -1),
    last24h: -4.2,
    alltime: 10.7,
    current: 19000.89,
  },
  {
    name: 'Monero',
    symbol: 'XMR',
    spark: genSpark(12, 1),
    last24h: 1.0,
    alltime: 8.1,
    current: 7854.0,
  },
  {
    name: 'Etherium',
    symbol: 'ETH',
    spark: genSpark(12, 1),
    last24h: 3.6,
    alltime: 5.9,
    current: 33630.99,
  },
  {
    name: 'Binance',
    symbol: 'BNB',
    spark: genSpark(12, 1),
    last24h: 5.7,
    alltime: 5.7,
    current: 42004.01,
  },
];

function genSpark(n = 12, dir = 1) {
  const arr: number[] = [];
  let v = 50 + Math.random() * 20 * dir;
  for (let i = 0; i < n; i++) {
    v = v + (Math.random() - 0.5) * 6;
    arr.push(Number(v.toFixed(2)));
  }
  return arr;
}

// items to render
const itemsToRender = computed<Row[]>(() => {
  const raw = props.data ?? defaultData;
  const max = props.maxRows ?? raw.length;
  return raw.slice(0, max).map((r) => {
    const min = Math.min(...r.spark);
    const maxv = Math.max(...r.spark);
    // compute simple delta of spark end-start to choose color
    const sparkDelta = r.spark[r.spark.length - 1] - r.spark[0];
    return { ...r, sparkDelta };
  });
});

// --- layout consts ---
// let sparkline SVG scale responsively via CSS
const sparkH = 36;

// --- helpers: format ---
function formatPct(v: number) {
  const sign = v > 0 ? '+' : '';
  return `${sign}${v.toFixed(1)}%`;
}
function formatPrice(n: number) {
  // show thousands separators with comma and two decimals
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// --- arrow svg generator (up/down) ---
function arrowSvg(up = true) {
  if (up) {
    // small up arrow
    return `<path d="M5 1 L9 7 H6 L6 9 L4 9 L4 7 H1 Z" fill="#24C583"/>`;
  } else {
    // small down arrow
    return `<path d="M5 9 L1 3 H4 L4 1 L6 1 L6 3 H9 Z" fill="#FF5465"/>`;
  }
}

// --- sparkline path building ---
// We'll normalize spark array to 0..1 and map to an SVG box of width=100 height=30
function normalize(arr: number[]) {
  if (!arr || arr.length === 0) return [];
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const span = max - min || 1;
  return arr.map((v) => (v - min) / span);
}

// produce a smooth path using simple quadratic smoothing between points
function linePath(arr: number[]) {
  const n = arr.length;
  if (n === 0) return '';
  const norm = normalize(arr);
  const w = 100;
  const h = 28;
  const points: { x: number; y: number }[] = norm.map((v, i) => {
    const x = (i / (n - 1 || 1)) * w;
    const y = (1 - v) * h + 2; // +2 padding
    return { x, y };
  });
  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`;
  }
  // build smooth quadratic path
  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cx = (prev.x + curr.x) / 2;
    const cy = (prev.y + curr.y) / 2;
    d += ` Q ${prev.x.toFixed(2)} ${prev.y.toFixed(2)} ${cx.toFixed(2)} ${cy.toFixed(2)}`;
  }
  // connect last
  const last = points[points.length - 1];
  d += ` T ${last.x.toFixed(2)} ${last.y.toFixed(2)}`;
  return d;
}

// area path for faint fill under the sparkline
function areaPath(arr: number[]) {
  const lp = linePath(arr);
  if (!lp) return '';
  // convert to area by appending line to bottom and close
  // simple approach: build raw points again
  const n = arr.length;
  const norm = normalize(arr);
  const w = 100;
  const h = 28;
  const points: { x: number; y: number }[] = norm.map((v, i) => {
    const x = (i / (n - 1 || 1)) * w;
    const y = (1 - v) * h + 2;
    return { x, y };
  });
  const start = points[0];
  let d = `M ${start.x.toFixed(2)} ${(h + 2).toFixed(2)}`; // start bottom-left
  // build top curve same as line but from left to right
  d += ` L ${start.x.toFixed(2)} ${start.y.toFixed(2)}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cx = (prev.x + curr.x) / 2;
    const cy = (prev.y + curr.y) / 2;
    d += ` Q ${prev.x.toFixed(2)} ${prev.y.toFixed(2)} ${cx.toFixed(2)} ${cy.toFixed(2)}`;
  }
  const last = points[points.length - 1];
  d += ` L ${last.x.toFixed(2)} ${(h + 2).toFixed(2)} Z`;
  return d;
}

// --- small renderer for icon fallback: returns svg string ---
function renderIconSvg(item: Row) {
  if ((item as any).iconUrl) {
    const url = (item as any).iconUrl;
    // use image tag inside svg wrapper
    return `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><defs></defs><rect rx="8" width="40" height="40" fill="#fff"/><image href="${url}" width="40" height="40" clip-path="inset(0)"/></svg>`;
  }
  // fallback: colored circle with initials
  const color = pickColor(item.symbol);
  const initials = item.symbol.slice(0, 2).toUpperCase();
  return `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="18" fill="${color}"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="12" font-family="Arial" fill="#fff">${initials}</text>
  </svg>`;
}

// simple color picker by symbol hash
function pickColor(s: string) {
  const colors = ['#FDBA74', '#60A5FA', '#34D399', '#F87171', '#A78BFA', '#F472B6'];
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  const idx = Math.abs(h) % colors.length;
  return colors[idx];
}

// expose functions for template binding
// note: Vue template can call these because they are in the script scope
</script>

<style scoped>
.trending-card {
  width: 100%;
  padding: 18px;
  box-sizing: border-box;
  background: #ffffff;
  box-shadow: 0 6px 18px rgba(35, 45, 65, 0.04);
  border: 1px solid rgba(15, 23, 42, 0.03);
  border-radius: 10px;
}

/* inner white card */
.card-inner {
  margin: 0 auto;
  background: #ffffff;
  padding: 14px 16px;
}

/* title */
.card-title {
  margin: 0 0 12px 6px;
  font-size: 18px;
  color: #222831;
  font-weight: 700;
}

/* list rows */
.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px 6px;
}
  .row {
  display: grid;
  /* use minmax(0, ...) so columns can shrink on small screens and avoid overflow */
  grid-template-columns: minmax(0, 130px) 1fr minmax(0, 100px) minmax(0, 110px) minmax(0, 120px);
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 10px;
  background: transparent;
}

.row:hover {
  background: rgba(36, 197, 131, 0.03);
}

/* left cell */
.cell.left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.icon {
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  box-shadow: 0 2px 6px rgba(16, 24, 40, 0.04);
}
.meta .name {
  font-weight: 700;
  color: #1f2937;
  font-size: 14px;
}
.meta .symbol {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}

/* center the left meta block vertically relative to the icon */
.cell.left .meta {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* sparkline */
.cell.spark {
  padding-left: 6px;
  padding-right: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cell.spark .sparkline {
  width: 100%;
  height: 36px;
  display: block;
}

/* stat columns */
.cell.stat-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  text-align: center;
}
.label {
  font-size: 12px;
  color: #94a3b8;
}
.stat {
  display: flex;
  align-items: center;
  gap: 6px;
}
.pct {
  font-weight: 700;
  font-size: 13px;
}
.pct.pos {
  color: #24c583;
}
.pct.neg {
  color: #ff5465;
}

/* arrow svg sizing */
.arrow {
  width: 12px;
  height: 12px;
  flex: 0 0 12px;
}

/* current column */
.cell.current-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 8px;
}
.cell.current-col .label {
  text-align: center;
}
.price {
  font-weight: 800;
  color: #0f172a;
  font-size: 18px;
  margin-top: 0;
}

/* responsive adjustments */
@media (max-width: 900px) {
  .row {
    grid-template-columns: minmax(0, 160px) 1fr minmax(0, 90px) minmax(0, 90px) minmax(0, 100px);
  }
  .card-inner {
    padding: 12px;
  }
}

@media (max-width: 640px) {
  .card-inner {
    padding: 12px;
  }
  .row {
    grid-template-columns: 1fr;
    gap: 6px;
    align-items: flex-start;
  }
  .cell.spark,
  .cell.stat-col,
  .cell.current-col {
    width: 100%;
  }
  .cell.current-col {
    text-align: left;
  }
  .price {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  /* on very small screens hide sparkline and less important stat column to save space */
  .cell.spark {
    display: none;
  }
  /* hide the 'alltime' column (second stat-col) to keep layout compact */
  .row .cell.stat-col:nth-of-type(2) {
    display: none;
  }
  .row {
    grid-template-columns: 1fr auto; /* name + price */
    align-items: center;
  }
  .meta .name {
    font-size: 15px;
  }
}
</style>
