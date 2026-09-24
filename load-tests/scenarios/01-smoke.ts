import type { Options } from 'k6/options';
import { guestFlow } from '../flows/guest-flow.ts';

export const options: Options = {
  vus: 1,
  iterations: 1,
};

export default function () {
  guestFlow();
}