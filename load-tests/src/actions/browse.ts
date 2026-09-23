import http from 'k6/http';
import { check } from 'k6';

export function browseHome(): void {
  const res = http.get('http://localhost:3000');

  check(res, {
    'статус 200': (r) => r.status === 200,
  });
}