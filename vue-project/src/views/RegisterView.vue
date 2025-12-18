<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <div class="icon-wrapper">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h1 class="title">Регистрация</h1>
        <p class="subtitle">Создание нового аккаунта</p>
      </div>

      <form @submit.prevent="handleRegister" class="register-form">
        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div v-if="success" class="success-message">
          {{ success }}
        </div>

        <div class="input-group">
          <div class="input-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 8l7.89-5.26a2 2 0 012.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <input v-model="form.email" type="email" placeholder="user@example.com" required @input="clearErrors" />
        </div>

        <div class="input-group">
          <div class="input-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <input v-model="form.password" type="password" placeholder="Пароль (минимум 12 символов)" required
            @input="clearErrors" />
        </div>

        <div class="input-group">
          <div class="input-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <input v-model="form.confirmPassword" type="password" placeholder="Подтвердите пароль" required
            @input="clearErrors" />
        </div>

        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
        </button>

        <router-link to="/login" class="back-link">
          <svg class="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Уже есть аккаунт? Войти
        </router-link>
      </form>

      <div class="register-info">
        <div class="info-item">
          <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Пароль должен содержать минимум 12 символов</span>
        </div>
        <div class="info-item">
          <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>После регистрации вы будете авторизованы автоматически</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/api/mockClient'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: '',
  confirmPassword: ''
})
const loading = ref(false)
const error = ref('')
const success = ref('')

function clearErrors() {
  error.value = ''
}

async function handleRegister() {
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Пароли не совпадают'
    return
  }

  if (form.value.password.length < 12) {
    error.value = 'Пароль должен быть не менее 12 символов'
    return
  }

  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const result = await api.register(form.value.email, form.value.password)

    if (result.error) {
      error.value = 'Пользователь уже существует'
      return

    }

    success.value = 'Регистрация успешна! Авторизация...'


    authStore.setAuthData(result.access_token, result.user)


    setTimeout(() => {
      router.push('/')
    }, 1000)

  } catch (err) {
    error.value = 'Ошибка регистрации. Возможно, email уже используется.'
    console.error('Register error:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
}

.register-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 100, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 480px;
  border: 1px solid #e2e8f0;
  box-sizing: border-box;
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
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
  font-size: 24px;
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

.register-form {
  margin-bottom: 30px;
  width: 100%;
  box-sizing: border-box;
}

.error-message {
  background: #fee;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 12px 16px;
  color: #dc2626;
  font-size: 14px;
  margin-bottom: 20px;
  text-align: center;
}

.success-message {
  background: #d1fae5;
  border: 1px solid #a7f3d0;
  border-radius: 8px;
  padding: 12px 16px;
  color: #065f46;
  font-size: 14px;
  margin-bottom: 20px;
  text-align: center;
}

.input-group {
  position: relative;
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
}

.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #10b981;
}

.input-group input {
  width: 100%;
  padding: 16px 16px 16px 48px;
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  font-size: 16px;
  background: #f0fdf4;
  transition: all 0.3s ease;
  box-sizing: border-box;
  max-width: 100%;
}

.input-group input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.input-group input::placeholder {
  color: #9ca3af;
}

.submit-btn {
  width: 100%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
  box-sizing: border-box;
}

.submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.back-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #6b7280;
  font-size: 14px;
  text-decoration: none;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
}

.back-link:hover {
  background: #f9fafb;
  color: #374151;
}

.back-icon {
  width: 16px;
  height: 16px;
}

.register-info {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  box-sizing: border-box;
  width: 100%;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  color: #4b5563;
  font-size: 14px;
  word-wrap: break-word;
  width: 100%;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-icon {
  width: 16px;
  height: 16px;
  color: #10b981;
  flex-shrink: 0;
}

@media (max-width: 480px) {
  .register-container {
    padding: 16px;
  }

  .register-card {
    padding: 24px;
  }

  .title {
    font-size: 20px;
  }

  .input-group input {
    padding: 14px 14px 14px 44px;
    font-size: 14px;
  }

  .submit-btn {
    padding: 14px;
    font-size: 15px;
  }
}
</style>