import { group, sleep } from 'k6';
import { browseHome } from '../actions/browse.ts';

export function guestFlow() {
  group('Open main page', () => {
    browseHome();
    sleep(1);
  });
}