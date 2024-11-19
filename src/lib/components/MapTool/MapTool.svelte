<script>
  import { Block, BasicDropdown, logClickToGA } from "@urbaninstitute/dataviz-components";
  import { setContext } from "svelte";
  import { readable, derived } from "svelte/store";
  import InfoBox from "$lib/components/InfoBox/InfoBox.svelte";
  import InfoTable from "$lib/components/InfoTable/InfoTable.svelte";
  import DetailHeader from "$lib/components/DetailHeader/DetailHeader.svelte";
  import MapComponent from "$lib/components/Map/Map.svelte";
  import { config, windowWidth } from "$lib/stores/config.js";
  import { page } from "$app/stores";

  let currentMetric = "perc_change_in_uninsured";

  /** @type {string | undefined} */
  let currentState;

  /** @typedef {import("$lib/../types").StateData} StateData */
  /** @type {StateData[]} */
  export let data;

  const dataMetrics = [
    {
      value: "perc_change_in_uninsured",
      label: "uninsured"
    },
    {
      value: "perc_change_in_marketplace_wPTC",
      label: "covered by subsidized Marketplace plans"
    }
  ];

  const dataStore = readable(data);

  const stateFipsLookup = derived(dataStore, (data) => {
    return data.reduce((acc, curr) => {
      return acc.set(curr.fips, curr.name);
    }, new Map());
  });

  const stateDropdownData = Array.from($stateFipsLookup.entries()).map(([fips, name]) => ({
    value: fips,
    label: name
  }));

  /**
   * @param {string} originalText
   * @param {string} state
   * @returns {string}
   */
  function getStateIncomeDescription(originalText, state) {
    if (state === "02") {
      let newText = originalText.replace(
        "(FPL; $30,660 for a family of two in 2024)",
        "(FPL; $38,310 for an Alaskan family of two in 2024)"
      );
      newText = newText.replace(
        "($28,207 for a family of two in 2024)",
        "($35,245.20 for an Alaskan family of two in 2024)"
      );
      return newText;
    }
    if (state === "15") {
      let newText = originalText.replace(
        "(FPL; $30,660 for a family of two in 2024)",
        "(FPL; $35,250 for a Hawaiian family of two in 2024)"
      );
      newText = newText.replace(
        "($28,207 for a family of two in 2024)",
        "($32,430 for a Hawaiian family of two in 2024)"
      );
      return newText;
    }
    return originalText;
  }

  $: currentStateName = $stateFipsLookup.get(currentState);

  $: setContext("mapTool", {
    data: dataStore,
    stateFipsLookup: stateFipsLookup
  });

  $: currentStateData = data.find((d) => d.fips === currentState);

  $: incomeTableData = currentStateData
    ? [
        {
          "Federal poverty level": "Less than 138 percent",
          Uninsured: currentStateData.num_unins_138_FPL,
          Marketplace: currentStateData.num_marketplace_wPTC_138_FPL
        },
        {
          "Federal poverty level": "138&ndash;200 percent",
          Uninsured: currentStateData.num_unins_138_200_FPL,
          Marketplace: currentStateData.num_marketplace_wPTC_138_200_FPL
        },
        {
          "Federal poverty level": "200&ndash;400 percent",
          Uninsured: currentStateData.num_unins_200_400_FPL,
          Marketplace: currentStateData.num_marketplace_wPTC_200_400_FPL
        },
        {
          "Federal poverty level": "Above 400 percent",
          Uninsured: currentStateData.num_unins_400_FPL,
          Marketplace: currentStateData.num_marketplace_wPTC_400_FPL
        }
      ]
    : [];

  $: raceTableData = currentStateData
    ? [
        {
          "Race/ethnicity": "Black",
          Uninsured: currentStateData.num_unins_black_nh,
          Marketplace: currentStateData.num_marketplace_wPTC_black_nh
        },
        {
          "Race/ethnicity": "Hispanic",
          Uninsured: currentStateData.num_unins_hispanic,
          Marketplace: currentStateData.num_marketplace_wPTC_hispanic
        },
        {
          "Race/ethnicity": "Additional races and ethnicities",
          Uninsured: currentStateData.num_unins_anyother_nh,
          Marketplace: currentStateData.num_marketplace_wPTC_anyother_nh
        },
        {
          "Race/ethnicity": "White",
          Uninsured: currentStateData.num_unins_white_nh,
          Marketplace: currentStateData.num_marketplace_wPTC_white_nh
        }
      ]
    : [];

  $: ageTableData = currentStateData
    ? [
        {
          "Age group": "Children",
          Uninsured: currentStateData.num_unins_children,
          Marketplace: currentStateData.num_marketplace_wPTC_children
        },
        {
          "Age group": "19&ndash;34",
          Uninsured: currentStateData.num_unins_age_19_34,
          Marketplace: currentStateData.num_marketplace_wPTC_age_19_34
        },
        {
          "Age group": "35&ndash;54",
          Uninsured: currentStateData.num_unins_age_35_54,
          Marketplace: currentStateData.num_marketplace_wPTC_age_35_54
        },
        {
          "Age group": "55&ndash;64",
          Uninsured: currentStateData.num_unins_age_55_64,
          Marketplace: currentStateData.num_marketplace_wPTC_age_55_64
        }
      ]
    : [];

  /**
   * @param {CustomEvent<{props: {fips: string}}>} e
   */
  function handleStateSelect(e) {
    if (e.detail) {
      const { fips } = e.detail.props;
      currentState = fips;
    } else {
      currentState = undefined;
    }
  }

  /**
   * @param {string} metric
   * @param {number} maxWidth
   */
  function getDropdownWidth(metric, maxWidth) {
    if (metric === "perc_change_in_marketplace_wPTC") {
      return Math.min(500, maxWidth);
    }
    return Math.min(180, maxWidth);
  }

  /**
   * @param {StateData} stateData
   */
  function getExample(stateData) {
    let direction, val, language;

    /** @type {keyof typeof stateData} */
    let primaryDataKey = "num_unins_200_400_FPL";

    /** @type {keyof typeof stateData} */
    let secondaryDataKey = "num_marketplace_wPTC_400_FPL";

    if (typeof stateData[primaryDataKey] === "number") {
      val = stateData[primaryDataKey];
      language = "uninsured people living between 200 percent and 400 percent of FPL";
    } else {
      val = stateData[secondaryDataKey];
      language = "people covered by subsidized Marketplace plans living above 400 percent of FPL";
    }
    if (val >= 0) {
      direction = "increased";
    } else {
      direction = "decreased";
    }
    let valueLabel = val === 0 ? "<1,000" : $config.format.number(Math.abs(val));

    return `The number of ${language} ${direction} by ${valueLabel}`;
  }
