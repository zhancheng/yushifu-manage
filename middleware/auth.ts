export default defineNuxtRouteMiddleware((to, from) => {
  const adminStore = useAdminStore()
  console.log('auth', adminStore.isLoggedIn)
  // Initialize token from storage on client side
  if (process.client) {
    adminStore.initFromStorage()
  }
  
  // Skip auth check on server side since we can't access localStorage
  if (process.server) {
    return
  }
  
  // If trying to access a protected route without being logged in
  if (!adminStore.isLoggedIn && to.path !== '/login') {
    return navigateTo('/login')
  }
  
  // If logged in and trying to access login page, redirect to dashboard
  if (adminStore.isLoggedIn && to.path === '/login') {
    return navigateTo('/dashboard/records')
  }
})