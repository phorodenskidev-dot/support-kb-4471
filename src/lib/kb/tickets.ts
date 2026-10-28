// Where each problem that was merged into #4471 is tracked now: one ticket per problem.
import type { Cause } from '#lib/kb/causes';

const REPO = 'https://github.com/phorodenskidev-dot/support-kb-4471/issues';

export type Ticket = { number: number; url: string; state: 'open' | 'fixed' | "won't fix"; why: string };

export const TICKETS: Record<Cause, Ticket> = {
  parser: { number: 1, url: `${REPO}/1`, state: 'fixed', why: 'fix(dates): parse dd/mm for eu locales' },
  hint: { number: 2, url: `${REPO}/2`, state: "won't fix", why: 'booking-v3 form retired' },
};

// The reports the desk read as a one-day move (desk-notes.json). The desk files them under
// their tenant's cause and footnotes them; this ticket tracks the one-day move itself.
export const ONE_DAY_MOVE: Ticket = {
  number: 3,
  url: `${REPO}/3`,
  state: 'open',
  why: 'neither #4471 change touches it',
};
