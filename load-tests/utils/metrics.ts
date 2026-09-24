import { Counter, Trend } from 'k6/metrics';

export const searchTime=new Trend('search_time_ms')
export const logins=new Counter('logins_total')