<template>
  <div class="table-container">
    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column prop="name" label="名称" min-width="150" />
      <el-table-column prop="namespace" label="命名空间" min-width="120" />
      <el-table-column prop="type" label="类型" width="120">
        <template #default="{ row }">
          <el-tag :type="getTypeTag(row.type)">{{ row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="cluster_ip" label="集群 IP" min-width="140" />
      <el-table-column prop="external_name" label="外部名称" min-width="150" />
      <el-table-column prop="ports" label="端口映射" min-width="200">
        <template #default="{ row }">
          <span v-for="(port, index) in row.ports" :key="index">
            {{ port }}<br v-if="index < row.ports.length - 1" />
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="selector" label="选择器" min-width="180">
        <template #default="{ row }">
          <span v-for="(value, key, index) in row.selector" :key="key">
            {{ key }}: {{ value }}<span v-if="index < Object.keys(row.selector).length - 1">, </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="creation_time" label="创建时间" min-width="160" />
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tableData = ref([])

const getTypeTag = (type) => {
  const typeMap = {
    ClusterIP: 'info',
    NodePort: 'warning',
    LoadBalancer: 'success',
    ExternalName: 'danger'
  }
  return typeMap[type] || 'info'
}

// TODO: 填充数据获取方法
</script>

<style lang="scss" scoped>
.table-container {
  padding: 20px;
}
</style>
