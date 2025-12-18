<template>
    <div class="reset-container">
        <div class="reset-card">
            <div class="reset-header">
                <div class="icon-wrapper">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                </div>
                <h1 class="title">Сброс пароля</h1>
                <p class="subtitle">Введите токен и новый пароль</p>
            </div>

            <form @submit.prevent="reset" class="reset-form">
                <div v-if="error" class="error-message">
                    {{ error }}
                </div>

                <div class="input-group">
                    <div class="input-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <input v-model="token" placeholder="Введите токен из письма" required @input="clearError">
                </div>

                <div class="input-group">
                    <div class="input-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <input v-model="password" type="password" placeholder="Новый пароль (минимум 12 символов)" required @input="clearError">
                </div>

                <button type="submit" class="submit-btn">
                    Сменить пароль
                </button>

                <router-link to="/login" class="back-link">
                    <svg class="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Вернуться к входу
                </router-link>
            </form>

            <div class="reset-info">
                <div class="info-item">
                    <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Токен действителен 30 минут</span>
                </div>
                <div class="info-item">
                    <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Пароль должен содержать минимум 12 символов</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/api/mockClient'

const token = ref('')
const error = ref('')
const password = ref('')
const router = useRouter()

function clearError() {
    error.value = ''
}

async function reset() {
    if (password.value.length < 12) {
        error.value = 'Пароль должен быть минимум 12 символов'
        return
    }

    await api.resetPassword(token.value, password.value)
    router.push('/login')
}
</script>

<style scoped>
.error-message {
    background: #fee;
    border: 1px solid #fecaca;
    border-radius: 8px;
    padding: 12px 16px;
    color: #dc2626;
    font-size: 14px;
    margin-bottom: 16px;
    text-align: center;
}

.reset-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    box-sizing: border-box;
}

.reset-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 100, 0, 0.1);
    padding: 40px;
    width: 100%;
    max-width: 480px;
    border: 1px solid #e2e8f0;
    box-sizing: border-box;
}

.reset-header {
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

.reset-form {
    margin-bottom: 30px;
    width: 100%;
    box-sizing: border-box;
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

.submit-btn:hover {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
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

.reset-info {
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
    .reset-container {
        padding: 16px;
    }
    
    .reset-card {
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