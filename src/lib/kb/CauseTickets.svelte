<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import { groupByCause, uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { TICKETS } from '#lib/kb/tickets';

  let { ticket }: { ticket: number } = $props();

  const rows = $derived((reports as Report[]).filter((r) => r.mergedInto === ticket));
  const merged = $derived(uniqueById(rows));
  const groups = $derived(groupByCause(merged, tenantOf));
  const count = (rs: Report[], key: (r: Report) => string) =>
    Object.entries(rs.reduce<Record<string, number>>((n, r) => ({ ...n, [key(r)]: (n[key(r)] ?? 0) + 1 }), {}))
      .sort((a, b) => b[1] - a[1])
      .map(([k, n]) => `${k} ×${n}`)
      .join(' · ');
</script>

<p class="sum">
  <strong>{rows.length}</strong> rows in the export · <strong>{merged.length}</strong> reports once each ·
  <strong>{groups.length}</strong> {groups.length === 1 ? 'cause' : 'causes'} ·
  <strong>{groups.filter((g) => g.cause !== 'unplaced' && TICKETS[g.cause]).length}</strong> tickets
</p>

<table>
  <thead>
    <tr><th>ticket</th><th>cause</th><th>reports</th><th>tenants</th><th>came in by</th><th>seen</th></tr>
  </thead>
  <tbody>
    {#each groups as g (g.cause)}
      {@const t = g.cause === 'unplaced' ? undefined : TICKETS[g.cause]}
      <tr class:wrong={!t}>
        <td>{#if t}<a href={t.url}>#{t.number}</a>{:else}no ticket{/if}</td>
        <td><code>{g.cause}</code></td>
        <td><strong>{g.reports.length}</strong></td>
        <td>{g.tenants}</td>
        <td class="tags">{count(g.reports, (r) => r.channel)}</td>
        <td>{g.firstSeen} → {g.lastSeen}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .sum { font-size: 1.1rem; }
  .tags { color: var(--muted); font-size: 0.85em; }
  .wrong td { background: var(--warn-bg); color: var(--warn); }
</style>
