import axios from 'axios'

const request = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1',
  timeout: 5000
})

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    } else if (error.response?.status === 403) {
      alert('无权访问')
    } else {
      alert('请求失败' + (error.response?.data.detail || error.meesage))
    }
    return Promise.reject(error)
  }
)

export default request
