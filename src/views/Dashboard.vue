<template>
  <div class="stats-container">
    <!-- 第一部分：环形进度条 -->
    <div class="stat-card">
      <svg class="progress-ring" width="80" height="80">
        <circle
          class="progress-ring__circle"
          stroke="#D3C5F5"
          stroke-width="6"
          fill="transparent"
          r="36"
          cx="40"
          cy="40"
        />
        <circle
          class="progress-ring__circle"
          :style="{ strokeDasharray: circumference, strokeDashoffset: progressOffset(79) }"
          stroke="#8C74F6"
          stroke-width="6"
          fill="transparent"
          r="36"
          cx="40"
          cy="40"
        />
      </svg>
      <div class="stat-text">
        <p class="percentage">79%</p>
        <p class="label">Total Payments</p>
        <div class="growth">
          <span class="arrow">↑</span>
          <span class="growth-value">+20,90%</span>
        </div>
      </div>
    </div>

    <!-- 第二部分：收入统计 -->
    <div class="stat-card">
      <svg class="progress-ring" width="80" height="80">
        <circle
          class="progress-ring__circle"
          stroke="#E4F0FE"
          stroke-width="6"
          fill="transparent"
          r="36"
          cx="40"
          cy="40"
        />
        <circle
          class="progress-ring__circle"
          :style="{ strokeDasharray: circumference, strokeDashoffset: progressOffset(52) }"
          stroke="#5AA5F8"
          stroke-width="6"
          fill="transparent"
          r="36"
          cx="40"
          cy="40"
        />
      </svg>
      <div class="stat-text">
        <p class="percentage">$ 192,00</p>
        <div class="growth">
          <span class="arrow">↑</span>
          <span class="growth-value">+20,90%</span>
        </div>
      </div>
    </div>

    <!-- 第三部分：波浪线图表 -->
    <div class="stat-card">
      <div class="chart">
        <svg viewBox="0 0 200 80" class="wave-chart">
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#6CE5B1" stop-opacity="0.6" />
              <stop offset="100%" stop-color="#6CE5B1" stop-opacity="0" />
            </linearGradient>
          </defs>
          <path d="M0,40 Q50,20 100,40 T200,40 V80 H0 Z" fill="url(#gradient)" />
        </svg>
      </div>
      <div class="stat-text">
        <p class="label">Product Sales</p>
        <p class="percentage">$ 14,546</p>
        <div class="growth">
          <span class="arrow">↑</span>
          <span class="growth-value">+20,12%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      circumference: 2 * Math.PI * 36, // 计算圆周长
    };
  },
  methods: {
    progressOffset(percentage) {
      return this.circumference - (percentage / 100) * this.circumference;
    },
  },
};
</script>

<style scoped>
.stats-container {
  display: flex;
  gap: 20px;
  justify-content: space-around;
  padding: 20px;
  background-color: #f7faff;
}

.stat-card {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  width: 260px;
}

.progress-ring {
  margin-right: 16px;
}

.progress-ring__circle {
  transition: stroke-dashoffset 0.35s;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
}

.stat-text {
  display: flex;
  flex-direction: column;
}

.percentage {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

.label {
  font-size: 14px;
  color: #a3b4cc;
  margin: 0;
}

.growth {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #34c38f;
  margin-top: 8px;
}

.arrow {
  margin-right: 4px;
  color: #34c38f;
}

.chart {
  width: 100px;
  height: 80px;
  margin-right: 16px;
}

.wave-chart {
  width: 100%;
  height: 100%;
}
</style>
