<script>
  import * as topojson from "topojson-client";
  import { createEventDispatcher } from "svelte";
  import topoData from "./states.json";
  import ColorLegend from "$lib/components/ColorLegend/ColorLegend.svelte";
  import Tilemap from "$lib/components/Tilemap/Tilemap.svelte";
  import { urbanColors } from "@urbaninstitute/dataviz-components/utils";
  import { Block, Tooltip, logClickToGA } from "@urbaninstitute/dataviz-components";
  import { config } from "$lib/stores/config.js";

  /**
   * @type { Object[] }
   */
  export let data;

  /**
   * @type { string }
   */
  export let metric;

  export let currentState;

  const dispatch = createEventDispatcher();

  let selectedState;
  let hoveredState;
  let tooltip;

  $: if (currentState) {
    selectedState = currentState;
  }

  $: geoData = topojson.feature(topoData, "foo");

  function joinData(geo, d) {
    return geo.features.map((place) => {
      const match = d.find((row) => row.fips === place.properties.fips);
      if (match) {
        place.properties = Object.assign({}, place.properties, match);
      }
      return place;
    });
  }

  function handleStateClick(e) {
    selectedState = e.detail.props.abbr;
    dispatch("stateSelect", e.detail);
    logClickToGA(
      e.target,
      "tilemap-state-click--" + e.detail.props.name,
    );
  }

  function handleStateHover(e) {
    hoveredState = e.detail.props.abbr;
    tooltip = getTooltipProps(e.detail.e, e.detail.props);
  }

  function onClear() {
    selectedState = "";
    dispatch("stateSelect", selectedState);
  }

  function getTooltipProps(e, props) {
    return {
      x: e.pageX,
      y: e.pageY,
      props: props
    };
  }

  /**
   * Raise a dom node to top of siblings
   * @param { HTMLElement } el The DOM element to raise
   * @returns void
   */
  export function raise(el) {
    if (el.parentNode) {
      el.parentNode.appendChild(el);
    }
  }

  $: currentColorScale = $config.colorScales[metric];
  $: joinedData = joinData(geoData, data);

  function fillFunc(feature, metric) {
    if (typeof feature[metric] === "string") {
      return $config.colorScales[metric](null);
    }
    return $config.colorScales[metric](feature[metric]);
  }
</script>

<div style="max-width: 300px; margin: 1em auto 0;">
  <ColorLegend
    scale={currentColorScale}
    height={16}
    tickLineColor={"white"}
    tickLineWidth={2}
    tickFormat={$config.format.percent}
    margin={{ top: 0, right: 0, bottom: 5, left: 0 }}
  />
</div>
<div class="tile-map">
  <Tilemap
    {data}
    shape="hex"
    fill={(d) => fillFunc(d, metric)}
    strokeWidth={$config.map.strokeWidth}
    highlightFeature={selectedState}
    hoverStroke={$config.map.hoverStroke}
    hoverStrokeWidth={$config.map.hoverStrokeWidth}
    on:bgclick={onClear}
    on:click={handleStateClick}
    on:mousemove={handleStateHover}
    on:mouseout={(e) => (tooltip = undefined)}
  />
</div>
<div class="clear-selection-wrapper">
  <button on:click={(e) => {
      logClickToGA(
        e.target,
        "clear-selection-click"
      );
      onClear();
    }}
    style:visibility={selectedState ? "visible" : "hidden"}
    >Clear state selection</button
  >
</div>
{#if tooltip}
  <Tooltip x={tooltip.x} y={tooltip.y} size="large">
    <h5>{tooltip.props.name}</h5>
    <p>
      <strong>
        {#if tooltip.props[metric] === 0}
        No change
        {:else}
          {typeof tooltip.props[metric] === "number" && tooltip.props[metric] > 0
            ? "+"
            : ""}{$config.format.percent(tooltip.props[metric], "Suppressed")}
          {typeof tooltip.props[metric] === "number" ? $config.tooltipLabels[metric] : ""}
        {/if}
      </strong>
    </p>
  </Tooltip>
{/if}

<style>
  .clear-selection-wrapper {
    display: flex;
    justify-content: flex-end;
  }

  .clear-selection-wrapper button {
    appearance: none;
    border: none;
    background: none;
    color: inherit;
    border-bottom: solid 1px var(--color-gray-shade-darkest);
    font-style: italic;
    cursor: pointer;
    outline: none;
    margin-top: 0.5em;
  }
  .clear-selection-wrapper button:focus {
    outline: var(--color-yellow) solid 2px;
    outline-offset: var(--spacing-2);
  }
</style>
