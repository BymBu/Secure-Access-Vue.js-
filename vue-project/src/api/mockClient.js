const BASE_URL = "http://localhost:3001/api/v1";

async function request(url, options = {}) {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  return response.json();
}

export const api = {
  // Авторизация
  login(email, password) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ login: email, password }),
    });
  },

  // Профиль
  getProfile(token) {
    return request("/users/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Регистрация
  register(email, password) {
    return request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, role: "user" }),
    });
  },

  // Сессии
  getSessions(token) {
    return request("/auth/sessions", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Завершить сессию
  deleteSession(token, id) {
    return request(`/auth/sessions/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Завершить все сессии
  deleteSessions(token) {
    return request(`/auth/logout-all`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // запрос сброса
  forgotPassword(email) {
    return fetch(`${BASE_URL}/auth/password/forgot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email }),
    }).then((r) => r.json());
  },

  // сброс по токену
  resetPassword(token, newPassword) {
    return request("/auth/password/reset", {
      method: "POST",
      body: JSON.stringify({
        token: token,
        new_password: newPassword,
      }),
    });
  },

  // получить верификационный код
  getVerificationCode(token, email, channel = "email") {
    return request("/verifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        channel: channel,
        target: email,
      }),
    });
  },

  // Подтвердить верификационный код
  confirmVerification(token, code, channel = "email") {
    return request("/verifications/confirm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        code: code,
        channel: channel,
      }),
    });
  },

  // аудит логи для админа
  getAuditLogs(token) {
    return request("/admin/audit-logs", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // получить всех пользователей для админа
  getUsers(token) {
    return request("/admin/users", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
