<template>
  <div class="dashboard-container">
    <!-- 时间卡片 -->
    <el-card shadow="hover" class="time-card">
      <div class="time-info">
        <div class="time-title">当前时间</div>
        <div class="time-value">{{ currentTime }}</div>
      </div>
    </el-card>

    <!-- 概览卡片 -->
    <el-row :gutter="20" class="overview-cards">
      <el-col :span="6" v-for="card in overviewCards" :key="card.title">
        <el-card shadow="hover" class="overview-card">
          <div class="card-content">
            <el-icon
              :color="card.status === 'All ready' ? '#67C23A' : '#F56C6C'"
              class="card-icon"
            >
              <component :is="card.icon" />
            </el-icon>
            <div class="card-info">
              <div class="card-title">{{ card.title }}</div>
              <div class="card-value">{{ card.value }}</div>
              <div class="card-status">{{ card.status }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 资源和事件 -->
    <el-row :gutter="20" class="resource-events">
      <!-- CPU & Memory -->
      <el-col :span="12">
        <el-card shadow="hover" class="resource-card">
          <div class="resource-title">CPU 使用率</div>
          <el-progress
            :text-inside="true"
            :stroke-width="18"
            :percentage="cpu.usagePercent"
            :color="cpu.usagePercent > 80 ? '#F56C6C' : '#409EFF'"
          >
          </el-progress>
          <div class="resource-info">
            总计: {{ cpu.totalCores }} / 已使用: {{ cpu.usedCores }} / 百分比:
            {{ cpu.usagePercent }}%
          </div>

          <div class="resource-title">内存使用率</div>
          <el-progress
            :text-inside="true"
            :stroke-width="18"
            :percentage="memory.usagePercent"
            :color="memory.usagePercent > 70 ? '#F56C6C' : '#67C23A'"
          >
          </el-progress>
          <div class="resource-info">
            总计: {{ memory.totalBytes }} MB / 已使用: {{ memory.usedBytes }} MB
            / 百分比: {{ memory.usagePercent }}%
          </div>
        </el-card>
      </el-col>

      <!-- 最近事件 -->
      <el-col :span="12">
        <el-card shadow="hover" class="events-card">
          <div class="resource-title">最近事件</div>
          <el-empty description="No recent events" v-if="events.length === 0" />
          <el-timeline v-else>
            <el-timeline-item
              v-for="(event, index) in events"
              :key="index"
              :timestamp="event.time"
              :color="event.type === 'Warning' ? 'red' : 'green'"
            >
              {{ event.message }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getOverview } from '@/api/resources'

// 仪表盘数据
const currentTime = ref()
const overviewCards = ref([
  { title: '节点', num: 0, status: 'All ready' },
  { title: '容器组', num: 0, status: 'All ready' },
  { title: '命名空间', num: 0, status: 'All ready' },
  { title: '服务', num: 0, status: 'All ready' }
])

const cpu = ref({})
const memory = ref({})
const events = ref([])

// 获取数据
const getOverviewData = async () => {
  try {
    const res = await getOverview()
    const data = res.data

    // 填充概览数据
    currentTime.value = data.lastUpdatedTime
    overviewCards.value[0].num = data.clusterInfo.totalNodes
    overviewCards.value[0].status =
      data.clusterInfo.readyNodes === data.clusterInfo.totalNodes
        ? 'All ready'
        : 'Not ready'
    overviewCards.value[1].num = data.clusterInfo.totalPods
    overviewCards.value[2].num = data.clusterInfo.totalNamespaces
    overviewCards.value[3].num = data.clusterInfo.totalServices
    overviewCards.value[3].status = data.clusterInfo.status

    // 填充资源使用情况
    cpu.value = data.resourceUsage?.cpu
    memory.value = data.resourceUsage?.memory

    // 填充事件
    events.value = data?.recentEvents

    console.log('获取到的概览数据:', cpu.value)
  } catch (err) {
    console.error('获取集群数据失败', err)
  }
}
getOverviewData()
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.overview-cards {
  margin-bottom: 20px;
}

.overview-card {
  text-align: left;
}

.card-content {
  display: flex;
  align-items: center;
}

.card-icon {
  font-size: 36px;
  margin-right: 12px;
}

.card-info .card-title {
  font-weight: bold;
  font-size: 14px;
}

.card-info .card-value {
  font-size: 24px;
  margin: 4px 0;
}

.card-info .card-status {
  font-size: 12px;
  color: #909399;
}

.resource-events {
  margin-top: 20px;
}

.resource-card,
.events-card {
  padding: 20px;
}

.resource-title {
  font-weight: bold;
  margin-bottom: 8px;
}

.resource-info {
  margin-bottom: 16px;
  color: #606266;
  font-size: 12px;
}
</style>
