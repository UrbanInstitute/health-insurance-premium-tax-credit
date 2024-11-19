<script>
  import { config } from "$lib/stores/config.js";

  /** @type { Object[] } */
  export let data;

  $: columns = data.length > 0 ? Object.keys(data[0]) : undefined;
</script>

<div class="info-table-wrapper">
  {#if data && columns}
    <table>
      <thead>
        <tr>
          {#each columns as column}
            <th>{column}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each data as row, i (i)}
          <tr>
            {#each columns as column, i}
              {#if i > 0}
                {#if row[column] === 0}
                <td>&lt; 1,000 change</td>
                {:else}
                <td>{row[column] > 0 ? "+" : ""}{$config.format.number(row[column])}</td>
                {/if}
              {:else}
                <td>{@html row[column]}</td>
              {/if}
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>

<style>
  .info-table-wrapper:not(:first-child) {
    margin-top: var(--spacing-8);
  }
  /* table */
  table {
    border-spacing: 0;
    font-size: var(--font-size-small);
    margin: 0;
    width: 100%;
  }

  /*** TABLE HEADER ***/
  thead tr:first-child th {
    text-align: right;
    border-bottom: 2px solid var(--color-black);
    padding-bottom: var(--spacing-3);
    vertical-align: bottom;
    font-weight: 900;
  }

  /* all first table header left right*/
  thead tr:first-child th:first-child {
    text-align: left;
  }

  /*** TABLE BODY ***/
  tbody tr td {
    padding: var(--spacing-2) var(--spacing-1);
    border-bottom: 2px solid var(--color-gray);
  }

  tbody tr td:first-child {
    padding-left: 0;
    text-align: left;
  }

  tbody tr td:not(:first-child) {
    text-align: right;
  }

  td {
    color: var(--color-gray-shade-darkest);
  }
  thead tr th:nth-child(1) {
    min-width: 38vw;
  }

  @media (min-width: 768px) {
  thead tr th:nth-child(1) {
    min-width: 22vw;
  }
  }
  @media (min-width: 1200px) {
    thead tr th:nth-child(1) {
      min-width: 14.5rem;
    }

    /* td { */
    /*   min-width: 9rem; */
    /* } */
  }
</style>
