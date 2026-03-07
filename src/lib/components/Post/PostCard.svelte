<script lang="ts">
  interface Props {
    href: string;
    title?: string;
    date?: string;
    tags?: string[];
    description?: string;
  }
  let { href, title, date, tags, description }: Props = $props();
</script>

<a
  {href}
  class="block p-[2rem] min-h-[160px] no-underline text-inherit cursor-pointer group hover:-translate-y-[2px] transition-all duration-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
>
  <div class="flex flex-wrap gap-[0.6rem] mb-[1rem]">
    {#each tags?.slice(0, 2) ?? [] as tag}
      <span
        class="text-[1.1rem] text-muted font-medium px-[0.6rem] py-[0.2rem] bg-[rgba(0,0,0,0.04)] rounded-[4px]"
        >{tag}</span
      >
    {/each}
  </div>
  <h3
    class="text-[1.8rem] leading-[1.4] font-bold overflow-hidden line-clamp-2 group-hover:text-hl transition-colors"
    style="word-spacing: -0.2rem;"
  >
    {title}
  </h3>
  {#if description}
    <p class="text-[1.3rem] leading-[1.6] text-muted mt-[0.8rem] line-clamp-2">
      {description}
    </p>
  {/if}
  <div class="mt-[1.2rem]">
    <span class="text-[1.2rem] text-muted font-medium">{date}</span>
  </div>
</a>
