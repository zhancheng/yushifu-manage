import { defineStore } from 'pinia'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    token: '',
    adminInfo: null as any,
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  
  actions: {
    setToken(token: string) {
      this.token = token
      if (process.client) {
        localStorage.setItem('admin_token', token)
      }
    },
    
    setAdminInfo(info: any) {
      this.adminInfo = info
    },
    
    logout() {
      this.token = ''
      this.adminInfo = null
      if (process.client) {
        localStorage.removeItem('admin_token')
      }
    },
    
    initFromStorage() {
      if (process.client) {
        const token = localStorage.getItem('admin_token')
        if (token) {
          this.token = token
        }
      }
    },
  },
})