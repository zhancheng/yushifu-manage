import axios, { type AxiosInstance } from 'axios'

export const useApi = () => {
  const config = useRuntimeConfig()
  
  const api: AxiosInstance = axios.create({
    baseURL: config.public.apiBase,
    timeout: 10000,
  })
  
  // 请求拦截器 - 每次请求时重新获取 adminStore
  api.interceptors.request.use((config) => {
    const adminStore = useAdminStore()  // 移到这里，确保每次都获取最新的 store 实例
    
		console.log('请求拦截器', adminStore.token)
		const token = adminStore.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })
  
  // 响应拦截器
  api.interceptors.response.use(
    (response) => response.data,
    (error) => {
      if (error.response?.status === 401) {
        const adminStore = useAdminStore()  // 同样移到这里
        adminStore.logout()
        navigateTo('/login')
      }
      return Promise.reject(error)
    }
  )
  
  return api
}