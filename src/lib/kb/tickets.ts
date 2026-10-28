// Where each cause that was merged into #4471 is tracked now: one ticket per cause.
import type { Cause } from '#lib/kb/causes';

const REPO = 'https://github.com/phorodenskidev-dot/support-kb-4471/issues';

export const TICKETS: Record<Cause, { number: number; url: string }> = {
  parser: { number: 1, url: `${REPO}/1` },
  hint: { number: 2, url: `${REPO}/2` },
  shift: { number: 3, url: `${REPO}/3` },
};
