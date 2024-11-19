import { error } from "@sveltejs/kit";
import site_content from "../../data/site_content.json";

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
  try {
    const resp = await fetch("../data/states_data.json");
    const data = await resp.json();
    return {
      states_data: data,
      site_content
    };
  } catch {
    error(500, "Error loading state data");
  }
}
