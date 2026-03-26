<template>
  <div class="user-info-container">
    <!-- 添加用户按钮 -->
    <div class="add-user">
      <el-button
        class="add-user-button"
        type="primary"
        @click="dialogVisible = true"
        >创建用户</el-button
      >
    </div>
    <!-- 用户信息卡片 -->
    <el-card class="user-info-card">
      <template #header>
        <div class="card-header">
          <span>用户信息</span>
        </div>
      </template>
      <el-table
        :data="datas"
        @row-click="handleRowClick"
        :row-class-name="getRowClassName"
        width="100%"
        header-align="center"
      >
        <el-table-column
          prop="username"
          label="用户名"
          fixed
          width="120px"
          class="user-info-table"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="员工姓名"
          width="120px"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="200px"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="isAdmin"
          label="特权"
          width="120px"
          align="center"
        >
          <template #default="scope">
            <el-tag v-if="scope.row.isAdmin" type="primary">管理员</el-tag>
            <el-tag v-else type="info">普通用户</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="last_login_time"
          label="最近登录时间"
          width="200px"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="creation_time"
          label="创建事件"
          width="140px"
          align="center"
        ></el-table-column>
        <el-table-column width="300" label="操作" fixed="right" align="center">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleEdit(scope.row)"
            >
              {{ scope.row.status === 0 ? '解禁' : '禁用' }}
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="handleUpdateInfo(scope.row)"
              >修改密码</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="handleDeleteUser(scope.row)"
              >删除用户</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加用户表单 -->
    <el-dialog
      v-model="dialogVisible"
      title="添加用户"
      label-width="140"
      class="user-add-dialog"
      center
    >
      <el-form :model="createUserForm">
        <el-form-item label="用户名">
          <el-input v-model="createUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="员工姓名">
          <el-input v-model="createUserForm.name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="createUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="createUserForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input
            v-model="createUserForm.confirmPassword"
            type="password"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="dialogVisible = false">
            Confirm
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
const router = useRouter()

// 用户信息
const datas = ref([
  {
    username: 'admin',
    name: '张三',
    email: 'admin@example.com',
    status: 1, // 1: 正常，0: 禁用
    isAdmin: true, // 是否管理员
    last_login_time: '2024-01-15 10:30:00',
    creation_time: '2023-06-01 09:00:00'
  },
  {
    username: 'user1',
    name: '李四',
    email: 'user1@example.com',
    status: 0, // 1: 正常，0: 禁用
    isAdmin: false, // 是否管理员
    last_login_time: '2024-01-15 10:30:00',
    creation_time: '2023-06-01 09:00:00'
  }
])

// dialog状态
const dialogVisible = ref(false)

const handleRowClick = (row) => {
  if (row.status !== 0) {
    router.push('/userdetail/' + row.username)
  } else {
    ElMessage.error('用户已禁用')
  }
}
// 为不同状态的行添加不同的状态
const getRowClassName = (row) => {
  return row.status !== 0 ? 'active-row' : 'inactive-row'
}

// 创建用户表单
const createUserForm = ref({
  username: '',
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// const createUserFormRef = ref(null)
// const createUserDialogVisible = ref(false)

// // 方法占位符
// const handleUpdateInfo = () => {
//   // TODO: 实现更新用户信息
// }

// const handleReset = () => {
//   // TODO: 实现重置表单
// }

// const handleChangePassword = () => {
//   // TODO: 实现修改密码
// }

// const handleCreateUser = () => {
//   // TODO: 实现打开创建用户对话框
// }

// const handleToggleUserStatus = () => {
//   // TODO: 实现切换用户状态
// }

// const handleConfirmCreateUser = () => {
//   // TODO: 实现确认创建用户
// }

// 获取用户状态来实现不同路由
</script>

<style lang="scss" scoped>
.user-info-container {
  margin: 10px 10px;
  padding: 20px;
  .add-user {
    margin-bottom: 20px;
    text-align: right;
  }

  .user-info-card {
    width: 100%;

    .user-info-table {
      width: 100%;
      text-align: center;
    }
  }
  .user-add-dialog {
    padding: 15px;
  }
}

// 禁用状态样式
.active-row {
  cursor: pointer;
}
.inactive-row {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
