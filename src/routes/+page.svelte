<script>
  import "@urbaninstitute/dataviz-components/style"; // import _normalize.css and _typography.css (urban-specific classes)
  import {
    Meta,
  } from "@urbaninstitute/dataviz-components";
  import "../app.css"; // import project-specific global styles
  import { getAbsoluteUrl } from "$lib/utils/urls.js";
  import MapTool from "$lib/components/MapTool/MapTool.svelte";

  /** @type {import('./$types').PageData} */
  export let data;

</script>

<Meta
  title={data.site_content.meta.title}
  description={data.site_content.meta.description}
  publishDate={data.site_content.meta.date}
  socialImage={getAbsoluteUrl("social.jpg")}
/>
<main>
  <article>
    <section>
      <MapTool data={data.states_data}></MapTool>
    </section>
  </article>
</main>

