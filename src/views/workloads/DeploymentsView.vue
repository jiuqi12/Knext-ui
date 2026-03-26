<template>
  <el-container>
    <el-main>
      <div class="header">
        <h2>Deployment 部署</h2>
        <div class="controls">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索部署名称"
            prefix-icon="Search"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
          <el-select
            v-model="SearchNamespace"
            placeholder="选择命名空间"
            clearable
            style="width: 150px"
            @change="handleSearch"
          >
            <el-option
              v-for="ns in namespaces"
              :key="ns"
              :label="ns.name"
              :value="ns.name"
            />
          </el-select>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button type="primary" @click="handleCreate">
            <el-icon><Plus /></el-icon>
            创建部署
          </el-button>
        </div>
      </div>

      <el-table
        :data="paginateData"
        style="width: 100%"
        border
        v-loading="loading"
      >
        <el-table-column prop="name" label="名称" width="200">
          <template #default="{ row }">
            <router-link :to="`/workloads/${row.namespace}/${row.name}`">
              {{ row.name }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="namespace"
          label="命名空间"
          width="150"
        ></el-table-column>
        <el-table-column prop="replicas" label="副本数" width="120">
          <template #default="{ row }">
            {{ row.readyReplicas || 0 }}/{{ row.replicas || 0 }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="image"
          label="镜像"
          min-width="250"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="age"
          label="创建时间"
          width="180"
        ></el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleScale(row)">
              扩缩容
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

      <!-- <div v-if="deployments.length === 0" class="empty-state">
        <el-empty description="暂无数据" />
      </div> -->

      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next, jumper"
        prev-text="上一页"
        next-text="下一页"
      ></el-pagination>

      <!-- 创建/编辑对话框 -->
      <el-dialog
        v-model="dialogVisible"
        :title="isEdit ? '编辑部署' : '创建部署'"
        width="600px"
        @close="resetForm"
      >
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="100px"
        >
          <el-form-item label="部署名称" prop="name">
            <el-input v-model="formData.name" :disabled="isEdit" />
          </el-form-item>
          <el-form-item label="命名空间" prop="namespace">
            <el-select v-model="formData.namespace" :disabled="isEdit">
              <el-option
                v-for="ns in namespaces"
                :key="ns"
                :label="ns"
                :value="ns"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="镜像" prop="image">
            <el-input v-model="formData.image" placeholder="nginx:latest" />
          </el-form-item>
          <el-form-item label="副本数" prop="replicas">
            <el-input-number v-model="formData.replicas" :min="1" :max="100" />
          </el-form-item>
          <el-form-item label="端口" prop="port">
            <el-input-number v-model="formData.port" :min="1" :max="65535" />
          </el-form-item>
          <el-form-item label="CPU 限制" prop="cpuLimit">
            <el-input v-model="formData.cpuLimit" placeholder="500m" />
          </el-form-item>
          <el-form-item label="内存限制" prop="memoryLimit">
            <el-input v-model="formData.memoryLimit" placeholder="512Mi" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm" :loading="submitting">
            确定
          </el-button>
        </template>
      </el-dialog>

      <!-- 扩缩容对话框 -->
      <el-dialog v-model="scaleDialogVisible" title="扩缩容" width="400px">
        <el-form :model="scaleForm" label-width="80px">
          <el-form-item label="副本数">
            <el-input-number
              v-model="scaleForm.replicas"
              :min="1"
              :max="100"
              style="width: 100%"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="scaleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitScale" :loading="submitting">
            确定
          </el-button>
        </template>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getDeployments, getNamespaces } from '@/api/cluster'

defineOptions({
  name: 'DeploymentsView'
})

// 加载状态
const loading = ref(false)
const submitting = ref(false)

// 搜索和过滤
const searchKeyword = ref('')
const SearchNamespace = ref('')
const namespaces = ref([])

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)

// 数据列表
const datas = ref([]) // 原始数据列表
const deployments = ref([]) // 过滤后数据
const total = computed(() => paginateData.value.length) // 总条数

// 对话框状态
const dialogVisible = ref(false)
const scaleDialogVisible = ref(false)
const isEdit = ref(false)
const selectedDeployment = ref(null)

// 表单引用
const formRef = ref(null)

// 表单数据
const formData = ref({
  name: '',
  namespace: 'default',
  image: '',
  replicas: 1,
  port: 80,
  cpuLimit: '',
  memoryLimit: ''
})

