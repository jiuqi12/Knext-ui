import request from '@/utils/request'

// 获取全部命名空间
export function getNamespaces() {
  return request({
    url: '/resource/namespace/',
    method: 'get'
  })
}

// 获取集群概览资源
export function getOverview() {
  return request({
    url: '/resource/overview/',
    method: 'get'
  })
}

// 获取资源列表
export function getResources(resource_type) {
  return request({
    url: `/resource/workloads/${resource_type}/`,
    method: 'get'
  })
}

// 获取资源详情
export function getResourceDetail(resource_type, resource_name) {
  return request({
    url: `/resource/resources/${resource_type}/${resource_name}/`,
    method: 'get'
  })
}
