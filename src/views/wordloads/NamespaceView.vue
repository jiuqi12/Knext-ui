<template>
  <el-container>
    <el-main>
      <div class="header">
        <h2>Namespace</h2>
      </div>
      <el-table :data="namespaces" style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
      </el-table>
      <div v-if="namespaces.length === 0" class="empty-state">
        <el-empty description="暂无数据" />
      </div>
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next, jumper"
        prev-text="上一页"
        next-text="下一页"
      ></el-pagination>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'

defineOptions({
  name: 'ResourcesView'
})
import { getNamespaces } from '@/api/resources'

// 获取命名空间
const namespaces = ref(['All Namespaces', 'kite', 'default', 'production'])
const getNamespaceData = async () => {
  const res = await getNamespaces()
  namespaces.value = res.data.map((item) => ({ name: item })) || []
  console.log('namespaces', namespaces.value)
}
getNamespaceData()

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const total = computed(() => namespaces.value.length)
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
}
</style>
