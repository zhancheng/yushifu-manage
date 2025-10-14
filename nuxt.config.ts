// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  modules: [
    '@element-plus/nuxt',  // 添加官方模块
    '@pinia/nuxt'
  ],
  
  // 添加全局 CSS
  css: ['normalize.css'],
  
  devServer: {
		host: '0.0.0.0',
    port: 3005
  },
  
  // 移除 build.transpile 配置
  // build: {
  //   transpile: ['element-plus']
  // },
  
  // 移除 vite plugins 配置
  // vite: {
  //   plugins: [
  //     AutoImport({
  //       resolvers: [ElementPlusResolver()],
  //     }),
  //     Components({
  //       resolvers: [ElementPlusResolver()],
  //     }),
  //   ],
  // },
  
  // 可选：配置 element-plus 选项（如中文语言）
  
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://192.168.31.128:3001/'
    }
  }
})