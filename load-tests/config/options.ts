import type { Options } from 'k6/options';

// Пороги качества — единые для всех тестов.
export const THRESHOLDS = {
  http_req_duration: ['p(95)<500'], // 95% запросов быстрее 500 мс
  http_req_failed: ['rate<0.01'],   // ошибок меньше 1%
};

// Готовые «профили» нагрузки. Scenario берёт нужный профиль целиком.
export const LOAD_PROFILES = {
  smoke: { vus: 1, iterations: 1 } satisfies Options,

  load: { vus: 20, duration: '2m' } satisfies Options,

  stress: {
    stages: [
      { duration: '30s', target: 20 },  // разгон
      { duration: '30s', target: 100 }, // пик
      { duration: '30s', target: 0 },   // спад
    ],
  } satisfies Options,
};