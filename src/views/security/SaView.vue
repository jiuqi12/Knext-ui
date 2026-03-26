<template>
  <el-container>
    <el-main>
      <div class="header">
        <h2>ServiceAccount</h2>
        <div class="search-box">
          <el-input
            v-model="searchQuery"
            placeholder="搜索 ServiceAccount..."
            clearable
            @keyup.enter="handleSearch"
            @clear="handleSearch"
            style="width: 300px"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </div>
      <el-table :data="filteredData" style="width: 100%" v-loading="loading">
        <el-table-column
          fixed
          prop="name"
          label="名称"
          min-width="200"
        ></el-table-column>
        <el-table-column
          prop="namespace"
          label="命名空间"
          min-width="150"
        ></el-table-column>
        <el-table-column label="类型" width="150">
          <template #default>
            <el-tag type="info" round>ServiceAccount</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Secrets" min-width="200">
          <template v-slot="scope">
            <div v-if="scope.row.secrets && scope.row.secrets.length > 0">
              <el-tag
                v-for="(secret, index) in scope.row.secrets.slice(0, 3)"
                :key="index"
                round
                style="margin-right: 5px; margin-bottom: 5px"
                size="small"
              >
                {{ secret.name }}
              </el-tag>
              <el-tag
                v-if="scope.row.secrets.length > 3"
                type="info"
                size="small"
              >
                +{{ scope.row.secrets.length - 3 }} 更多
              </el-tag>
            </div>
            <el-tag v-else type="danger">无 Secrets</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Image Pull Secrets" min-width="200">
          <template v-slot="scope">
            <div
              v-if="
                scope.row.imagePullSecrets &&
                scope.row.imagePullSecrets.length > 0
              "
            >
              <el-tag
                v-for="(secret, index) in scope.row.imagePullSecrets.slice(
                  0,
                  3
                )"
                :key="index"
                round
                style="margin-right: 5px; margin-bottom: 5px"
                size="small"
                type="warning"
              >
                {{ secret.name }}
              </el-tag>
              <el-tag
                v-if="scope.row.imagePullSecrets.length > 3"
                type="info"
                size="small"
              >
                +{{ scope.row.imagePullSecrets.length - 3 }} 更多
              </el-tag>
            </div>
            <el-tag v-else type="info" size="small">无</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="creation_time"
          label="创建时间"
          width="200"
        ></el-table-column>
      </el-table>
      <div v-if="filteredData.length === 0 && !loading" class="empty-state">
        <el-empty description="暂无数据" />
      </div>
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next, jumper"
        prev-text="上一页"
        next-text="下一页"
        style="margin-top: 20px"
      ></el-pagination>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

defineOptions({
  name: 'SaView'
})

// 定义加载状态
const loading = ref(false)

// 定义数据
const serviceAccounts = ref([])

// 搜索关键词
const searchQuery = ref('')

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)

// 计算总数
const total = computed(() => filteredData.value.length)

// 过滤后的数据（支持搜索）
const filteredData = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) {
    return serviceAccounts.value.slice(
      (currentPage.value - 1) * pageSize.value,
      currentPage.value * pageSize.value
    )
  }

  return serviceAccounts.value
    .filter((item) => {
      const nameMatch = item.name?.toLowerCase().includes(query)
      const namespaceMatch = item.namespace?.toLowerCase().includes(query)
      const secretsMatch = item.secrets?.some((secret) =>
        secret.name?.toLowerCase().includes(query)
      )
      const pullSecretsMatch = item.imagePullSecrets?.some((secret) =>
        secret.name?.toLowerCase().includes(query)
      )
      return nameMatch || namespaceMatch || secretsMatch || pullSecretsMatch
    })
    .slice(
      (currentPage.value - 1) * pageSize.value,
      currentPage.value * pageSize.value
    )
})

// 获取 ServiceAccount 数据
const getServiceAccountData = async () => {
  try {
    loading.value = true
    // TODO: 替换为实际的 API 调用
    // const res = await getServiceAccounts()
    // serviceAccounts.value = res.data || []

    // 模拟数据
    serviceAccounts.value = [
      {
        name: 'default',
        namespace: 'default',
        secrets: [{ name: 'default-token-abc123' }],
        imagePullSecrets: [],
        creation_time: '2024-01-15T10:30:00Z'
      },
      {
        name: 'my-service-account',
        namespace: 'production',
        secrets: [
          { name: 'my-sa-token-xyz789' },
          { name: 'registry-credentials' }
        ],
        imagePullSecrets: [{ name: 'docker-registry-secret' }],
        creation_time: '2024-01-20T14:20:00Z'
      }
    ]
  } catch (error) {
    console.error('获取 ServiceAccount 数据失败:', error)
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
}

// 组件挂载后获取数据
onMounted(() => {
  getServiceAccountData()
})
</script>

<style lang="scss" scoped>
.header {
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  h2 {
    margin: 0;
    color: #343a40;
  }
  .search-box {
    display: flex;
    align-items: center;
  }
}

.empty-state {
  margin-top: 20px;
}
</style>
