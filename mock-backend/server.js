const jsonServer = require('json-server');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Конфигурация
const PORT = 3001;
const JWT_SECRET = 'mock-secret-key-for-development-only';
const ACCESS_TOKEN_TTL = '15m'; // 6015 минут
const REFRESH_TOKEN_TTL = '7d'; // 7 дней

// Пароль для всех тестовых пользователей
const TEST_PASSWORD = 'SecurePass123!';

// Middleware
server.use(middlewares);
server.use(jsonServer.bodyParser);

// задержка для имитации API
server.use((req, res, next) => {
  setTimeout(next, 50 + Math.random() * 200);
});

// Хелперы
const getDb = () => router.db;
const generateTokens = (userId, role, email) => {
  const accessToken = jwt.sign(
    { sub: userId, role, email, type: 'access' },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_TTL }
  );
  
  const refreshToken = jwt.sign(
    { sub: userId, role, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_TTL }
  );
  
  return { accessToken, refreshToken };
};

const hashToken = (token) => {
  return bcrypt.hashSync(token, 10);
};

const verifyPassword = (inputPassword) => {
  return inputPassword === TEST_PASSWORD;
};

// ========== PUBLIC ENDPOINTS ==========

// POST /api/v1/auth/register
server.post('/api/v1/auth/register', (req, res) => {
  const { email, phone, password, role = 'user' } = req.body;
  const db = getDb();
  
  // Валидация
  const errors = {};
  if (!email && !phone) {
    errors.login = 'Email или телефон обязателен';
  }
  if (!password || password.length < 12) {
    errors.password = 'Пароль должен быть минимум 12 символов';
  }
  
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Ошибка валидации',
        details: errors
      }
    });
  }
  
  // Проверка существующего пользователя
  const existingUser = db.get('users').find(u => 
    (email && u.email === email.toLowerCase()) || 
    (phone && u.phone === phone)
  ).value();
  
  if (existingUser) {
    return res.status(409).json({
      error: {
        code: 'CONFLICT',
        message: 'Пользователь уже существует'
      }
    });
  }
  
  // Создание пользователя
  const userId = require('crypto').randomUUID();
  const newUser = {
    id: userId,
    email: email?.toLowerCase(),
    phone: phone,
    role: role,
    password_hash: bcrypt.hashSync(password, 10),
    email_verified_at: null,
    phone_verified_at: null,
    created_at: new Date().toISOString()
  };
  
  db.get('users').push(newUser).write();
  
  // Генерация токенов
  const { accessToken, refreshToken } = generateTokens(userId, role, email);
  const refreshHash = hashToken(refreshToken);
  
  // Создание сессии
  const sessionId = require('crypto').randomUUID();
  db.get('sessions').push({
    id: sessionId,
    user_id: userId,
    refresh_hash: refreshHash,
    ip: req.ip || '127.0.0.1',
    user_agent: req.get('User-Agent') || '',
    created_at: new Date().toISOString(),
    last_seen: new Date().toISOString(),
    revoked: false,
    revoked_at: null
  }).write();
  
  // Аудит
  db.get('audit_logs').push({
    id: require('crypto').randomUUID(),
    actor_id: userId,
    action: 'USER_REGISTER',
    ip: req.ip || '127.0.0.1',
    ua: req.get('User-Agent') || '',
    created_at: new Date().toISOString(),
    meta: { email, phone, role }
  }).write();
  
  res.json({
    access_token: accessToken,
    refresh_token: refreshToken,
    user: {
      id: userId,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      email_verified: false,
      phone_verified: false
    }
  });
});

