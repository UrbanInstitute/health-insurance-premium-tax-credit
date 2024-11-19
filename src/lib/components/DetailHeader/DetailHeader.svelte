<script>
  import { BasicDropdown, logClickToGA } from "@urbaninstitute/dataviz-components";
  import { config } from "$lib/stores/config.js";
  export let currentState;
  export let stateDropdownData;
</script>

<h3 class="detail-header" style:--highlight-color={$config.map.hoverStroke}>
  <BasicDropdown
    id="detail-header-state-select"
    inlineLabel="Select a state"
    placeholder="Select a state"
    data={stateDropdownData}
    bind:value={currentState}
    on:change={(e) => {
      logClickToGA(
        e.target,
        "state-dropdown-select--" + e.target.value,
      );
    }}
    variant="secondary-yellow"
  />
  {#if currentState}
    <span>by the numbers</span>
  {/if}
</h3>

<style>
  .detail-header {
    display: flex;
    line-height: 1;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    /* justify-content: center; */
    column-gap: var(--spacing-2);
    row-gap: 0.875rem;
    padding-bottom: var(--spacing-4);
  }
  /* make dropdowns sit inline */
  .detail-header :global(.dropdown-parent) {
    display: inline-block !important;
    padding: 0 !important;
    transform: translateY(-1px) !important;
  }
  .detail-header :global(.dropdown-container) {
    width: fit-content !important;
  }
  .detail-header :global(.dropdown-container select) {
    padding-right: var(--spacing-10) !important;
    font-size: var(--font-size-2xl) !important;
    background-color: transparent !important;
    border-color: transparent !important;
    border-bottom: 5px solid var(--highlight-color) !important;
    padding: 0 !important;
    padding-right: var(--spacing-8) !important;
  }

  .detail-header :global(.dropdown-container .icons) {
    padding-right: var(--spacing-1) !important;
    transform: translateY(-1rem);
  }
  @media (max-width: 540px) {
    .detail-header :global(.dropdown-container select) {
      font-size: var(--font-size-xl) !important;
    }
  }
</style>
