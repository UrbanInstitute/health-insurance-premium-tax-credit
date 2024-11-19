<script>
  import { Theme, FontsUrban, Analytics } from "@urbaninstitute/dataviz-components";
  import { windowWidth } from "$lib/stores/config"
</script>

<svelte:window bind:innerWidth={$windowWidth} />
<FontsUrban />
<Analytics title="Who Will Lose Health Insurance if Enhanced Premium Tax Credits Expire?" mode={import.meta.env.MODE} sendPageview={false} />
<Theme>
  <slot />
</Theme>
