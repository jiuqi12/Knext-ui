import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/users/LoginView.vue')
  },
  {
    path: '/',
    name: 'layout',
    redirect: '/overview',
    component: () => import('@/views/layout/LayoutView.vue'),
    children: [
      {
        path: '/overview',
        name: 'overview',
        component: () => import('@/views/OverView.vue')
      },
      {
        path: '/namespaces',
        name: 'namespace',
        component: () => import('@/views/NamespaceView.vue'),
        props: true
      },
      {
        path: '/pods',
        name: 'pods',
        component: () => import('@/views/workloads/PodsView.vue')
      },
      {
        path: '/workloads/deployment',
        name: 'deployments',
        component: () => import('@/views/workloads/DeploymentsView.vue')
      },
      {
        path: '/workloads/statefulset',
        name: 'statefulsets',
        component: () => import('@/views/workloads/StatefulSetsView.vue')
      },
      {
        path: '/workloads/daemonset',
        name: 'daemonsets',
        component: () => import('@/views/workloads/DaemonSetsView.vue')
      },
      {
        path: '/workloads/job',
        name: 'jobs',
        component: () => import('@/views/workloads/JobsView.vue')
      },
      {
        path: '/networks/ingress',
        name: 'ingresses',
        component: () => import('@/views/networks/IngressView.vue')
      },
      {
        path: '/networks/service',
        name: 'service',
        component: () => import('@/views/networks/ServiceView.vue')
      },
      {
        path: '/networks/gateway',
        name: 'gateway',
        component: () => import('@/views/networks/GatewayView.vue')
      },
      {
        path: '/storages/pv',
        name: 'pv',
        component: () => import('@/views/storages/PvView.vue')
      },
      {
        path: '/storages/pvc',
        name: 'pvc',
        component: () => import('@/views/storages/PvcView.vue')
      },
      {
        path: '/storages/storageclass',
        name: 'storageclass',
        component: () => import('@/views/storages/StorageClassView.vue')
      },
      {
        path: '/configs/configmap',
        name: 'configmap',
        component: () => import('@/views/configs/ConfigmapView.vue')
      },
      {
        path: '/configs/secret',
        name: 'secret',
        component: () => import('@/views/configs/SecretView.vue')
      },
      {
        path: '/securities/sa',
        name: 'serviceaccount',
        component: () => import('@/views/security/SaView.vue')
      },
      {
        path: '/securities/role',
        name: 'role',
        component: () => import('@/views/security/RoleView.vue')
      },
      {
        path: '/securities/rolebinding',
        name: 'rolebinding',
        component: () => import('@/views/security/RoleBindingView.vue')
      },
      {
        path: '/securities/clusterrole',
        name: 'clusterrole',
        component: () => import('@/views/security/ClusterRoleView.vue')
      },
      {
        path: '/securities/clusterrolebinding',
        name: 'clusterrolebinding',
        component: () => import('@/views/security/ClusterRoleBindingView.vue')
      },
      {
        path: '/nodes',
        name: 'nodes',
        component: () => import('@/views/NodesView.vue')
      },
      {
        path: '/userinfo',
        name: 'user',
        component: () => import('@/views/users/UserInfoView.vue')
      },
      {
        path: '/userdetail/:username',
        name: 'users',
        component: () => import('@/views/users/UserDetail.vue')
      }
    ]
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/layout/AboutView.vue')
  },
  {
    path: '/logs/:namespace/:podName/:containerName?',
    name: 'logs',
    component: () => import('@/components/Log.vue')
  },
  {
    path: '/terminal/:namespace/:podName/:containerName?',
    name: 'terminal',
    component: () => import('@/components/Terminal.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// router.beforeEach((to, from) => {
//   if (!to.path === '/login' && !localStorage.getItem('token')) {
//     return '/login'
//   }
// })

export default router
