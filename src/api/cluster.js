import request from '@/utils/request'

// 资源总览模块
export function getOverview() {
  return request({
    url: '/overview',
    method: 'get'
  })
}

// 节点模块
// 获取全部节点
export function getNodes() {
  return request({
    url: '/nodes',
    method: 'get'
  })
}

// 命名空间模块
// 获取全部命名空间
export function getNamespaces() {
  return request({
    url: '/namespaces',
    method: 'get'
  })
}
// 删除命名空间
export function deleteNamespace(namespace_name) {
  return request({
    url: `/namespaces/${namespace_name}`,
    method: 'delete'
  })
}

// 工作负载模块
// 容器组模块
// 获取全部Pod
export function getPods() {
  return request({
    url: '/workloads/pods',
    method: 'get'
  })
}

// deployment模块
// 获取全部deployment
export function getDeployments() {
  return request({
    url: '/workloads/deployments',
    method: 'get'
  })
}
