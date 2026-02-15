<template>
  <div class="card-container">
    <div class="card-header">
      <h2>{{ title }}</h2>
      <span class="badge">{{ badge }}</span>
    </div>
    
    <p class="card-description">
      {{ description }}
    </p>
    
    <div class="card-stats">
      <div class="stat">
        <span class="stat-value">{{ stats.views }}</span>
        <span class="stat-label">Views</span>
      </div>
      <div class="stat">
        <span class="stat-value">{{ stats.likes }}</span>
        <span class="stat-label">Likes</span>
      </div>
      <div class="stat">
        <span class="stat-value">{{ stats.shares }}</span>
        <span class="stat-label">Shares</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatsCard',
  props: {
    title: {
      type: String,
      default: 'Project Statistics'
    },
    badge: {
      type: String,
      default: 'Live'
    },
    description: {
      type: String,
      default: 'Track your project performance in real-time'
    },
    stats: {
      type: Object,
      default: () => ({
        views: '1.2k',
        likes: '342',
        shares: '89'
      })
    }
  }
}
</script>

<style scoped>
.card-container {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 24px;
  width: 350px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: #000000;
  margin: 0;
}

.badge {
  background-color: #10b981;
  color: #ffffff;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
}

.card-description {
  font-size: 14px;
  color: #666666;
  line-height: 20px;
  margin-bottom: 20px;
}

.card-stats {
  display: flex;
  gap: 24px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #000000;
}

.stat-label {
  font-size: 12px;
  color: #999999;
  margin-top: 4px;
}
</style>
