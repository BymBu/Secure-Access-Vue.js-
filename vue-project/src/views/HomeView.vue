<template>
  <div class="home-wrapper">
    <div class="home-card">
      <h1 class="home-title">Secure Access MVP</h1>
      <p class="home-subtitle">Производственная практика Ерофеев В.И.</p>

      <div v-if="!authStore.user" class="auth-section">
        <p class="auth-message">Для начала работы войдите в систему</p>
        <router-link to="/login" class="auth-button-link">
          <button class="auth-button">Войти</button>
        </router-link>
      </div>

      <div v-else class="profile-section">
        <p class="welcome-message">Добро пожаловать, <strong>{{ authStore.user.email }}</strong>!</p>
        <p class="role-message">Ваша роль: <span class="user-role">{{ authStore.user.role }}</span></p>
        <router-link to="/profile" class="profile-button-link">
          <button class="profile-button">Перейти в профиль</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>

<style scoped>
.home-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  color: #333333;
}

.home-card {
  width: 100%;
  max-width: 500px;
  padding: 2.5rem;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
  text-align: center;
  border: 1px solid #eaeaea;
}

.home-title {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 700;
}

.home-subtitle {
  font-size: 1rem;
  color: #777777;
  margin-bottom: 2rem;
}

.auth-section,
.profile-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.auth-message,
.welcome-message,
.role-message {
  font-size: 1.125rem;
  line-height: 1.5;
  margin: 0;
}

.user-role {
  font-weight: 600;
  color: #42b983;
}

.auth-button-link,
.profile-button-link {
  text-decoration: none;
}

.auth-button,
.profile-button {
  padding: 0.875rem 2rem;
  font-size: 1.05rem;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  background-color: #42b983;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.auth-button:hover,
.profile-button:hover {
  background-color: #42b983;
}
</style>