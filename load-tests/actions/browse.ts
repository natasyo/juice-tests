import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL } from '../config/env.ts';

export function browseHome() {
  const res = http.get(BASE_URL);
  check(res, {
    'status 200': (r) => r.status === 200,
  });
}