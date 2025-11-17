<template>
  <div class="market-card" :style="{ width: width + 'px' }" ref="container">
    <div class="header">
      <div class="title">Market Chart</div>
      <div class="legend">
        <button
          v-for="c in coins"
          :key="c.id"
          :class="['coin-btn', { active: c.id === active }]"
          @click="selectCoin(c.id)"
        >
          <span class="dot" :style="{ background: c.color }"></span>
          {{ c.name }}
        </button>
      </div>
    </div>

    <div class="chart-area">
      <svg
        :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
        :width="svgWidth"
        :height="svgHeight"
        @mousemove="onMouseMove"
        @mouseleave="onMouseLeave"
        @click="onClick"
      >
        <!-- background grid -->
        <g class="grid">
          <line
            v-for="(y, i) in gridY"
            :key="'gline-' + i"
            :x1="plot.left"
            :x2="plot.right"
            :y1="y"
            :y2="y"
            stroke="#eee"
            stroke-width="1"
          />
        </g>

        <!-- candlesticks -->
        <g class="candles">
          <g v-for="(d, i) in visibleData" :key="d.time">
            <!-- wick -->
            <line
              :x1="xForIndex(i)"
              :x2="xForIndex(i)"
              :y1="yForPrice(d.high)"
              :y2="yForPrice(d.low)"
              :stroke="d.close >= d.open ? upColor : downColor"
              stroke-width="2"
              stroke-linecap="round"
            />
            <!-- body -->
            <rect
              :x="xForIndex(i) - candleHalfWidth"
              :y="yForPrice(Math.max(d.open, d.close))"
              :width="candleWidth"
              :height="Math.max(1, Math.abs(yForPrice(d.open) - yForPrice(d.close)))"
              :fill="d.close >= d.open ? upFill : downFill"
              :stroke="d.close >= d.open ? upColor : downColor"
              stroke-width="1"
              rx="2"
            />
          </g>
        </g>

        <!-- right axis labels -->
        <g class="y-axis">
          <text
            v-for="(label, i) in yLabels"
            :key="'yl-' + i"
            :x="plot.right + 12"
            :y="yForPrice(label)"
            alignment-baseline="middle"
            font-size="12"
            fill="#666"
          >
            {{ formatPrice(label) }}
          </text>
        </g>

        <!-- x axis labels -->
        <g class="x-axis">
          <text
            v-for="(tick, i) in xTicks"
            :key="'xt-' + i"
            :x="xForIndex(tick.index)"
            :y="plot.bottom + 18"
            text-anchor="middle"
            font-size="11"
            fill="#888"
          >
            {{ tick.label }}
          </text>
        </g>

        <!-- hover line & tooltip anchor -->
        <g v-if="hover.index !== null" pointer-events="none">
          <line
            :x1="xForIndex(hover.index)"
            :x2="xForIndex(hover.index)"
            :y1="plot.top"
            :y2="plot.bottom"
            stroke="#3b4a6b"
            stroke-dasharray="4 4"
            stroke-opacity="0.6"
          />
          <rect
            :x="plot.right - 160"
            :y="plot.top + 12"
            width="150"
            height="78"
            rx="6"
            fill="#fff"
            stroke="#e6eaf2"
            filter="url(#tooltipShadow)"
          />
          <text :x="plot.right - 148" :y="plot.top + 32" font-size="12" fill="#222">
            Time: {{ visibleData[hover.index].time }}
          </text>
          <text :x="plot.right - 148" :y="plot.top + 50" font-size="12" fill="#222">
            O: {{ visibleData[hover.index].open }} H: {{ visibleData[hover.index].high }}
          </text>
          <text :x="plot.right - 148" :y="plot.top + 68" font-size="12" fill="#222">
            L: {{ visibleData[hover.index].low }} C: {{ visibleData[hover.index].close }}
          </text>
        </g>

        <!-- shadow filter for tooltip -->
        <defs>
          <filter id="tooltipShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#000" flood-opacity="0.08" />
          </filter>
        </defs>
      </svg>
    </div>

    <div class="info-row">
      <div class="left">
        <div class="pair">Bitcoin <span class="pair-small">BTC / IDR</span></div>
        <div class="price">{{ displayPrice }}</div>
        <div :class="['rate', priceDelta >= 0 ? 'pos' : 'neg']">{{ priceDeltaStr }}</div>
      </div>
      <div class="center">
        <div class="stat">
          <div class="label">Price</div>
          <div class="value">{{ displayPrice }}</div>
        </div>
        <div class="stat">
          <div class="label">Rate</div>
          <div class="value">{{ rateStr }}</div>
        </div>
        <div class="stat">
          <div class="label">Volume</div>
          <div class="value">{{ volumeStr }}</div>
        </div>
      </div>
      <div class="right">
        <button class="btn buy">Buy</button>
        <button class="btn sell">Sell</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// MarketChart.vue - Vue 3 + TypeScript, pure SVG candlestick chart (handwritten)
