import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const safeParse = (key) => {
    try {
      const item = localStorage.getItem(key)
      if (!item || item === 'undefined' || item === 'null') {
        return null
      }
      return JSON.parse(item)
    } catch (error) {
      console.error(`Ошибка парсинга ${key}:`, error)
      localStorage.removeItem(key)
      return null
    }
  }
  
  // Состояние
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(safeParse('user'))
  
  // Геттеры
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  
  // Действия
  function setAuthData(newToken, newUser) {
    if (!newToken || !newUser) {
      console.error('Невалидные данные для авторизации')
      return
    }
    
    token.value = newToken
    user.value = newUser
    
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
  }
  
  function clearAuth() {
    token.value = ''
    user.value = null
    
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
  
  // Экспортируем
  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    setAuthData,
    clearAuth
  }
})