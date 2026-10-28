<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { groupByCause, readAs, uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { ONE_DAY_MOVE, TICKETS } from '#lib/kb/tickets';

  let { ticket }: { ticket: number } = $props();

  const rows = $derived((reports as Report[]).filter((r) => r.mergedInto === ticket));
  const merged = $derived(uniqueById(rows));
  const groups = $derived(groupByCause(merged, tenantOf));
  const oneDay = $derived(merged.filter((r) => notes.oneDayMove.includes(r.id)));
  const count = (rs: Report[], key: (r: Report) => string) =>
    Object.entries(rs.reduce<Record<string, number>>((n, r) => ({ ...n, [key(r)]: (n[key(r)] ?? 0) + 1 }), {}))
      .sort((a, b) => b[1] - a[1])
      .map(([k, n]) => `${k} ×${n}`)
      .join(' · ');
  const seen = (rs: Report[]) => {
    const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
    return `${days[0]} → ${days[days.length - 1]}`;
  };
</script>

<p class="sum">
  <strong>{rows.length}</strong> rows in the export · <strong>{merged.length}</strong> reports once each ·
  <strong>{groups.length}</strong> {groups.length === 1 ? 'cause' : 'causes'}
  {#if oneDay.length}· <strong>{oneDay.length}</strong> read as a one-day move{/if}
</p>

<table>
  <thead>
    <tr><th>ticket</th><th>state</th><th>problem</th><th>reports</th><th>tenants</th><th>came in by</th><th>seen</th></tr>
  </thead>
  <tbody>
    {#each groups as g (g.cause)}
      {@const t = g.cause === 'unplaced' ? undefined : TICKETS[g.cause]}
      <tr class:wrong={!t}>
        <td>{#if t}<a href={t.url}>#{t.number}</a>{:else}no ticket{/if}</td>
        <td>{#if t}<span class="state" title={t.why}>{t.state}</span>{/if}</td>
        <td><code>{g.cause}</code></td>
        <td><strong>{g.reports.length}</strong></td>
        <td>{g.tenants}</td>
        <td class="tags">{count(g.reports, (r) => r.channel)}</td>
        <td>{g.firstSeen} → {g.lastSeen}</td>
      </tr>
    {/each}
    {#if oneDay.length}
      <tr>
        <td><a href={ONE_DAY_MOVE.url}>#{ONE_DAY_MOVE.number}</a></td>
        <td><span class="state" title={ONE_DAY_MOVE.why}>{ONE_DAY_MOVE.state}</span></td>
        <td>one-day move</td>
        <td><strong>{oneDay.length}</strong></td>
        <td>{new Set(oneDay.map((r) => r.tenant)).size}</td>
        <td class="tags">{count(oneDay, (r) => r.channel)}</td>
        <td>{seen(oneDay)}</td>
      </tr>
    {/if}
  </tbody>
</table>

{#each groups as g (g.cause)}
  {@const moved = readAs(g, notes.oneDayMove)}
  {#if moved}
    <p class="note">{moved} of the <code>{g.cause}</code> reports read as a one-day move: counted under
      <code>{g.cause}</code> by tenant, as the desk files them, and tracked as the one-day move in
      #{ONE_DAY_MOVE.number}.</p>
  {/if}
{/each}

<style>
  .sum { font-size: 1.1rem; }
  .tags { color: var(--muted); font-size: 0.85em; }
  .note { color: var(--muted); font-size: 0.85em; }
  .state { white-space: nowrap; font-weight: 600; }
  .wrong td { background: var(--warn-bg); color: var(--warn); }
</style>
