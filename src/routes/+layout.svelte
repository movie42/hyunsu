<script lang="ts">
  import "./layout.css";
  import Header from "$lib/components/Header/Header.svelte";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href="/favicon.png" />
  <link
    rel="alternate"
    type="application/rss+xml"
    title="현수의 블로그"
    href="/feed.xml"
  />
</svelte:head>

<Header />
{@render children()}
