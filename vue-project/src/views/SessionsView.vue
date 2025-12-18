<template>
    <div class="sessions-container">
        <div class="sessions-card">
            <div class="sessions-header">
                <div class="icon-wrapper">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <h1 class="title">Активные сессии</h1>
                <p class="subtitle">Управление подключенными устройствами</p>
            </div>

            <div class="sessions-actions">
                <button @click="deleteSessions()" class="logout-all-btn">
                    <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Выйти со всех устройств
                </button>
            </div>

            <div v-if="sessions.length === 0" class="empty-sessions">
                <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Нет активных сессий</p>
            </div>

            <div v-else class="sessions-grid">
                <div v-for="session in sessions" :key="session.id" class="session-card"
                    :class="{ 'current-session': session.current }">
                    <div class="session-header">
                        <div class="session-icon">
                            <svg v-if="session.current" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div class="session-info">
                            <h3 class="session-ip">{{ session.ip }}</h3>
                            <span v-if="session.current" class="current-badge">Текущая сессия</span>
                        </div>
                    </div>

                    <div class="session-details">
                        <div class="detail-item">
                            <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span class="detail-label">Устройство</span>
                            <span class="detail-value">{{ truncateAgent(session.user_agent) }}</span>
                        </div>

                        <div class="detail-item">
                            <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span class="detail-label">Создана</span>
                            <span class="detail-value">{{ formatDate(session.created_at) }}</span>
                        </div>

                        <div class="detail-item">
                            <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span class="detail-label">Последняя активность</span>
                            <span class="detail-value">{{ formatDate(session.last_seen) }}</span>
                        </div>
                    </div>

                    <div class="session-actions">
                        <button @click="deleteSession(session.id)" class="session-btn" :disabled="session.current">
                            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            {{ session.current ? 'Текущая сессия' : 'Завершить сессию' }}
                        </button>
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/api/mockClient'

const router = useRouter()
const authStore = useAuthStore()
const sessions = ref([])

onMounted(() => {
    loadSessions()
})

function formatDate(dateString) {
    if (!dateString) return 'Нет данных'
    return new Date(dateString).toLocaleString('ru-RU')
}

function truncateAgent(agent) {
    if (!agent) return 'Неизвестно'
    if (agent.length > 40) {
        return agent.substring(0, 40) + '...'
    }
    return agent
}

async function loadSessions() {
    try {
        const token = authStore.token;
        const response = await api.getSessions(token);
        sessions.value = response.sessions;
    } catch (err) {
        console.error('Sessions load error:', err);
        router.push('/profile');
    }
}

async function deleteSession(id) {
    try {
        const token = authStore.token;
        await api.deleteSession(token, id);
        sessions.value = sessions.value.filter(s => s.id !== id)
    } catch (err) {
        console.error('Session delete error:', err);
    }
}

async function deleteSessions() {
    try {
        const token = authStore.token;
        await api.deleteSessions(token);
        sessions.value = []
        authStore.clearAuth()
        router.push('/login')
    } catch (err) {
        console.error('Sessions delete error:', err);
    }
}
</script>

<style scoped>
.sessions-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    box-sizing: border-box;
}

.sessions-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 100, 0, 0.1);
    padding: 40px;
    width: 100%;
    max-width: 1200px;
    border: 1px solid #e2e8f0;
    box-sizing: border-box;
}

.sessions-header {
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

.sessions-actions {
    margin-bottom: 30px;
    display: flex;
    justify-content: center;
}

.logout-all-btn {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 14px 24px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
}

.logout-all-btn:hover {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.3);
}

.btn-icon {
    width: 18px;
    height: 18px;
}

.empty-sessions {
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

.sessions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 24px;
    margin-bottom: 40px;
}

.session-card {
    background: #f8fafc;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    padding: 24px;
    transition: all 0.3s ease;
}

.current-session {
    border: 2px solid #10b981;
    background: #f0fdf4;
}

.session-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

.session-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e2e8f0;
}

.session-icon {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
}

.session-info {
    flex: 1;
}

.session-ip {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 4px 0;
}

.current-badge {
    background: #10b981;
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 500;
}

.session-details {
    margin-bottom: 20px;
}

.detail-item {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
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
    min-width: 140px;
}

.detail-value {
    font-size: 13px;
    color: #1f2937;
    font-weight: 500;
    text-align: right;
    flex: 1;
}

.session-actions {
    display: flex;
    justify-content: center;
}

.session-btn {
    width: 100%;
    background: #f8fafc;
    color: #374151;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.session-btn:hover:not(:disabled) {
    background: #f1f5f9;
    transform: translateY(-1px);
}

.session-btn:disabled {
    background: #f3f4f6;
    color: #9ca3af;
    cursor: not-allowed;
    border-color: #e5e7eb;
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

@media (max-width: 768px) {
    .sessions-container {
        padding: 16px;
    }

    .sessions-card {
        padding: 24px;
    }

    .title {
        font-size: 22px;
    }

    .sessions-grid {
        grid-template-columns: 1fr;
        gap: 16px;
    }

    .detail-item {
        flex-wrap: wrap;
    }

    .detail-label {
        min-width: 120px;
    }
}
</style>