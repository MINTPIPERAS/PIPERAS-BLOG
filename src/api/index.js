import axios from "axios"

const api = axios.create({
  // 开发环境：走 Vite 代理（/api -> 后端），避免端口冲突
  // 生产环境：可通过 VITE_API_BASE_URL 覆盖（例如 https://example.com/api）
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api"
})

api.interceptors.request.use(config => {

  const token = localStorage.getItem("token")

  if (token) {

    config.headers.Authorization = `Bearer ${token}`

  }

  return config

})

export default api

