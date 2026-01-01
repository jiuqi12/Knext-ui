import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/LoginView.vue')
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
        component: () => import('@/views/layout/OverView.vue')
      },
      {
        path: '/about',
        name: 'about',
        component: () => import('@/views/layout/AboutView.vue')
      },
      {
        path: '/workloads/namespace',
        name: 'namespace',
        component: () => import('@/views/wordloads/NamespaceView.vue'),
        props: true
      },
      {
        path: '/workloads/pods',
        name: 'pods',
        component: () => import('@/views/wordloads/PodsView.vue')
      },
      {
        path: '/workloads/:type/:namespace/:name',
        name: 'resource',
        component: () => import('@/views/wordloads/ResourceDetailView.vue'),
        props: true
      }
    ]
  },
  {
    path: '/logs',
    name: 'logs',
    component: () => import('@/views/ws/LogView.vue')
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