// POST /api/v1/auth/login
server.post('/api/v1/auth/login', (req, res) => {
  const { login, password } = req.body;
  const db = getDb();
  
  console.log('🔍 [DEBUG] Login attempt:', { login, password })
  
  // ВАЖНО: Покажи ВСЕХ пользователей
  const allUsers = db.get('users').value()
  console.log('🔍 Все пользователи в БД:')
  allUsers.forEach((u, i) => {
    console.log(`  ${i}. ${u.email} (id: ${u.id})`)
  })
  

  let user = null
  
  console.log('=== РУЧНОЙ ПОИСК ===')
  for (const u of allUsers) {

    const emailExactMatch = u.email === login
    const emailCaseInsensitive = u.email.toLowerCase() === login?.toLowerCase()
    const phoneMatch = u.phone === login
    
    console.log(`  Проверка "${u.email}":`)
    console.log(`    точное совпадение: ${emailExactMatch}`)
    console.log(`    без регистра: ${emailCaseInsensitive}`)
    console.log(`    телефон: ${phoneMatch}`)
    
    if (emailExactMatch || emailCaseInsensitive || phoneMatch) {
      user = u
      console.log(`✅ НАЙДЕН: ${u.email}`)
      break
    }
  }
  

  if (!user && login?.toLowerCase() === 'admin@example.com') {
    console.log('🔄 Специальный поиск admin@example.com')
    user = allUsers.find(u => u.email.toLowerCase() === 'admin@example.com')
  }
  
  console.log('🔍 Итоговый найденный пользователь:', user?.email || 'НЕ НАЙДЕН!')

  
  if (!user) {
    console.log('❌ Пользователь не найден в БД')

    db.get('audit_logs').push({
      id: require('crypto').randomUUID(),
      actor_id: null,
      action: 'USER_LOGIN_FAILED',
      ip: req.ip || '127.0.0.1',
      ua: req.get('User-Agent') || '',
      created_at: new Date().toISOString(),
      meta: { login }
    }).write();
    
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Неверные учетные данные'
      }
    });
  }
  if (!verifyPassword(password)) {
    console.log('❌ Неверный пароль')
    db.get('audit_logs').push({
      id: require('crypto').randomUUID(),
      actor_id: null,
      action: 'USER_LOGIN_FAILED',
      ip: req.ip || '127.0.0.1',
      ua: req.get('User-Agent') || '',
      created_at: new Date().toISOString(),
      meta: { login }
    }).write();
    
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Неверные учетные данные'
      }
    });
  }
  
  console.log('✅ Пароль верный, генерирую токены для:', user.email)
  
  const { accessToken, refreshToken } = generateTokens(user.id, user.role, user.email);
  const refreshHash = hashToken(refreshToken);
  
  const sessionId = require('crypto').randomUUID();
  db.get('sessions').push({
    id: sessionId,
    user_id: user.id,
    refresh_hash: refreshHash,
    ip: req.ip || '127.0.0.1',
    user_agent: req.get('User-Agent') || '',
    created_at: new Date().toISOString(),
    last_seen: new Date().toISOString(),
    revoked: false,
    revoked_at: null
  }).write();
  
  db.get('audit_logs').push({
    id: require('crypto').randomUUID(),
    actor_id: user.id,
    action: 'USER_LOGIN_SUCCESS',
    ip: req.ip || '127.0.0.1',
    ua: req.get('User-Agent') || '',
    created_at: new Date().toISOString(),
    meta: {}
  }).write();
  
  console.log('🎯 Возвращаю данные пользователя:', user.email)
  
  res.json({
    access_token: accessToken,
    refresh_token: refreshToken,
    user: {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      email_verified: !!user.email_verified_at,
      phone_verified: !!user.phone_verified_at
    }
  });
});

// POST /api/v1/auth/refresh
server.post('/api/v1/auth/refresh', (req, res) => {
  const { refresh_token } = req.body;
  
  if (!refresh_token) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Refresh token обязателен'
      }
    });
  }
  
  try {

    const decoded = jwt.verify(refresh_token, JWT_SECRET);
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }
    
    const db = getDb();
    const user = db.get('users').find({ id: decoded.sub }).value();
    
    if (!user) {
      throw new Error('User not found');
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      user.id, 
      user.role, 
      user.email
    );
    
    const newRefreshHash = hashToken(newRefreshToken);
    
    const sessions = db.get('sessions').filter({ 
      user_id: user.id, 
      revoked: false 
    }).value();
    
    if (sessions.length > 0) {
      db.get('sessions').find({ id: sessions[0].id }).assign({
        refresh_hash: newRefreshHash,
        last_seen: new Date().toISOString()
      }).write();
    }
    
    res.json({
      access_token: accessToken,
      refresh_token: newRefreshToken
    });
    
  } catch (error) {
    res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Недействительный refresh token'
      }
    });
  }
});

// POST /api/v1/auth/password/forgot
server.post('/api/v1/auth/password/forgot', (req, res) => {
  const { email } = req.body;
  
  res.json({
    message: 'Если пользователь существует, инструкции отправлены на email'
  });
});

// POST /api/v1/auth/password/reset
server.post('/api/v1/auth/password/reset', (req, res) => {
  const { token, new_password } = req.body;
  
  if (!token || !new_password || new_password.length < 12) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Неверные данные'
      }
    });
  }
  
  res.json({
    message: 'Пароль успешно изменен'
  });
});

// ========== PROTECTED ENDPOINTS ==========

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Требуется авторизация'
      }
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Недействительный или истекший токен'
      }
    });
  }
};

// GET /api/v1/users/me
server.get('/api/v1/users/me', authenticate, (req, res) => {
  const db = getDb();
  const user = db.get('users').find({ id: req.user.sub }).value();
  
  if (!user) {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'Пользователь не найден'
      }
    });
  }
  
  res.json({
    id: user.id,
    email: user.email,
    phone: user.phone,
    role: user.role,
    email_verified: !!user.email_verified_at,
    phone_verified: !!user.phone_verified_at,
    created_at: user.created_at
  });
});

// GET /api/v1/auth/sessions
server.get('/api/v1/auth/sessions', authenticate, (req, res) => {
  const db = getDb();
  const sessions = db.get('sessions')
    .filter({ user_id: req.user.sub, revoked: false })
    .value()
    .map(s => ({
      id: s.id,
      ip: s.ip,
      user_agent: s.user_agent,
      created_at: s.created_at,
      last_seen: s.last_seen,
      current: s.refresh_hash === 'current' 
    }));
  
  res.json({ sessions });
});

