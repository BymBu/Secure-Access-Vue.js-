<template>
    <div v-if="authStore.isAdmin" class="admin-container">
        <div class="admin-card">
            <div class="admin-header">
                <div class="icon-wrapper">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>
                <h1 class="title">Админ-панель</h1>
                <p class="subtitle">Просмотр аудит-логов безопасности</p>
                <div class="admin-badge">
                    <svg class="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Только для администраторов</span>
                </div>

            </div>

            <div class="choose-tab">

                <button @click="choose = 'audit'" class="btn">Аудит-логи</button>
                <button @click="choose = 'users'; loadUsers()" class="btn">Пользователи</button>

                <!-- Вкладка Аудит-логи -->
                <div v-if="choose === 'audit'" class="audit-tab">
                    <div v-if="auditLogs.length === 0" class="empty-state">
                        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                        </svg>
                        <p>Аудит-логи не найдены</p>
                    </div>

                    <div v-else>
                        <div class="logs-header">
                            <div class="logs-count">
                                <svg class="count-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                                </svg>
                                <span>Всего записей: {{ auditLogs.length }}</span>
                            </div>
                        </div>

                        <div class="logs-grid">
                            <div v-for="log in auditLogs" :key="log.id" class="log-card">
                                <div class="log-header">
                                    <div class="log-icon" :class="getLogClass(log.action)">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor">
                                            <path v-if="log.action.includes('SUCCESS')" stroke-linecap="round"
                                                stroke-linejoin="round" stroke-width="2"
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div class="log-info">
                                        <h3 class="log-action">{{ formatAction(log.action) }}</h3>
                                        <span class="log-id">ID: {{ log.id.substring(0, 8) }}...</span>
                                    </div>
                                    <span class="log-time">{{ formatDate(log.created_at) }}</span>
                                </div>

                                <div class="log-details">
                                    <div class="detail-row">
                                        <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span class="detail-label">Пользователь</span>
                                        <span class="detail-value">{{ log.actor_id || 'Система' }}</span>
                                    </div>

                                    <div class="detail-row">
                                        <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                        <span class="detail-label">IP адрес</span>
                                        <span class="detail-value">{{ log.ip || 'Неизвестно' }}</span>
                                    </div>

                                    <div class="detail-row">
                                        <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                        </svg>
                                        <span class="detail-label">User Agent</span>
                                        <span class="detail-value ua-text">{{ truncateText(log.ua || 'Не указан')
                                        }}</span>
                                    </div>

                                    <div v-if="log.meta" class="meta-section">
                                        <div class="meta-header">
                                            <svg class="meta-icon" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span>Дополнительные данные</span>
                                        </div>
                                        <div class="meta-grid">
                                            <div v-for="(value, key) in log.meta" :key="key" class="meta-item">
                                                <span class="meta-key">{{ formatKey(key) }}:</span>
                                                <span class="meta-value">{{ value }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Вкладка пользователи -->
                <div v-else-if="choose === 'users'" class="users-tab">
                    <div v-if="loadingUsers" class="loading-state">
                        <div class="loading-spinner"></div>
                        <p>Загрузка пользователей...</p>
                    </div>

                    <div v-else-if="users.length === 0" class="empty-state">
                        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        <p>Пользователи не найдены</p>
                    </div>

                    <div v-else class="users-content">
                        <div class="users-header">
                            <div class="users-count">
                                <svg class="count-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 1.197a6 6 0 00-6-6" />
                                </svg>
                                <span>Всего пользователей: {{ users.length }}</span>
                            </div>
                        </div>

                        <div class="users-grid">
                            <div v-for="user in users" :key="user.id" class="user-card"
                                :class="{ 'admin-user': user.role === 'admin' }">
                                <div class="user-card-header">
                                    <div class="user-avatar" :class="{ 'admin-avatar': user.role === 'admin' }">
                                        {{ getUserInitials(user.email) }}
                                    </div>
                                    <div class="user-main-info">
                                        <h3 class="user-email">{{ user.email }}</h3>
                                        <div class="user-role-badge" :class="{ 'admin-badge': user.role === 'admin' }">
                                            {{ user.role === 'admin' ? '👑 Администратор' : '👤 Пользователь' }}
                                        </div>
                                    </div>
                                </div>

                                <div class="user-details">
                                    <div class="user-detail-item">
                                        <span class="detail-label">ID:</span>
                                        <span class="detail-value">{{ user.id.substring(0, 8) }}...</span>
                                    </div>

                                    <div v-if="user.phone" class="user-detail-item">
                                        <span class="detail-label">Телефон:</span>
                                        <span class="detail-value">{{ user.phone }}</span>
                                    </div>

                                    <div class="user-detail-item">
                                        <span class="detail-label">Зарегистрирован:</span>
                                        <span class="detail-value">{{ formatDate(user.created_at) }}</span>
                                    </div>

                                    <div class="user-detail-item">
                                        <span class="detail-label">Статус:</span>
                                        <span class="detail-value">
                                            <span :class="user.email_verified ? 'status-success' : 'status-pending'">
                                                {{ user.email_verified ? 'Email ✓' : 'Email ✗' }}
                                            </span>
                                            <span v-if="user.phone"
                                                :class="user.phone_verified ? 'status-success' : 'status-pending'">
                                                {{ user.phone_verified ? 'Phone ✓' : 'Phone ✗' }}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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

    <div v-else>
        Нет доступа
    </div>
</template>

<script setup>
import { api } from '@/api/mockClient';
import { useAuthStore } from '@/stores/auth';
import { onMounted, ref } from 'vue';

const authStore = useAuthStore()
const auditLogs = ref([])
const choose = ref('')
const users = ref([])
const loadingUsers = ref(false)

onMounted(() => {
    loadAuditLogs()
})

async function loadAuditLogs() {
    try {
        const token = authStore.token
        const response = await api.getAuditLogs(token)
        auditLogs.value = response.logs || [];
    } catch (error) {
        console.error('Ошибка загрузки логов:', error)
    }
}

async function loadUsers() {
    try {
        loadingUsers.value = true
        const token = authStore.token
        const response = await api.getUsers(token)
        users.value = response.users || [];
    } catch (error) {
        console.error('Ошибка загрузки пользователей:', error)
    } finally {
        loadingUsers.value = false
    }
}

function getUserInitials(email) {
    if (!email) return 'U'
    return email.charAt(0).toUpperCase()
}

function formatDate(dateString) {
    if (!dateString) return 'Нет данных'
    return new Date(dateString).toLocaleString('ru-RU')
}

function formatAction(action) {
    const actions = {
        'USER_REGISTER': 'Регистрация пользователя',
        'USER_LOGIN_SUCCESS': 'Успешный вход',
        'USER_LOGIN_FAILED': 'Неудачный вход',
        'PASSWORD_RESET_REQUEST': 'Сброс пароля',
        'PASSWORD_RESET_SUCCESS': 'Успешное изменение пароля',
        'VERIFICATION_SENT': 'Верификация пройдена',
        'VERIFICATION_CONFIRMED': 'Верификация пройдена',
        'SESSION_REVOKED': 'Сессия завершена',
        'SESSION_CREATED': 'Сессия создана',
        'PROFILE_UPDATED': 'Обновление профиля',
    }
    return actions[action] || action.replace(/_/g, ' ')
}

function getLogClass(action) {
    if (action.includes('SUCCESS')) return 'log-success'
    if (action.includes('FAILED')) return 'log-failed'
    return 'log-info'
}

function truncateText(text, maxLength = 50) {
    if (!text || text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
}

function formatKey(key) {
    const keys = {
        'device': 'Устройство',
        'location': 'Локация',
        'email': 'Email',
        'phone': 'Телефон',
        'role': 'Роль'
    }
    return keys[key] || key
}
</script>

<style scoped>
.admin-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 20px;
    box-sizing: border-box;
}

.admin-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 100, 0, 0.1);
    padding: 40px;
    width: 100%;
    max-width: 1200px;
    border: 1px solid #e2e8f0;
    box-sizing: border-box;
}

