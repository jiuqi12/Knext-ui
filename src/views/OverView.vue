<script setup>
import { ref, onMounted } from 'vue'
import { getOverview } from '@/api/cluster'
import { ElMessage } from 'element-plus'

// 刷新时间相关
const refreshTime = ref('12:00:00')
// 加载状态
const isLoding = ref(false)
// 集群数据
const cluaterData = ref([])
const total_cards = ref([])
// 获取数据
const fetchData = async () => {
  try {
    isLoding.value = true
    const res = await getOverview()
    cluaterData.value = res.data || []
    refreshTime.value = res.data.refreshTime
    total_cards.value = res.data.clusterInfo
    ElMessage.success('刷新成功')
    isLoding.value = false
  } catch {
    ElMessage.error('获取数据失败')
  } finally {
    isLoding.value = false
  }
}
onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="dashboard-container">
    <!-- 集群版本 -->
    <div class="header">
      <div class="version">
        <h1>集群仪表盘</h1>
        <p>数据源: Kubernetes：v1.29</p>
        <p>更新时间：{{ refreshTime }}</p>
      </div>
      <div class="time">
        <el-button type="primary" @click="fetchData" :loading="isLoding"
          >刷新数据</el-button
        >
      </div>
    </div>
    <!-- 集群信息区域 -->
    <el-row :gutter="20">
      <!-- 集群资源统计 -->
      <el-col
        :xs="12"
        :sm="6"
        v-for="(item, index) in total_cards"
        :key="index"
      >
        <el-card shadow="hover">
          <div class="card-inner">
            <div class="info">
              <div class="lable">{{ item.title }}</div>
              <div class="value">{{ item.value }}</div>
            </div>
            <div class="icon">
              <el-icon><Box /></el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
      <!-- 集群资源使用 -->
      <!-- 集群Pod状态 -->
      <!-- 集群节点状态 -->
      <!-- 集群最近事件 -->
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-container {
  padding: 32px;
  margin: 0 auto;
  width: 100%;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    flex-wrap: wrap; /** 解决元素宽度不够时，换行显示，保证移动端显式正常 */
    gap: 16px;
    .version {
      h1 {
        font-size: 24px;
        font-weight: 700;
        margin: 0;
      }
      p {
        font-size: 14px;
        color: #6b7280;
      }
    }
  }
  // 卡片公共样式
  .el-card {
    border: none;
    border-radius: 12px;
    margin-bottom: 20px;
    .card-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 80px;
      .info {
        .label {
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .value {
          font-size: 22px;
          font-weight: 700;
        }
      }
    }
  }
  // 卡片内部样式
}
</style>
