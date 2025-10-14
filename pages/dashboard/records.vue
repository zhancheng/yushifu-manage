<template>
  <div class="dashboard-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户识别记录</span>
          <el-button type="danger" @click="handleLogout">退出登录</el-button>
        </div>
      </template>
      
      <!-- 搜索表单 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="用户ID">
          <el-input
            v-model="searchForm.userId"
            placeholder="请输入用户ID"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
      
      <!-- 数据表格 -->
      <el-table
        v-loading="loading"
        :data="records"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="userId" label="用户ID" />
        <el-table-column label="用户昵称" width="150">
          <template #default="{ row }">
            {{ row.user?.nickname || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="会员状态" width="100">
          <template #default="{ row }">
            <el-tag :type="isMember(row.user) ? 'success' : 'info'">
              {{ isMember(row.user) ? '会员' : '普通用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="150">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              @click="openDebugUrl(row.debugUrl)"
            >
              查看调试
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.limit"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="fetchRecords"
          @current-change="fetchRecords"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'

definePageMeta({
  middleware: 'auth'
})

const adminStore = useAdminStore()
const api = useApi()

const loading = ref(false)
const records = ref<any[]>([])

const searchForm = reactive({
  userId: '',
})

const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0,
})

// 获取记录列表
const fetchRecords = async () => {
  loading.value = true
  try {
    const params: any = {
      page: pagination.page,
      limit: pagination.limit,
    }
    
    if (searchForm.userId) {
      params.userId = searchForm.userId
    }
    
    const res = await api.get('/admin/identification/records', { params })
    
    records.value = res.data.records || []
    pagination.total = res.data.total || 0
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || '获取数据失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  fetchRecords()
}

// 重置
const handleReset = () => {
  searchForm.userId = ''
  pagination.page = 1
  fetchRecords()
}

// 打开调试 URL
const openDebugUrl = (url: string) => {
  if (!url) {
    ElMessage.warning('调试URL不存在')
    return
  }
  window.open(url, '_blank')
}

// 格式化日期
const formatDate = (date: string) => {
  return new Date(date).toLocaleString('zh-CN')
}

// 判断是否为会员
const isMember = (user: any) => {
  if (!user?.membershipExpiresAt) return false
  return new Date(user.membershipExpiresAt) > new Date()
}

// 退出登录
const handleLogout = async () => {
  await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  
  adminStore.logout()
  await navigateTo('/login')
}

// 页面加载时获取数据
onMounted(() => {
  fetchRecords()
})
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  min-height: 100vh;
  background-color: #f0f2f5;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}

.search-form {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>