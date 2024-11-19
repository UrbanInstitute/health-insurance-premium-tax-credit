<script>
  import maplayout from "./tilemaplayout.txt?raw";
  import { urbanColors } from "@urbaninstitute/dataviz-components/utils";
  import { createEventDispatcher, afterUpdate } from "svelte";
  import { fipsMap } from "./fips.js";
  import { config } from "$lib/stores/config.js";

  function parseLayout(layoutString) {
    return layoutString.split("\n").map((row) => row.split(","));
  }

  const mapTiles = parseLayout(maplayout);
  const dispatch = createEventDispatcher();

  export let data;

  $: dataLookup = data
    ? data.reduce((acc, curr) => {
        const { fips } = curr;
        return acc.set(fips, curr);
      }, new Map())
    : undefined;

  export let fill = urbanColors.blue;

  export let hoverFill = undefined;

  /**
   * Color to use for values that are NA or otherwise undefined in the color scale
   * @type { string }
   */
  export let naFill = urbanColors.gray_shade_light;

  /**
   * A color string or a function that takes a feature and returns a color string
   * @type { (Object) => string | string } [fill = urbanColors.blue] A string or function that returns a string to use as this layers stroke color.
   */
  export let stroke = urbanColors.white;

  /*
   * Optional color string for hovered feature stroke
   * @type { string }
   */
  export let hoverStroke = undefined;

  /*
   * Stroke width of each feature
   * @type { number } [strokeWidth = 0.5]
   */
  export let strokeWidth = 0.5;

  /*
   * Stroke width of each feature when hovered
   * @type { number } [strokeWidth = undefined]
   */
  export let hoverStrokeWidth = undefined;

  export let highlightFeature = undefined;

  let width = 500;
  $: height = width * 0.66;
  $: shapeWidth = Math.floor(width / mapTiles[0].length);
  $: shapeHeight = getHeight(shapeWidth, shape);

  function getHeight(width, shape) {
    if (shape === "hex") {
      return (width / Math.sqrt(3)) * 2.1;
      // return width * 1.1;
      // return (width / Math.sqrt(3)) * 2;
    }
    return width;
  }

  function generateHex(width, height) {
    const points = [
      [width / 2, 0],
      [width, height / 4],
      [width, (height / 4) * 3],
      [width / 2, height],
      [0, (height / 4) * 3],
      [0, height / 4]
    ];
    return (
      points.reduce((acc, point, i) => {
        acc += `${i > 0 ? "L" : ""} ${point[0]},${point[1]} `;
        return acc;
      }, "M") + "Z"
    );
  }

  function getY(row, shapeHeight) {
    if (shape === "hex") {
      return row * shapeHeight * 0.75;
    } else {
      return row * shapeHeight;
    }
  }

  function getX(column, row, shapeWidth) {
    if (shape === "hex") {
      if (row % 2 !== 0) {
        return column * shapeWidth - shapeWidth * 0.5;
      } else {
        return column * shapeWidth;
      }
    } else {
      return column * shapeWidth;
    }
  }
  function getFill(feature, fill, naFill) {
    if (typeof fill === "string") {
      return fill;
    }
    return fill(feature) || naFill;
  }

  function getFeatureData(abbr) {
    if (!dataLookup) {
      return null;
    }
    const fips = fipsMap.get(abbr);
    return dataLookup.get(fips);
  }

  /**
   * Raise a dom node to top of siblings
   * @param { HTMLElement } el The DOM element to raise
   * @returns void
   */
  export function raise(el) {
    el.parentNode.appendChild(el);
  }

  function handleMousemove(e, state) {
    raise(e.target);
    if (highlightFeatureNode) {
      raise(highlightFeatureNode);
    }

    const props = getFeatureData(state);
    dispatch("mousemove", { e, props });
  }
  function handleClick(e, state) {
    raise(e.target);
    const props = getFeatureData(state);
    dispatch("click", { e, props });
  }

  function handleMouseout(e) {}

  $: hexPoints = generateHex(shapeWidth, shapeHeight);

  // holds highlighted feature DOM element
  let highlightFeatureNode;

  let el;

  $: if (highlightFeatureNode) {
    raise(highlightFeatureNode);
  }

  /** @type { "rect" | "hex"} */
  export let shape = "hex";

  function getHighlight(fips, highlight) {
    return fips === highlight;
  }

  afterUpdate(() => {
    highlightFeatureNode = el.querySelector("path.highlight");
  });

  // @TODO
  // use something like https://gka.github.io/chroma.js/#chroma-contrast
  // to set label color based on background fill
