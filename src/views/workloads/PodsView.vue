<template>
  <el-container>
    <el-main>
      <!-- 头部操作区 -->
      <div class="header">
        <h2>Pods 管理</h2>
        <div class="controls">
          <el-input
            v-model="searchQuery"
            placeholder="搜索 Pod 名称或命名空间"
            clearable
            prefix-icon="Search"
            style="width: 300px"
            @clear="handleSearch"
            @keyup.enter="handleSearch"
          />
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button type="success" @click="handleCreate">创建 Pod</el-button>
        </div>
      </div>

      <!-- 表格列表 -->
      <el-table
        :data="paginatedData"
        style="width: 100%"
        border
        v-loading="loading"
        element-loading-text="加载中..."
      >
        <el-table-column fixed prop="name" label="名称" width="200">
          <template #default="{ row }">
            <router-link :to="`/workloads/${row.name}`">
              {{ row.name }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="namespace"
          label="命名空间"
          width="120"
        ></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="restart_count"
          label="重启次数"
          width="100"
        ></el-table-column>
        <el-table-column label="标签" width="260">
          <template #default="{ row }">
            <div v-if="row.labels !== null">
              <el-tag
                v-for="(value, key) in row.labels"
                :key="key"
                style="margin-right: 5px; margin-bottom: 5px"
              >
                {{ key }}={{ value }}
              </el-tag>
            </div>
            <div v-else>无标签</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="pod_ip"
          label="Pod_IP"
          width="130"
        ></el-table-column>
        <el-table-column
          prop="node_name"
          label="节点"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="images[0]"
          label="镜像"
          width="300"
        ></el-table-column>
        <el-table-column
          prop="creation_time"
          label="创建时间"
          width="120"
        ></el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleInfo(row)">
              查看详情
            </el-button>
            <el-button link type="primary" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button link type="danger" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 空状态 -->
      <div v-if="!loading && filteredData.length === 0" class="empty-state">
        <el-empty description="暂无数据" />
      </div>

      <!-- 分页 -->
      <el-pagination
        class="custom-pagination"
        v-model:current-page.sync="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next, jumper"
        :prev-text="'上一页'"
        :next-text="'下一页'"
        @current-change="handlePageChange"
        style="margin-top: 20px; justify-content: flex-end"
      />

      <!-- 创建/编辑对话框 -->
      <el-dialog
        v-model="dialogVisible"
        :title="isEdit ? '编辑 Pod' : '创建 Pod'"
        width="600px"
        @close="handleDialogClose"
      >
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="100px"
        >
          <el-form-item label="Pod 名称" prop="name">
            <el-input v-model="formData.name" :disabled="isEdit" />
          </el-form-item>
          <el-form-item label="命名空间" prop="namespace">
            <el-input v-model="formData.namespace" :disabled="isEdit" />
          </el-form-item>
          <el-form-item label="镜像" prop="image">
            <el-input
              v-model="formData.image"
              placeholder="例如：nginx:latest"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            确定
          </el-button>
        </template>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script setup>
import { computed, ref, reactive, onMounted } from 'vue'
import {
  getPods
  // createResource,
  // updateResource,
  // deleteResource
} from '@/api/cluster'
import router from '@/router'

defineOptions({
  name: 'PodsView'
})

// 搜索参数
const searchQuery = ref('')

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)

// 数据状态
const loading = ref(false)
const datas = ref([])
const filteredData = ref([])

// 对话框相关
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const formRef = ref(null)

// 表单数据
const formData = reactive({
  name: '',
  namespace: 'default',
  image: '',
  replicas: 1
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入 Pod 名称', trigger: 'blur' },
    { min: 1, max: 63, message: '长度在 1 到 63 个字符', trigger: 'blur' }
  ],
  namespace: [{ required: true, message: '请输入命名空间', trigger: 'blur' }],
  image: [{ required: true, message: '请输入镜像地址', trigger: 'blur' }]
}

// 计算总数
const total = computed(() => filteredData.value.length)

// 计算分页数据
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredData.value.slice(start, end)
})

// 获取状态标签类型
const getStatusType = (status) => {
  const statusMap = {
    Running: 'success',
    Pending: 'warning',
    Failed: 'danger',
    Succeeded: 'info',
    Unknown: ''
  }
  return statusMap[status] || ''
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  if (!searchQuery.value.trim()) {
    filteredData.value = [...datas.value]
  } else {
    const query = searchQuery.value.toLowerCase()
    filteredData.value = datas.value.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.namespace.toLowerCase().includes(query)
    )
  }
}

// 分页变化处理
const handlePageChange = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 创建 Pod
const handleCreate = () => {
  isEdit.value = false
  dialogVisible.value = true
}

// 编辑 Pod
const handleEdit = (row) => {
  isEdit.value = true
  formData.name = row.name
  formData.namespace = row.namespace
  formData.image = row.image || ''
  formData.replicas = row.replicas || 1
  dialogVisible.value = true
}

// 查看 Pod 详情
const handleInfo = (row) => {
  router.push(`/workloads/${row.namespace}/${row.name}`)
}

// 删除 Pod
const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除 Pod "${row.name}" 吗？`, '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        // await deleteResource('pods', row.namespace, row.name)
        ElMessage.success('删除成功')
        await getData()
      } catch (error) {
        console.error('删除失败:', error)
        ElMessage.error('删除失败')
      }
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitting.value = true
    try {
      if (isEdit.value) {
        // await updateResource(
        //   'pods',
        //   formData.namespace,
        //   formData.name,
        //   formData
        // )
        ElMessage.success('更新成功')
      } else {
        // await createResource('pods', formData)
        ElMessage.success('创建成功')
      }
      dialogVisible.value = false
      await getData()
    } catch (error) {
      console.error('操作失败:', error)
      ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
    } finally {
      submitting.value = false
    }
  })
}

// 关闭对话框
const handleDialogClose = () => {
  formRef.value?.resetFields()
  formData.name = ''
  formData.namespace = 'default'
  formData.image = ''
  formData.replicas = 1
}

// 请求数据函数
const getData = async () => {
  loading.value = true
  try {
    const res = await getPods()
    // 根据实际 API 返回结构调整数据路径
    datas.value = res?.data || []
    filteredData.value = [...datas.value]
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败')
    datas.value = []
    filteredData.value = []
  } finally {
    loading.value = false
  }
}

// 组件挂载时获取数据
onMounted(() => {
  getData()
})
</script>

<style lang="scss" scoped>
.header {
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    font-size: 20px;
    color: #303133;
  }

  .controls {
    display: flex;
    align-items: center;
    gap: 15px;
  }
}

.empty-state {
  margin-top: 40px;
}

:deep(.el-pagination) {
  display: flex;
  justify-content: flex-end;
}
</style>