// 扩缩容表单
const scaleForm = ref({
  replicas: 1
})

// 表单验证规则
const formRules = {
  name: [{ required: true, message: '请输入部署名称', trigger: 'blur' }],
  namespace: [{ required: true, message: '请选择命名空间', trigger: 'change' }],
  image: [{ required: true, message: '请输入镜像地址', trigger: 'blur' }],
  replicas: [{ required: true, message: '请输入副本数', trigger: 'blur' }]
}

// 计算分页数据，分页切片数据
const paginateData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  console.log('paginateData', deployments.value.slice(start, end))
  return deployments.value.slice(start, end)
})
// 获取状态标签类型
const getStatusType = (status) => {
  const typeMap = {
    Running: 'success',
    Pending: 'warning',
    Failed: 'danger',
    Unknown: 'info'
  }
  return typeMap[status] || 'info'
}

// 获取命名空间列表
const fetchNamespaces = async () => {
  try {
    const res = await getNamespaces()
    namespaces.value = res.data || []
  } catch {
    ElMessage.error('获取命名空间列表失败')
  }
}

// 获取部署列表
const getDeploymentData = async () => {
  loading.value = true
  try {
    const res = await getDeployments()
    datas.value = res.data?.items || []
    deployments.value = [...datas.value]
  } catch {
    ElMessage.error('获取部署列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索处理
const handleSearch = () => {
  // 重置分页
  currentPage.value = 1
  if (!searchKeyword.value.trim() && !SearchNamespace.value.trim()) {
    deployments.value = [...datas.value]
    return
  } else {
    const keywordQuery = searchKeyword.value.trim().toLowerCase()
    const namespaceQuery = SearchNamespace.value.trim().toLowerCase()

    deployments.value = datas.value.filter((item) => {
      const name =
        !keywordQuery || item.name?.toLowerCase().includes(keywordQuery)
      const namespace =
        !namespaceQuery ||
        item.namespace?.toLowerCase().includes(namespaceQuery)
      return name && namespace
    })
  }
}

// 创建部署
const handleCreate = () => {
  isEdit.value = false
  formData.value = {
    name: '',
    namespace: 'default',
    image: '',
    replicas: 1,
    port: 80,
    cpuLimit: '',
    memoryLimit: ''
  }
  dialogVisible.value = true
}

// 编辑部署
const handleEdit = (row) => {
  isEdit.value = true
  selectedDeployment.value = row
  formData.value = {
    name: row.name,
    namespace: row.namespace,
    image: row.image,
    replicas: row.replicas,
    port: row.port || 80,
    cpuLimit: row.cpuLimit || '',
    memoryLimit: row.memoryLimit || ''
  }
  dialogVisible.value = true
}

// 删除Deployment
const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除部署 ${row.name} 吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      // TODO: 调用删除 API
      // await deleteDeployment(row.name, row.namespace)
      ElMessage.success('删除成功')
      getDeploymentData()
    } catch {
      ElMessage.error('删除失败')
    }
  })
}

// 扩缩容
const handleScale = (row) => {
  selectedDeployment.value = row
  scaleForm.value.replicas = row.replicas
  scaleDialogVisible.value = true
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    submitting.value = true
    try {
      if (isEdit.value) {
        // TODO: 调用更新 API
        // await updateDeployment(formData.value.name, formData.value.namespace, formData.value)
        ElMessage.success('更新成功')
      } else {
        // TODO: 调用创建 API
        // await createDeployment(formData.value)
        ElMessage.success('创建成功')
      }
      dialogVisible.value = false
      getDeploymentData()
    } catch {
      ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
    } finally {
      submitting.value = false
    }
  })
}

// 提交扩缩容
const submitScale = async () => {
  submitting.value = true
  try {
    // TODO: 调用扩缩容 API
    // await scaleDeployment(selectedDeployment.value.name, selectedDeployment.value.namespace, scaleForm.value.replicas)
    ElMessage.success('扩缩容成功')
    scaleDialogVisible.value = false
    getDeploymentData()
  } catch {
    ElMessage.error('扩缩容失败')
  } finally {
    submitting.value = false
  }
}

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields()
  selectedDeployment.value = null
}

// 组件挂载时获取数据
onMounted(() => {
  fetchNamespaces()
  getDeploymentData()
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
  }
  .controls {
    display: flex;
    align-items: center;
    gap: 15px;
  }
}

.empty-state {
  padding: 40px 0;
}
</style>
