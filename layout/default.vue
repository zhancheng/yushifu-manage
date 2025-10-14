<template>
  <div class="layout-container">
    <el-container>
      <!-- 顶部导航栏 -->
      <el-header class="layout-header">
        <div class="header-content">
          <div class="logo">
            <span>御识符管理后台</span>
          </div>
          <div class="header-right">
            <el-dropdown>
              <span class="el-dropdown-link">
                <el-icon><UserFilled /></el-icon>
                {{ adminStore.admin?.username || '管理员' }}
                <el-icon class="el-icon--right"><arrow-down /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleLogout">
                    <el-icon><SwitchButton /></el-icon>
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      
      <!-- 主体内容区域 -->
      <el-container>
        <!-- 侧边栏菜单（可选） -->
        <el-aside width="200px" class="layout-aside">
          <el-menu
            :default-active="activeMenu"
            router
            class="el-menu-vertical"
          >
            <el-menu-item index="/dashboard/records">
              <el-icon><Document /></el-icon>
              <span>识别记录</span>
            </el-menu-item>
            <!-- 可以继续添加其他菜单项 -->
          </el-menu>
        </el-aside>
        
        <!-- 页面内容 -->
        <el-main class="layout-main">
          <slot />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ElMessageBox, ElMessage } from 'element-plus'
import { UserFilled, ArrowDown, SwitchButton, Document } from '@element-plus/icons-vue'

const adminStore = useAdminStore()
const route = useRoute()

// 当前激活的菜单
const activeMenu = computed(() => route.path)

// 退出登录
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    
    adminStore.logout()
    await navigateTo('/login')
  } catch {
    // 用户取消
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
  overflow: hidden;
	font-size: 14px;
}

.el-container {
  height: 100%;
}

.layout-header {
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: #409eff;
}

.header-right {
  display: flex;
  align-items: center;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #606266;
  font-size: 14px;
}

.el-dropdown-link:hover {
  color: #409eff;
}

.layout-aside {
  background-color: #fff;
  border-right: 1px solid #e6e6e6;
  overflow-y: auto;
}

.el-menu-vertical {
  border-right: none;
  height: 100%;
}

.layout-main {
  background-color: #f0f2f5;
  overflow-y: auto;
  padding: 20px;
}
</style>