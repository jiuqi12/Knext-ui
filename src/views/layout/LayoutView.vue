<template>
  <el-container class="layout">
    <!-- 侧边栏 -->
    <el-aside class="sidebar" :width="isCollpase ? '64px' : '240px'">
      <el-scrollbar class="scrollbar">
        <el-menu
          class="menu"
          :collapse="isCollpase"
          :default-active="route.path"
          router
        >
          <!-- Logo -->
          <div class="logo">
            <h3>Knext 可视化面板</h3>
          </div>
          <!-- 总览 -->
          <el-menu-item index="/overview">
            <el-icon><Menu /></el-icon>
            <span>概览</span>
          </el-menu-item>
          <!-- 命名空间 -->
          <el-menu-item index="/workloads/namespace">
            <el-icon><location /></el-icon>
            <span>命名空间</span>
          </el-menu-item>
          <!-- 负载 -->
          <el-sub-menu index="/workloads">
            <template #title>
              <el-icon><location /></el-icon>
              <span>工作负载</span>
            </template>
            <el-menu-item index="/workloads/pods">
              <el-icon><location /></el-icon>
              <span>Pod容器组</span>
            </el-menu-item>
            <el-menu-item index="/workloads/deployments">
              <el-icon><location /></el-icon>
              <span>Deployment</span>
            </el-menu-item>
            <el-menu-item index="/workloads/statefulsets">
              <el-icon><location /></el-icon>
              <span>StatefulSet</span>
            </el-menu-item>
            <el-menu-item index="/workloads/daemonsets">
              <el-icon><location /></el-icon>
              <span>DaemonSet</span>
            </el-menu-item>
            <el-menu-item index="/workloads/jobs">
              <el-icon><location /></el-icon>
              <span>Job</span>
            </el-menu-item>
          </el-sub-menu>
          <!-- 网络 -->
          <el-sub-menu index="network">
            <template #title>
              <el-icon><location /></el-icon>
              <span>网络</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/resources/ingresses">
                <el-icon><location /></el-icon>
                <span>Ingress</span>
              </el-menu-item>
              <el-menu-item index="/resources/services">
                <el-icon><location /></el-icon>
                <span>Service</span>
              </el-menu-item>
              <el-menu-item index="/resources/gateways">
                <el-icon><location /></el-icon>
                <span>Gateway</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
          <!-- 存储 -->
          <el-sub-menu index="storage">
            <template #title>
              <el-icon><location /></el-icon>
              <span>存储</span>
            </template>
            <el-menu-item index="/resources/pv">
              <el-icon><location /></el-icon>
              <span>PersistentVolume</span>
            </el-menu-item>
            <el-menu-item index="/resources/pvc">
              <el-icon><location /></el-icon>
              <span>PersistentVolumeClaim</span>
            </el-menu-item>
            <el-menu-item index="/resources/storageclasses">
              <el-icon><location /></el-icon>
              <span>StorageClass</span>
            </el-menu-item>
          </el-sub-menu>
          <!-- 配置 -->
          <el-sub-menu index="configuration">
            <template #title>
              <el-icon><location /></el-icon>
              <span>配置</span>
            </template>
            <el-menu-item index="/resources/configmaps">
              <el-icon><location /></el-icon>
              <span>ConfigMap</span>
            </el-menu-item>
            <el-menu-item index="/resources/secrets">
              <el-icon><location /></el-icon>
              <span>Secret</span>
            </el-menu-item>
          </el-sub-menu>
          <!-- 安全 -->
          <el-sub-menu index="security">
            <template #title>
              <el-icon><location /></el-icon>
              <span>安全</span>
            </template>
            <el-menu-item index="/resources/serviceaccounts">
              <el-icon><location /></el-icon>
              <span>ServiceAccount</span>
            </el-menu-item>
            <el-menu-item index="/resources/roles">
              <el-icon><location /></el-icon>
              <span>Role</span>
            </el-menu-item>
            <el-menu-item index="/resources/rolebindings">
              <el-icon><location /></el-icon>
              <span>RoleBinding</span>
            </el-menu-item>
            <el-menu-item index="/resources/clusterroles">
              <el-icon><location /></el-icon>
              <span>ClusterRole</span>
            </el-menu-item>
            <el-menu-item index="/resources/clusterrolebindings">
              <el-icon><location /></el-icon>
              <span>ClusterRoleBinding</span>
            </el-menu-item>
          </el-sub-menu>
          <!-- 节点详情 -->
          <el-menu-item index="/resources/nodes">
            <el-icon><location /></el-icon>
            <span>节点详情</span>
          </el-menu-item>
          <!-- 用户信息 -->
          <el-menu-item index="/resources/user">
            <el-icon><location /></el-icon>
            <span>用户信息</span>
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </el-aside>
    <!-- 主内容区 -->
    <el-container class="main-container">
      <el-header class="header" height="60px">
        <div class="left">
          <!-- 折叠按钮 -->
          <el-icon
            :size="20"
            style="vertical-align: middle"
            @click="isCollpase = !isCollpase"
          >
            <Fold v-if="isCollpase" />
            <Expand v-else />
          </el-icon>
          <span class="split">|</span>
          <!-- 面包屑导航 -->
          <p class="breadcrumb">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item
                v-for="(value, index) in breadcrumbList"
                :key="index"
                >{{ value }}</el-breadcrumb-item
              >
            </el-breadcrumb>
          </p>
        </div>
        <div class="right">
          <el-icon :size="20"><Sunny /></el-icon>
          <el-dropdown>
            <span class="el-dropdown-link">
              <el-avatar
                :size="30"
                src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif"
              ></el-avatar>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="user">个人资料</el-dropdown-item>
                <el-dropdown-item command="setting">设置</el-dropdown-item>
                <el-dropdown-item divided command="logout"
                  >退出登录</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
defineOptions({
  name: 'LayoutView'
})
// 侧边栏折叠状态
import { ref, computed } from 'vue'
const isCollpase = ref(false)

// 获取路由
import { useRoute } from 'vue-router'
const route = useRoute()

// 面包屑导航
const breadcrumbList = computed(() => {
  return route.path.split('/').filter((p) => p)
})
</script>

<style lang="scss" scoped>
.layout {
  display: flex;
  height: 100vh;
  background-color: #fafafa;
  .sidebar {
    transition: width 0.3s ease;
    display: flex;
    flex-direction: column;
    margin: 5px;
    &.el-menu--collapse {
      width: 64px;
    }
    .scrollbar {
      height: 100%;
      :deep(.el-scrollbar__bar) {
        opacity: 0;
        /* 或者 display: none; */
        // display: none;
      }
      .menu {
        flex: 1;
        border-right: none;
        background-color: #fafafa;
        color: #303133;
        .logo {
          width: 100%;
          height: 60px;
          overflow: hidden;
          h3 {
            text-align: center;
            line-height: 60px;
            color: #0179d6;
          }
        }
      }
    }
  }
  .main-container {
    flex: 1;
    background-color: #fff;
    margin: 5px;
    border-radius: 5px;
    box-shadow: 5px 5px 10px #888;
    .header {
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      border-bottom: 1px solid #e4e4e7;
      .left {
        display: flex;
        align-items: center;
        .el-breadcrumb {
          opacity: 0.9;
          font-size: 16px;
        }
        .split {
          margin: 0px 10px;
        }
      }
      .right {
        display: flex;
        align-items: center;
        padding: 15px;
        gap: 20px;
        .el-dropdown-link {
          cursor: pointer;
          color: var(--el-color-primary);
        }
      }
    }
  }
}
</style>
