<template>
  <div class="user-info-container">
    <!-- 用户信息卡片 -->
    <el-card class="user-info-card">
      <template #header>
        <div class="card-header">
          <span>用户信息</span>
        </div>
      </template>
      <el-form :model="userInfo" label-width="100px" size="large">
        <el-form-item label="用户名">
          <el-input v-model="userInfo.username" disabled />
        </el-form-item>

        <el-form-item label="姓名">
          <el-input v-model="userInfo.name" placeholder="请输入姓名" />
        </el-form-item>

        <el-form-item label="邮箱">
          <el-input v-model="userInfo.email" placeholder="请输入邮箱" />
        </el-form-item>

        <el-form-item label="状态">
          <el-tag :type="userInfo.status === 1 ? 'success' : 'danger'">
            {{ userInfo.status === 1 ? '正常' : '禁用' }}
          </el-tag>
        </el-form-item>

        <el-form-item label="最后登录">
          <span>{{ userInfo.last_login_time }}</span>
        </el-form-item>

        <el-form-item label="创建时间">
          <span>{{ userInfo.creation_time }}</span>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleUpdateInfo"
            >保存修改</el-button
          >
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 修改密码卡片 -->
    <el-card class="password-card">
      <template #header>
        <div class="card-header">
          <span>修改密码</span>
        </div>
      </template>

      <el-form
        :model="passwordForm"
        label-width="100px"
        size="large"
        ref="passwordFormRef"
      >
        <el-form-item label="当前密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            show-password
            placeholder="请输入当前密码"
          />
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            show-password
            placeholder="6-12 位字母 + 数字组合"
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            show-password
            placeholder="请再次输入新密码"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleChangePassword"
            >确认修改</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 用户信息
const userInfo = ref({
  username: 'admin',
  name: '管理员',
  email: 'admin@example.com',
  status: 1, // 1: 正常，0: 禁用
  isAdmin: true, // 是否管理员
  last_login_time: '2024-01-15 10:30:00',
  creation_time: '2023-06-01 09:00:00'
})

// 密码修改表单
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordFormRef = ref(null)

// 方法占位符
const handleUpdateInfo = () => {
  // TODO: 实现更新用户信息
}

const handleReset = () => {
  // TODO: 实现重置表单
}

const handleChangePassword = () => {
  // TODO: 实现修改密码
}
</script>

<style lang="scss" scoped>
.user-info-container {
  max-width: 1200px;
  margin: 10px 10px;
  padding: 20px;

  .user-info-card,
  .password-card,
  .admin-card {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: bold;
      font-size: 16px;
    }
  }

  .admin-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
}
</style>