// DELETE /api/v1/auth/sessions/:id
server.delete('/api/v1/auth/sessions/:id', authenticate, (req, res) => {
  const db = getDb();
  const sessionId = req.params.id;
  
  const session = db.get('sessions').find({ 
    id: sessionId, 
    user_id: req.user.sub 
  }).value();
  
  if (!session) {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'Сессия не найдена'
      }
    });
  }
  
  db.get('sessions').find({ id: sessionId }).assign({
    revoked: true,
    revoked_at: new Date().toISOString()
  }).write();
  
  res.json({ success: true });
});

// POST /api/v1/auth/logout
server.post('/api/v1/auth/logout', authenticate, (req, res) => {
  const db = getDb();
  
 
  res.json({ success: true });
});

// POST /api/v1/auth/logout-all
server.post('/api/v1/auth/logout-all', authenticate, (req, res) => {
  const db = getDb();
  
 
  db.get('sessions').filter({ 
    user_id: req.user.sub, 
    revoked: false 
  }).each(session => {
    session.revoked = true;
    session.revoked_at = new Date().toISOString();
  }).write();
  
  res.json({ 
    success: true,
    message: 'Все сессии завершены'
  });
});

// ========== ADMIN ENDPOINTS ==========

// GET /api/v1/admin/audit-logs
server.get('/api/v1/admin/audit-logs', authenticate, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: {
        code: 'FORBIDDEN',
        message: 'Требуются права администратора'
      }
    });
  }
  
  const db = getDb();
  const { page = 1, limit = 20 } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  
  const logs = db.get('audit_logs').value();
  const total = logs.length;
  const start = (pageNum - 1) * limitNum;
  const end = start + limitNum;
  
  const paginatedLogs = logs.slice(start, end);
  
  res.json({
    logs: paginatedLogs,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  });
});

// GET /api/v1/admin/users
server.get('/api/v1/admin/users', authenticate, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: {
        code: 'FORBIDDEN',
        message: 'Требуются права администратора'
      }
    });
  }
  
  const db = getDb();
  const users = db.get('users').value().map(u => ({
    id: u.id,
    email: u.email,
    phone: u.phone,
    role: u.role,
    email_verified: !!u.email_verified_at,
    phone_verified: !!u.phone_verified_at,
    created_at: u.created_at
  }));
  
  res.json({ users });
});

// ========== VERIFICATION ENDPOINTS ==========

// POST /api/v1/verifications
server.post('/api/v1/verifications', authenticate, (req, res) => {
  const { channel, target } = req.body; // channel: 'email' или 'sms'
  
  if (!['email', 'sms'].includes(channel)) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Неверный канал верификации'
      }
    });
  }
  
  // В мок-версии генерируем код
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  res.json({
    message: `Код верификации отправлен на ${target}`,
    mock_code: code, // Только для разработки!
    expires_in: 900 // 15 минут в секундах
  });
});

// POST /api/v1/verifications/confirm
server.post('/api/v1/verifications/confirm', authenticate, (req, res) => {
  const { code, channel } = req.body;
  
  if (!code || code.length !== 6) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Неверный формат кода'
      }
    });
  }
  
  const db = getDb();
  const now = new Date().toISOString();
  
  if (channel === 'email') {
    db.get('users').find({ id: req.user.sub }).assign({
      email_verified_at: now
    }).write();
  } else if (channel === 'sms') {
    db.get('users').find({ id: req.user.sub }).assign({
      phone_verified_at: now
    }).write();
  }
  
  res.json({
    success: true,
    message: `${channel === 'email' ? 'Email' : 'Телефон'} успешно подтвержден`
  });
});


server.use('/api/v1', router);

server.listen(PORT, () => {
  console.log(`
🎉 Secure Access Mock Server запущен!
📡 Адрес: http://localhost:${PORT}
📚 Доступные endpoint'ы:

👤 Аутентификация:
  POST   /api/v1/auth/register    - Регистрация
  POST   /api/v1/auth/login       - Вход (логин: admin@example.com, пароль: ${TEST_PASSWORD})
  POST   /api/v1/auth/refresh     - Обновление токенов
  POST   /api/v1/auth/logout      - Выход
  POST   /api/v1/auth/logout-all  - Выход со всех устройств

👤 Пользователь:
  GET    /api/v1/users/me         - Профиль текущего пользователя
  GET    /api/v1/auth/sessions    - Активные сессии
  DELETE /api/v1/auth/sessions/:id - Завершить сессию

🔐 Восстановление:
  POST   /api/v1/auth/password/forgot - Запрос сброса пароля
  POST   /api/v1/auth/password/reset  - Сброс пароля

📱 Верификация:
  POST   /api/v1/verifications        - Отправить код
  POST   /api/v1/verifications/confirm - Подтвердить код

👑 Админ (только для admin):
  GET    /api/v1/admin/audit-logs     - Аудит-логи
  GET    /api/v1/admin/users          - Список пользователей

📊 Для тестирования:
  • Админ: admin@example.com / ${TEST_PASSWORD}
  • Пользователи: сгенерированы автоматически
  • Все пароли: ${TEST_PASSWORD}
  `);
});