.admin-header {
    text-align: center;
    margin-bottom: 40px;
}

.icon-wrapper {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
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
}

.subtitle {
    color: #6b7280;
    font-size: 14px;
    margin: 0 0 20px 0;
}

.admin-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: linear-gradient(135deg, #f0fdf4 0%, #e2e8f0 100%);
    border: 1px solid #bbf7d0;
    border-radius: 20px;
    padding: 6px 12px;
    color: #065f46;
    font-size: 12px;
    font-weight: 500;
}

.badge-icon {
    width: 14px;
    height: 14px;
}

.choose-tab {

    margin-bottom: 24px;
}

.btn {
    padding: 8px 16px;
    font-size: 13px;
    background: #f8fafc;
    color: #374151;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    cursor: pointer;
    margin-bottom: 10px;
}

.btn:hover {
    background: #f1f5f9;
    border-color: #d1d5db;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.btn:active {
    transform: translateY(0);
}

/* Контент вкладок */
.tab-content {
    margin-bottom: 40px;
}

.audit-tab,
.users-tab {
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Стили для логов */
.logs-container {
    margin-bottom: 40px;
}

.logs-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e2e8f0;
}

.logs-count {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #4b5563;
    font-size: 14px;
    font-weight: 500;
}

.count-icon {
    width: 16px;
    height: 16px;
    color: #10b981;
}

