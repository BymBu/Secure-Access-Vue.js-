<template>
  <div class="profile-container">
    <div class="profile-card">
      <div class="profile-header">
        <div class="icon-wrapper">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h1 class="title">Ваш профиль</h1>
        <p class="subtitle">Информация о вашем аккаунте</p>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Загрузка профиля...</p>
      </div>

      <div v-else-if="profile" class="profile-content">
        <div class="profile-grid">
          <div class="profile-item">
            <div class="item-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 8l7.89-5.26a2 2 0 012.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="item-content">
              <span class="item-label">Email</span>
              <span class="item-value">{{ profile.email }}</span>
            </div>
          </div>

          <div class="profile-item">
            <div class="item-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div class="item-content">
              <span class="item-label">Телефон</span>
              <span class="item-value">{{ profile.phone || 'Не указан' }}</span>
            </div>
          </div>

          <div class="profile-item">
            <div class="item-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div class="item-content">
              <span class="item-label">Роль</span>
              <span class="item-value role-badge">{{ profile.role }}</span>
            </div>
          </div>

          <div class="profile-item">
            <div class="item-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="item-content">
              <span class="item-label">Email подтвержден</span>
              <span :class="['item-value', profile.email_verified ? 'status-success' : 'status-pending']">
                {{ profile.email_verified ? '✅ Подтвержден' : '❌ Требуется' }}
              </span>
            </div>
          </div>

          <div class="profile-item">
            <div class="item-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="item-content">
              <span class="item-label">Аккаунт создан</span>
              <span class="item-value">{{ new Date(profile.created_at).toLocaleDateString() }}</span>
            </div>
          </div>
        </div>

        <div class="profile-actions">
          <router-link to="/sessions" class="action-btn primary">
            <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Управление сессиями
          </router-link>

          <router-link to="/verification" class="action-btn">
            <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Верификация
          </router-link>

          <button @click="logout" class="action-btn danger">
            <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Выйти
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/api/mockClient'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const profile = ref(null)

onMounted(() => {
  loadProfile()
})

async function loadProfile() {
  loading.value = true

  try {
    const token = authStore.token
    profile.value = await api.getProfile(token)
  } catch (err) {
    console.error('Profile load error:', err)
    router.push('/login')
  } finally {
    loading.value = false
  }
}

function logout() {
  authStore.clearAuth()
  router.push('/login')
}
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
}

.profile-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 100, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 600px;
  border: 1px solid #e2e8f0;
  box-sizing: border-box;
}

.profile-header {
  text-align: center;
  margin-bottom: 40px;
}

.icon-wrapper {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.icon {
  width: 32px;
  height: 32px;
  color: white;
}

.title {
  font-size: 28px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
  word-wrap: break-word;
}

.subtitle {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
  word-wrap: break-word;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f0fdf4;
  border-top: 3px solid #10b981;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.profile-content {
  width: 100%;
}

.profile-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 40px;
}

.profile-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.profile-item:hover {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.item-icon {
  width: 24px;
  height: 24px;
  color: #10b981;
  flex-shrink: 0;
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.item-value {
  font-size: 15px;
  color: #1f2937;
  font-weight: 500;
}

.role-badge {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  display: inline-block;
  text-transform: uppercase;
}

.status-success {
  color: #059669;
}

.status-pending {
  color: #dc2626;
}

.profile-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 20px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
}

.action-btn.primary {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.action-btn.primary:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
}

.action-btn {
  background: #f8fafc;
  color: #374151;
  border: 1px solid #e2e8f0;
}

.action-btn:hover {
  background: #f1f5f9;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.action-btn.danger {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.action-btn.danger:hover {
  background: #fee;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(220, 38, 38, 0.1);
}

.action-icon {
  width: 18px;
  height: 18px;
}

@media (max-width: 640px) {
  .profile-container {
    padding: 16px;
  }
  
  .profile-card {
    padding: 24px;
  }

  .title {
    font-size: 22px;
  }
  
  .profile-grid {
    grid-template-columns: 1fr;
  }
  
  .profile-actions {
    flex-direction: column;
  }
}

@media (min-width: 768px) {
  .profile-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>