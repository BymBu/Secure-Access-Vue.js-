const fs = require('fs');
const { faker } = require('@faker-js/faker');

console.log('🔧 Генерация тестовых данных...');

// 1. Генерация пользователей
const users = [];
const adminUser = {
  id: faker.string.uuid(),
  email: 'admin@example.com',
  phone: '+79990000001',
  role: 'admin',
  password_hash: '$2a$10$N9qo8uLOickgx2ZMRZoMye3.ZLwB.8KjF2E6G0g8U7Yw5q6Y2hF6K', // password: AdminPass123!
  email_verified_at: faker.date.recent().toISOString(),
  phone_verified_at: faker.date.recent().toISOString(),
  created_at: faker.date.past({ years: 1 }).toISOString()
};
users.push(adminUser);

for (let i = 1; i <= 9; i++) {
  users.push({
    id: faker.string.uuid(),
    email: faker.internet.email(),
    phone: `+7999${faker.number.int({ min: 1000000, max: 9999999 })}`,
    role: 'user',
    password_hash: '$2a$10$N9qo8uLOickgx2ZMRZoMye3.ZLwB.8KjF2E6G0g8U7Yw5q6Y2hF6K', // password: UserPass123!
    email_verified_at: faker.datatype.boolean(0.7) ? faker.date.recent().toISOString() : null,
    phone_verified_at: faker.datatype.boolean(0.5) ? faker.date.recent().toISOString() : null,
    created_at: faker.date.past({ years: 1 }).toISOString()
  });
}

// 2. Генерация сессий
const sessions = [];
users.forEach(user => {
  const sessionCount = faker.number.int({ min: 1, max: 3 });
  for (let j = 0; j < sessionCount; j++) {
    const created = faker.date.recent({ days: 30 });
    sessions.push({
      id: faker.string.uuid(),
      user_id: user.id,
      refresh_hash: faker.string.alphanumeric(64),
      ip: faker.internet.ip(),
      user_agent: faker.internet.userAgent(),
      created_at: created.toISOString(),
      last_seen: faker.date.between({ from: created, to: new Date() }).toISOString(),
      revoked: j === 0 ? false : faker.datatype.boolean(0.3),
      revoked_at: j === 0 ? null : faker.date.recent({ days: 2 }).toISOString()
    });
  }
});

// 3. Генерация аудит-логов
const auditLogs = [];
const actions = [
  'USER_LOGIN_SUCCESS',
  'USER_LOGIN_FAILED',
  'USER_REGISTER',
  'PASSWORD_RESET_REQUEST',
  'PASSWORD_RESET_SUCCESS',
  'VERIFICATION_SENT',
  'VERIFICATION_CONFIRMED',
  'SESSION_CREATED',
  'SESSION_REVOKED',
  'PROFILE_UPDATED'
];

for (let i = 0; i < 100; i++) {
  const user = faker.helpers.arrayElement(users);
  const action = faker.helpers.arrayElement(actions);
  
  auditLogs.push({
    id: faker.string.uuid(),
    actor_id: faker.datatype.boolean(0.8) ? user.id : null,
    action: action,
    ip: faker.internet.ip(),
    ua: faker.internet.userAgent(),
    created_at: faker.date.recent({ days: 60 }).toISOString(),
    meta: faker.datatype.boolean(0.3) ? {
      device: faker.helpers.arrayElement(['mobile', 'desktop', 'tablet']),
      location: `${faker.location.city()}, ${faker.location.country()}`
    } : {}
  });
}

// 4. Генерация токенов сброса пароля
const passwordResetTokens = [];
for (let i = 0; i < 5; i++) {
  const user = faker.helpers.arrayElement(users.slice(1)); 
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + 30 * 60 * 1000); 
  
  passwordResetTokens.push({
    id: faker.string.uuid(),
    user_id: user.id,
    token_hash: faker.string.alphanumeric(32),
    expires_at: expiresAt.toISOString(),
    used_at: faker.datatype.boolean(0.4) ? faker.date.recent({ days: 1 }).toISOString() : null
  });
}

// 5. Генерация верификаций контактов
const contactVerifications = [];
for (let i = 0; i < 15; i++) {
  const user = faker.helpers.arrayElement(users);
  const channel = faker.helpers.arrayElement(['email', 'sms']);
  const target = channel === 'email' ? user.email : user.phone;
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + 15 * 60 * 1000); 
  
  contactVerifications.push({
    id: faker.string.uuid(),
    user_id: user.id,
    channel: channel,
    target: target,
    code_hash: faker.string.numeric(6), 
    expires_at: expiresAt.toISOString(),
    used_at: faker.datatype.boolean(0.6) ? faker.date.recent({ days: 1 }).toISOString() : null
  });
}

// Собираем всю базу данных
const db = {
  users,
  sessions,
  audit_logs: auditLogs,
  password_reset_tokens: passwordResetTokens,
  contact_verifications: contactVerifications
};

// Сохраняем в файл
fs.writeFileSync('db.json', JSON.stringify(db, null, 2));

console.log('✅ Данные успешно сгенерированы!');
console.log(`👥 Пользователей: ${users.length}`);
console.log(`🌐 Сессий: ${sessions.length}`);
console.log(`📊 Аудит-логов: ${auditLogs.length}`);
console.log(`🔑 Токенов сброса: ${passwordResetTokens.length}`);
console.log(`📱 Верификаций: ${contactVerifications.length}`);
console.log('\nДля запуска сервера выполните: npm start');