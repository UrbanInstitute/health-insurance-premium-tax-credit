import { readable, writable } from "svelte/store";
import { scaleThreshold } from "d3";
import { urbanColors } from "@urbaninstitute/dataviz-components/utils";
import { format } from "d3";

export const config = readable({
  columnLabels: {
    perc_change_in_uninsured: "Percent change in individuals who are uninsured",
    perc_change_in_marketplace_wPTC:
      "Percent change in individuals who are covered by subsidized Marketplace plans"
  },
  tooltipLabels: {
    perc_change_in_uninsured: "uninsured",
    perc_change_in_marketplace_wPTC: "covered by subsidized Marketplace plans"
  },
  colorScales: {
    perc_change_in_uninsured: /** @type {typeof scaleThreshold<number, string, string>} */ (
      scaleThreshold
    )()
      .domain([0.1, 0.2, 0.3, 0.4])
      .range(urbanColors.getMapBlues())
      .unknown(urbanColors.gray),
    perc_change_in_marketplace_wPTC: /** @type {typeof scaleThreshold<number, string, string>} */ (
      scaleThreshold
    )()
      .domain([-0.7, -0.5, -0.3, -0.2])
      .range(urbanColors.getMapBlues().reverse())
      .unknown(urbanColors.gray)
  },
  map: {
    stroke: urbanColors.white,
    hoverStroke: urbanColors.yellow,
    strokeWidth: 1,
    hoverStrokeWidth: 5,
    fontColor: urbanColors.gray_shade_darkest,
    fontWeight: "bold",
    fontSize: 18
  },
  format: {
    percent: (/** @type {string | number | null } */ d, naLabel = "N/A") => {
      return d !== null ? (typeof d === "string" ? d : format(".0%")(d)) : naLabel;
    },
    percentNum: (/** @type {string | number | null } */ d, naLabel = "N/A") => {
      return d !== null ? (typeof d === "string" ? d : format(".0f")(d * 100)) : naLabel;
    },
    number: (/** @type {string | number | null } */ d, /** @type {string} */ naLabel = "N/A") => {
      return d ? (typeof d === "string" ? d : format(",.0f")(d)) : naLabel;
    }
  }
});

export const windowWidth = writable(375);