</script>

<div class="tile-map-wrap" bind:clientWidth={width}>
  <svg bind:this={el} {width} {height} viewbox="0 0 {width} {height}">
    <rect
      fill={urbanColors.white}
      x="0"
      y="0"
      {width}
      {height}
      on:mousedown={() => dispatch("bgclick")}
    ></rect>
    <g
      class="tiles"
      style:--hover-fill={hoverFill || null}
      style:--hover-stroke={hoverStroke || null}
      style:--hover-stroke-width={hoverStrokeWidth || strokeWidth}
      class:hover-fill={hoverFill}
    >
      {#each mapTiles as row, rowIndex}
        {#each row as tile, columnIndex}
          {#if tile.trim() !== ""}
            {#if shape === "hex"}
              <path
                class="tile-shape"
                d={hexPoints}
                fill={getFill(getFeatureData(tile), fill, naFill)}
                transform="translate({getX(columnIndex, rowIndex, shapeWidth)}, {getY(
                  rowIndex,
                  shapeHeight
                )})"
                stroke="white"
                role="presentation"
                class:highlight={getHighlight(fipsMap.get(tile), highlightFeature)}
                on:mousemove={(e) => handleMousemove(e, tile)}
                on:mouseout
                on:mousedown={(e) => handleClick(e, tile)}
              ></path>
            {:else if shape === "rect"}
              <rect
                class="tile-shape"
                width={shapeWidth}
                height={shapeHeight}
                transform="translate({getX(columnIndex, rowIndex, shapeWidth)}, {getY(
                  rowIndex,
                  shapeHeight
                )})"
                fill={getFill(getFeatureData(tile), fill, naFill)}
                stroke="white"
                role="presentation"
                class:highlight={getHighlight(fipsMap.get(tile), highlightFeature)}
                on:mousemove={(e) => handleMousemove(e, tile)}
                on:mouseout
                on:click={(e) => handleClick(e, tile)}
              ></rect>
            {/if}
          {/if}
        {/each}
      {/each}
    </g>
    <g class="map-labels" style:--font-weight={$config.map.fontWeight}>
      {#each mapTiles as row, rowIndex}
        {#each row as tile, columnIndex}
          {#if tile.trim() !== ""}
            <g
              class="tile"
              transform="translate({getX(columnIndex, rowIndex, shapeWidth)}, {getY(
                rowIndex,
                shapeHeight
              )})"
              pointer-events="none"
              role="presentation"
            >
              <text
                class="state-label state-label-stroke"
                x={shapeWidth / 2}
                y={shapeHeight / 2}
                dx="-0.7em"
                dy="0.3em"
                fill="white"
                stroke="white"
                stroke-linejoin="round"
              >
                {tile}
              </text>
              <text
                class="state-label"
                x={shapeWidth / 2}
                y={shapeHeight / 2}
                dx="-0.7em"
                dy="0.3em"
                fill={$config.map.fontColor}
              >
                {tile}
              </text>
            </g>
          {/if}
        {/each}
      {/each}
    </g>
  </svg>
</div>

<style>
  .tile-shape {
    cursor: pointer;
  }
  .tile-shape:hover,
  .tile-shape.highlight {
    stroke: var(--hover-stroke);
    stroke-width: var(--hover-stroke-width);
  }
  .hover-fill .tile-shape:hover,
  .hover-fill .tile-shape.highlight {
    fill: var(--hover-fill);
  }
  .tile-shape:focus {
    outline: none;
  }
  .tile text {
    font-weight: var(--font-weight);
  }
  text.state-label {
    font-size: clamp(10px, 1.5vw, var(--font-size-large));
  }
  .state-label-stroke {
    stroke-width: 2;
  }
  @media (min-width: 768px) {
    .state-label-stroke {
      stroke-width: 3;
    }
  }
</style>