.logs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
    gap: 24px;
}

.log-card {
    background: #f8fafc;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    padding: 24px;
    transition: all 0.3s ease;
}

.log-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
    border-color: #bbf7d0;
}

.log-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e2e8f0;
}

.log-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.log-success {
    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
    color: #059669;
}

.log-failed {
    background: linear-gradient(135deg, #fee 0%, #fecaca 100%);
    color: #dc2626;
}

.log-info {
    background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
    color: #0284c7;
}


.log-action {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 4px 0;
}

.log-id {
    font-size: 11px;
    color: #6b7280;
    font-family: monospace;
}

.log-time {
    font-size: 12px;
    color: #6b7280;
    background: white;
    padding: 4px 8px;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
}

.log-details {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.detail-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px;
    background: white;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
}

.detail-icon {
    width: 16px;
    height: 16px;
    color: #10b981;
    flex-shrink: 0;
}

.detail-label {
    font-size: 12px;
    color: #6b7280;
    font-weight: 500;
    min-width: 100px;
}

.detail-value {
    font-size: 13px;
    color: #1f2937;
    font-weight: 500;
    text-align: right;
    flex: 1;
}

.ua-text {
    font-family: monospace;
    font-size: 12px;
}

.meta-section {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px dashed #e2e8f0;
}

.meta-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    color: #4b5563;
    font-size: 13px;
    font-weight: 500;
}

.meta-icon {
    width: 14px;
    height: 14px;
    color: #8b5cf6;
}

.meta-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 8px;
    background: white;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
}

.meta-key {
    font-size: 11px;
    color: #6b7280;
    font-weight: 500;
}

.meta-value {
    font-size: 11px;
    color: #1f2937;
    font-weight: 500;
    flex: 1;
    text-align: right;
}

/* Стили для пользователей */
.users-content {
    margin-top: 20px;
}

.users-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e2e8f0;
}

.users-count {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #4b5563;
    font-size: 14px;
    font-weight: 500;
}

.users-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
}

.user-card {
    background: #f8fafc;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    padding: 20px;
    transition: all 0.3s ease;
}

.user-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
}

.admin-user {
    border: 2px solid #8b5cf6;
    background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
}

.user-card-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e2e8f0;
}

.user-avatar {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 18px;
    flex-shrink: 0;
}

.admin-avatar {
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.user-main-info {
    flex: 1;
}

.user-email {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 6px 0;
    word-break: break-word;
}

.user-role-badge {
    font-size: 12px;
    color: #6b7280;
    font-weight: 500;
    background: white;
    padding: 4px 10px;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
    display: inline-block;
}

.admin-badge {
    color: #8b5cf6;
    background: #f5f3ff;
    border-color: #ddd6fe;
}

.user-details {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.user-detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px dashed #e2e8f0;
}

.user-detail-item:last-child {
    border-bottom: none;
}

.detail-label {
    font-size: 12px;
    color: #6b7280;
    font-weight: 500;
}

.detail-value {
    font-size: 13px;
    color: #1f2937;
    font-weight: 500;
    text-align: right;
}

.status-success {
    color: #059669;
    font-weight: 600;
}

.status-pending {
    color: #dc2626;
}

/* Состояния загрузки и пустые */
.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    color: #6b7280;
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
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #9ca3af;
}

.empty-icon {
    width: 64px;
    height: 64px;
    margin-bottom: 16px;
    color: #d1d5db;
}

/* Доступ запрещен */
.access-denied {
    text-align: center;
    padding: 100px 20px;
    color: #dc2626;
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
    margin-top: 20px;
}

.back-link:hover {
    background: #f9fafb;
    color: #374151;
}

.back-icon {
    width: 16px;
    height: 16px;
}

/* Адаптивность */
@media (max-width: 1024px) {
    .logs-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .admin-container {
        padding: 16px;
    }

    .admin-card {
        padding: 24px;
    }

    .title {
        font-size: 22px;
    }

    .choose-tab {
        flex-direction: column;
    }

    .btn {
        width: 100%;
    }

    .users-grid {
        grid-template-columns: 1fr;
    }

    .log-header {
        flex-wrap: wrap;
    }

    .meta-grid {
        grid-template-columns: 1fr;
    }

    .detail-row {
        flex-wrap: wrap;
    }

    .detail-label {
        min-width: 80px;
    }

    .user-detail-item {
        flex-wrap: wrap;
    }
}

@media (max-width: 480px) {
    .admin-card {
        padding: 20px;
    }

    .logs-grid {
        grid-template-columns: 1fr;
    }

    .users-grid {
        grid-template-columns: 1fr;
    }
}
</style>