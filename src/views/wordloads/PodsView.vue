<template>
  <el-container>
    <el-main>
      <div class="header"></div>
      <el-table :data="datas" style="width: 100%" border>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column fixed prop="name" label="名称" width="200">
          <template #default="{ row }">
            <router-link :to="`/workloads/pods/${row.namespace}/${row.name}`">
              {{ row.name }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="namespace" label="命名空间"></el-table-column>
        <el-table-column prop="ready" label="就绪"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column prop="restarts" label="重启次数"></el-table-column>
        <el-table-column prop="cpu" label="CPU"></el-table-column>
        <el-table-column prop="memory" label="Memory"></el-table-column>
        <el-table-column prop="ip" label="IP"></el-table-column>
        <el-table-column prop="node" label="节点"></el-table-column>
        <el-table-column prop="age" label="创建时间"></el-table-column>
      </el-table>
      <div v-if="datas.length === 0" class="empty-state">
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
import { computed, ref, onMounted } from 'vue'

defineOptions({
  name: 'ResourcesView'
})
import { getResources } from '@/api/resources'
// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
// 数据列表
const datas = ref([])
const total = computed(() => datas.value.length)

// 请求数据函数
const getData = async () => {
  const res = await getResources('pods')
  // 根据实际 API 返回结构调整数据路径
  datas.value = res.data.items || []
  console.log('获取到的数据:', datas.value)
}
// 监听路由参数的变化,重新获取数据
// watch(
//   [() => route.params.type, () => filterStore.currentNamespace],
//   () => {
//     filterStore.setNamespace(currentNamespace.value)
//     getData()
//   },
//   {
//     immediate: true
//   }
// )
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
  h2 {
    margin: 0;
  }
  .controls {
    width: 500px;
    height: 80px;
    display: flex;
    align-items: center;
    gap: 15px;
  }
}
</style>
