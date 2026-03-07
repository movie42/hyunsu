<script lang="ts">
  import "./layout.css";
  import Header from "$lib/components/Header/Header.svelte";
  import { Toaster } from "svelte-sonner";

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

<Toaster
  duration={3000}
  position="bottom-center"
  toastOptions={{
    style: 'background: #22c55e; color: white; border: none;',
  }}
/>
<Header />
{@render children()}