// Props: width, height, optional data
import { ref, computed, reactive, watch, onMounted } from 'vue';

type Candle = {
  time: string; // e.g. '13:00'
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

const props = defineProps<{
  width?: number;
  height?: number;
  data?: Record<string, Candle[]>; // keyed by coin id
}>();

const width = props.width ?? 960;
const height = props.height ?? 470;

// demo coins (colors can be customized)
const coins = [
  { id: 'btc', name: 'Bitcoin', color: '#8B5CF6' },
  { id: 'eth', name: 'Etherium', color: '#4F46E5' },
  { id: 'ltc', name: 'Litecoin', color: '#FB923C' },
  { id: 'xrp', name: 'Ripplecoin', color: '#A3A3A3' },
];

const active = ref(coins[0].id);

// sample data generator (if user didn't pass data)
function genSampleData(seed = 1000, points = 36): Candle[] {
  const res: Candle[] = [];
  let price = seed;
  for (let i = 0; i < points; i++) {
    const tH = Math.random() * 10 + 2;
    const tL = Math.random() * 10 + 2;
    const dir = Math.random() > 0.5 ? 1 : -1;
    const open = +(price + (Math.random() - 0.5) * 8).toFixed(2);
    const close = +(open + dir * (Math.random() * 6)).toFixed(2);
    const high = Math.max(open, close) + +(Math.random() * tH).toFixed(2);
    const low = Math.min(open, close) - +(Math.random() * tL).toFixed(2);
    const volume = Math.floor(Math.random() * 200) + 20;
    const hh = 10 + i;
    const min = 11 + (i % 12);
    res.push({
      time: `${10 + Math.floor(i / 3)}:${(i * 5) % 60}`.padStart(4, '0'),
      open,
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      close,
      volume,
    });
    price = close;
  }
  return res;
}

const defaultData: Record<string, Candle[]> = {
  btc: genSampleData(1350, 48),
  eth: genSampleData(400, 48),
  ltc: genSampleData(320, 48),
  xrp: genSampleData(280, 48),
};

// merge provided data with default
const dataMap = reactive<Record<string, Candle[]>>(props.data ?? defaultData);

// expose selection
function selectCoin(id: string) {
  active.value = id;
}

const svgWidth = width;
const svgHeight = height - 120; // keep space for info row below

// plot margins
const plot = {
  left: 48,
  right: svgWidth - 140, // leave space for y labels and tooltip
  top: 28,
  bottom: svgHeight - 36,
};

// styling colors
const upColor = '#2ecc71';
const downColor = '#ef6b6b';
const upFill = '#e8fff0';
const downFill = '#fff0f0';

// derived
const dataset = computed(() => dataMap[active.value] ?? defaultData[active.value]);

// visible range (for simplicity show full dataset)
const visibleData = computed(() => dataset.value);

// x scale helpers
const candleWidth = 10;
const candleHalfWidth = candleWidth / 2;
function xForIndex(i: number) {
  const n = visibleData.value.length;
  const w = (plot.right - plot.left) / Math.max(1, n - 1);
  return plot.left + i * w;
}

// y scale helpers
const prices = computed(() => {
  const arr = visibleData.value.flatMap((d) => [d.high, d.low, d.open, d.close]);
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  // pad a bit
  const pad = (max - min) * 0.08 || 1;
  return { min: min - pad, max: max + pad };
});
function yForPrice(p: number) {
  const range = prices.value.max - prices.value.min;
  const y = plot.top + ((prices.value.max - p) / range) * (plot.bottom - plot.top);
  return y;
}

// y labels and grid
const gridY = computed(() => {
  const lines = 5;
  const arr: number[] = [];
  for (let i = 0; i <= lines; i++) {
    const t = plot.top + ((plot.bottom - plot.top) * i) / lines;
    arr.push(t);
  }
  return arr;
});
const yLabels = computed(() => {
  const lines = 5;
  const arr: number[] = [];
  for (let i = 0; i <= lines; i++) {
    const v = prices.value.max - (i / lines) * (prices.value.max - prices.value.min);
    arr.push(Number(v.toFixed(2)));
  }
  return arr;
});

// x ticks (time labels)
const xTicks = computed(() => {
  const n = visibleData.value.length;
  const step = Math.max(1, Math.floor(n / 6));
  const ticks: { index: number; label: string }[] = [];
  for (let i = 0; i < n; i += step) {
    ticks.push({ index: i, label: visibleData.value[i].time });
  }
  // last tick if not present
  if (ticks.length === 0 && n > 0) ticks.push({ index: 0, label: visibleData.value[0].time });
  return ticks;
});

// hover interaction
const hover = reactive({ x: 0, y: 0, index: null as number | null });

function onMouseMove(e: MouseEvent) {
  const rect = (e.currentTarget as SVGElement).getBoundingClientRect();
  const x = e.clientX - rect.left;
  const n = visibleData.value.length;
  const w = (plot.right - plot.left) / Math.max(1, n - 1);
  let idx = Math.round((x - plot.left) / w);
  idx = Math.max(0, Math.min(n - 1, idx));
  hover.x = x;
  hover.y = e.clientY - rect.top;
  hover.index = idx;
}
function onMouseLeave() {
  hover.index = null;
}
function onClick() {
  // demo: could drill-down, open detail panel, etc.
  if (hover.index !== null) {
    // console.log('clicked', visibleData.value[hover.index]);
  }
}

// display summary (simple)
const latest = computed(() => {
  const arr = visibleData.value;
  return arr[arr.length - 1] ?? null;
});
const displayPrice = computed(() => (latest.value ? latest.value.close.toFixed(2) : '-'));
const prevPrice = computed(() =>
  visibleData.value.length > 1
    ? visibleData.value[visibleData.value.length - 2].close
    : (latest.value?.close ?? 0),
);
const priceDelta = computed(() => +(Number(displayPrice.value) - prevPrice.value));
const priceDeltaStr = computed(
  () => `${priceDelta.value >= 0 ? '+' : ''}${priceDelta.value.toFixed(2)}`,
);
const rateStr = computed(() => {
  if (!latest.value) return '-';
  const delta = ((latest.value.close - prevPrice.value) / prevPrice.value) * 100;
  return `${delta >= 0 ? '+' : ''}${delta.toFixed(2)}%`;
});
const volumeStr = computed(() => {
  const v = latest.value?.volume ?? 0;
  if (v > 1000) return (v / 1000).toFixed(1) + 'k';
  return String(v);
});

// tooltip formatting
function formatPrice(p: number) {
  if (Math.abs(p) >= 1000) return (p / 1000).toFixed(1) + 'k';
  return p.toFixed(2);
}

// watch prop data updates
watch(
  () => props.data,
  (nv) => {
    if (nv) {
      Object.assign(dataMap, nv);
    }
  },
  { deep: true },
);

// expose to template (for TS)
const container = ref<HTMLElement | null>(null);

onMounted(() => {
  // noop
});
</script>

<style scoped>
.market-card {
  background: linear-gradient(180deg, #ffffff 0%, #fbfbff 100%);
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 6px 24px rgba(60, 64, 71, 0.06);
  font-family: Inter, 'Helvetica Neue', Arial, sans-serif;
  color: #243248;
}

/* header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.title {
  font-weight: 700;
  color: #2f3b57;
  font-size: 16px;
}
.legend {
  display: flex;
  gap: 10px;
}
.coin-btn {
  background: #f3f5fa;
  border: none;
  padding: 8px 12px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #677489;
  font-size: 13px;
}
.coin-btn .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.coin-btn.active {
  background: #eef2ff;
  color: #1f2d5a;
  font-weight: 600;
}

/* chart area */
.chart-area {
  background: transparent;
  border-radius: 8px;
  padding: 6px 0;
}

/* info row */
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding: 12px 8px 0 8px;
}
.info-row .left {
  display: flex;
  align-items: center;
  gap: 14px;
}
.pair {
  font-weight: 700;
  color: #2d3a55;
}
.pair-small {
  display: block;
  font-size: 12px;
  color: #9aa3b3;
  font-weight: 500;
}
.price {
  font-size: 18px;
  font-weight: 700;
  color: #1f2d5a;
}
.rate {
  font-size: 13px;
  margin-left: 8px;
}
.rate.pos {
  color: #2ecc71;
}
.rate.neg {
  color: #ef6b6b;
}

.info-row .center {
  display: flex;
  gap: 70px;
  align-items: center;
}
.stat .label {
  font-size: 12px;
  color: #9aa3b3;
  text-align: center;
}
.stat .value {
  font-weight: 700;
  color: #2d3a55;
  text-align: center;
}

/* buttons */
.right {
  display: flex;
  gap: 8px;
}
.btn {
  padding: 8px 16px;
  border-radius: 18px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}
.btn.buy {
  background: #2ecc71;
  color: white;
}
.btn.sell {
  background: #ff7b8a;
  color: white;
}

/* responsive tweaks */
@media (max-width: 900px) {
  .market-card {
    width: 100%;
  }
}
</style>
