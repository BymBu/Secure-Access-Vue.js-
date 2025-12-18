<template>
    <div class="verification-container">
        <div class="verification-card">
            <div class="verification-header">
                <div class="icon-wrapper">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h1 class="title">Подтверждение Email</h1>
                <p class="subtitle">Отправить код верификации на вашу почту</p>
            </div>

            <div class="user-email">
                <svg class="email-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <span class="email-text">{{ authStore.user?.email }}</span>
            </div>

            <form v-if="!sucess" @submit.prevent="sendVerificationCode" class="verification-form">
                <div v-if="error" class="error-message">
                    {{ error }}
                </div>

                <div v-if="successMessage" class="success-message">
                    {{ successMessage }}
                    <div v-if="mockCode" class="mock-code">
                        Код для тестирования: <strong>{{ mockCode }}</strong>
                    </div>
                </div>

                <button type="submit" class="submit-btn">
                    <span>Отправить код подтверждения</span>
                </button>
            </form>

            <form v-else @submit.prevent="applyVerificationCode" class="verification-form">
                <div v-if="error" class="error-message">
                    {{ error }}
                </div>

                <div v-if="successMessage" class="success-message">
                    {{ successMessage }}
                    <div v-if="mockCode" class="mock-code">
                        Код для тестирования: <strong>{{ mockCode }}</strong>
                    </div>
                </div>

                <input v-model="code" class="code-input" placeholder="Введите код">
                <button type="submit" class="submit-btn">
                    <span>Подтвердить</span>
                </button>

            </form>




            <div class="verification-info">
                <div class="info-item">
                    <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Код действителен 15 минут</span>
                </div>
                <div class="info-item">
                    <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Безопасное подтверждение</span>
                </div>
            </div>

            <router-link to="/profile" class="back-link">
                <svg class="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Вернуться в профиль
            </router-link>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { api } from '@/api/mockClient';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const error = ref('');
const successMessage = ref('');
const mockCode = ref('');
const loading = ref(false);
const sucess = ref(false)
const code = ref('')


async function sendVerificationCode() {
    error.value = '';
    successMessage.value = '';
    mockCode.value = '';
    loading.value = true;

    try {
        const token = authStore.token;
        const email = authStore.user?.email;

        if (!email) {
            error.value = 'Email пользователя не найден';
            return;
        }

        const response = await api.getVerificationCode(token, email, "email");
        sucess.value = true

        if (response.error) {
            error.value = response.error.message || 'Ошибка отправки кода';
        } else {
            error.value = ''
            successMessage.value = response.message || 'Код успешно отправлен';
            mockCode.value = response.mock_code || '';
        }

    } catch (err) {
        error.value = 'Не удалось отправить код';
        console.error('Ошибка:', err);
    } finally {
        loading.value = false;
    }
}


async function applyVerificationCode() {
    try {
        const token = authStore.token;


        const response = await api.confirmVerification(token, code.value, "email");
        sucess.value = true

        if (response.error) {
            error.value = response.error.message || 'Ошибка отправки кода';
        } else {
            error.value = ''
            successMessage.value = response.message || 'Верификация пройдена!';
            mockCode.value = response.mock_code || '';
        }

    } catch (err) {
        error.value = 'Не удалось отправить код';
        console.error('Ошибка:', err);
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped>
.verification-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.verification-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 100, 0, 0.1);
    padding: 40px;
    width: 100%;
    max-width: 480px;
    border: 1px solid #e2e8f0;
}

.verification-header {
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
}

.subtitle {
    color: #6b7280;
    font-size: 14px;
    margin: 0;
}

.user-email {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 30px;
}

.code-input {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 30px;
    width: 93%;
}

.email-icon {
    width: 20px;
    height: 20px;
    color: #10b981;
    flex-shrink: 0;
}

.email-text {
    color: #065f46;
    font-weight: 500;
    font-size: 15px;
    word-break: break-all;
}

.verification-form {
    margin-bottom: 30px;
}

.error-message {
    background: #fee;
    border: 1px solid #fecaca;
    border-radius: 8px;
    padding: 12px 16px;
    color: #dc2626;
    font-size: 14px;
    margin-bottom: 16px;
}

.success-message {
    background: #d1fae5;
    border: 1px solid #a7f3d0;
    border-radius: 8px;
    padding: 16px;
    color: #065f46;
    font-size: 14px;
    margin-bottom: 16px;
}

.mock-code {
    margin-top: 8px;
    padding: 8px 12px;
    background: white;
    border-radius: 6px;
    font-size: 13px;
    border: 1px dashed #10b981;
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
}

.submit-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
}

.submit-btn:active:not(:disabled) {
    transform: translateY(0);
}

.submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.submit-btn.loading {
    position: relative;
    color: transparent;
}

.submit-btn.loading::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    top: 50%;
    left: 50%;
    margin: -10px 0 0 -10px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.verification-info {
    background: #f8fafc;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;
    border: 1px solid #e2e8f0;
}

.info-item {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
    color: #4b5563;
    font-size: 14px;
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
}

.back-link:hover {
    background: #f9fafb;
    color: #374151;
}

.back-icon {
    width: 16px;
    height: 16px;
}

@media (max-width: 480px) {
    .verification-card {
        padding: 24px;
    }

    .title {
        font-size: 20px;
    }
}
</style>