</script>

<Block width="wide">
  <div class="tool-header">
    Percent change in individuals who are <BasicDropdown
      data={dataMetrics}
      variant="secondary-yellow"
      inlineLabel="Select a metric to view"
      id="metric-select"
      placeholder={undefined}
      dropdownWidth={getDropdownWidth(currentMetric, $windowWidth - 48)}
      on:change={(e) => {
        logClickToGA(
          e.target,
          "metric-select--" + e.target.value,
        );
      }}
      bind:value={currentMetric}
    />
  </div>
  <MapComponent {data} metric={currentMetric} on:stateSelect={handleStateSelect} {currentState} />
  <div class="state-details">
    <DetailHeader bind:currentState {stateDropdownData} />
    {#if currentState && currentStateData}
      <div class="info-boxes-wrapper">
        <div class="box-1">
          <InfoBox>
            <h4 class="infobox-header">{$page.data.site_content.detail_blocks[0].subhead}</h4>
            <div class="infobox-number-wrap">
              {#if currentStateData.num_change_in_uninsured !== 0}
                <p class="infobox-ban">
                  {$config.format.number(currentStateData.num_change_in_uninsured)}
                </p>
                <p class="infobox-label">
                  {$page.data.site_content.detail_blocks[0].label_a}, an increase of
                  <span class="infobox-number-highlight"
                    >{$config.format.percentNum(currentStateData.perc_change_in_uninsured)} percent</span
                  > in uninsurance.
                </p>
              {:else}
                <p class="infobox-label">
                  {currentStateName} does not show any meaningful change in health insurance coverage.
                </p>
              {/if}
            </div>
            <div class="infobox-number-wrap">
              <p class="infobox-ban">
                {$config.format.number(-currentStateData.num_change_in_marketplace_wPTC)}
              </p>
              <p class="infobox-label">
                {$page.data.site_content.detail_blocks[0].label_b}, a decrease of
                <span class="infobox-number-highlight"
                  >{$config.format.percentNum(
                    Math.abs(currentStateData.perc_change_in_marketplace_wPTC)
                  )} percent</span
                >.
              </p>
            </div>
          </InfoBox>
        </div>
        <div class="box-2">
          <InfoBox>
            <h4 class="infobox-header">{$page.data.site_content.detail_blocks[2].subhead}</h4>
            <p class="infobox-label">
              {$page.data.site_content.detail_blocks[2].description}
            </p>
            <div class="infobox-number-wrap">
              <p class="infobox-ban">
                {$config.format.number(
                  Math.abs(currentStateData.num_change_in_aca_compliant_nongroup)
                )}
              </p>
              <p class="infobox-label">
                fewer people would enroll in ACA-compliant nongroup coverage.
              </p>
            </div>
            <div class="infobox-number-wrap">
              <p class="infobox-ban">
                {$config.format.number(Math.abs(currentStateData.num_change_in_ESI))}
              </p>
              <p class="infobox-label">more people would elect employer-sponsored coverage.</p>
            </div>
          </InfoBox>
        </div>
        <div class="box-3">
          <InfoBox>
            <h4 class="infobox-header">{$page.data.site_content.detail_blocks[1].subhead}</h4>
            <p class="infobox-label">
              {@html getStateIncomeDescription(
                $page.data.site_content.detail_blocks[1].description,
                currentState
              )}
            </p>
            <p class="infobox-label">
              Example interpretation: <em>{getExample(currentStateData)}</em>
            </p>
            <InfoTable data={incomeTableData} />
            <h4 class="infobox-header">{$page.data.site_content.detail_blocks[1].subhead_b}</h4>
            <InfoTable data={raceTableData} />
            <h4 class="infobox-header">{$page.data.site_content.detail_blocks[1].subhead_c}</h4>
            <InfoTable data={ageTableData} />
          </InfoBox>
        </div>
      </div>
    {:else}
      <div class="info-boxes-wrapper">
        <div class="box-1">
          <InfoBox>
            <h4 class="infobox-header">{$page.data.site_content.detail_blocks[0].subhead}</h4>
            <p>Select a state</p>
          </InfoBox>
        </div>
        <div class="box-2">
          <InfoBox>
            <h4 class="infobox-header">{$page.data.site_content.detail_blocks[2].subhead}</h4>
            <p>Select a state</p>
          </InfoBox>
        </div>
        <div class="box-3">
          <InfoBox>
            <h4 class="infobox-header">{$page.data.site_content.detail_blocks[1].subhead}</h4>
            <p>Select a state</p>
          </InfoBox>
        </div>
      </div>
    {/if}
  </div>
</Block>

<style>
  .tool-header {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--spacing-8);
    text-align: center;
  }
  .tool-header :global(.dropdown-parent) {
    display: inline-block;
  }
  .tool-header :global(.dropdown-container .icons svg) {
    display: block;
  }
  .tool-header :global(select) {
    font-size: var(--font-size-2xl) !important;
  }
  .tool-header :global(select option) {
    font-size: var(--font-size-normal) !important;
  }
  .state-details {
    margin: var(--spacing-8) 0;
  }
  p.infobox-label {
    line-height: var(--line-height-normal) !important;
    font-size: var(--font-size-normal) !important;
  }
  p.infobox-ban {
    font-size: var(--font-size-6xl) !important;
    font-weight: var(--font-weight-light) !important;
    line-height: 0 !important;
  }
  .infobox-header:not(:first-child) {
    margin-top: var(--spacing-8);
  }
  .infobox-number-highlight {
    border-bottom: solid 2px var(--color-yellow);
    font-weight: var(--font-weight-bold);
  }
  @media (min-width: 768px) {
    .info-boxes-wrapper {
      display: grid;
      grid-template-columns: 50% 50%;
      grid-template-rows: auto auto 1fr;
      gap: var(--spacing-2);
    }
    .infobox-header {
      margin-top: 0;
    }
    .box-1 {
      grid-column: 1 / 2;
      grid-row: 1;
    }
    .box-2 {
      grid-column: 1 / 2;
      grid-row: 2;
    }
    .box-3 {
      grid-column: 2;
      grid-row: 1 / 4;
    }
  }
  @media (min-width: 1100px) {
    .infobox-number-wrap {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
    }
    p.infobox-ban {
      text-align: right;
      min-width: 4.5em;
    }
  }
  @media (max-width: 540px) {
    .tool-header :global(select) {
      font-size: var(--font-size-xl) !important;
    }
    .tool-header {
      font-size: var(--font-size-xl) !important;
    }
  }
</style>
