<script lang="ts">
  interface Props {
    title: string;
    date: string;
    tags: string[];
    description: string;
    wordCount: number;
    href: string;
  }
  let { title, date, tags, description, wordCount, href }: Props = $props();

  const readingTime = $derived(Math.max(1, Math.round(wordCount / 200)));
</script>

<section
  class="pt-[6.4rem] pb-[4.8rem] px-[2.4rem] sm:px-[4.8rem] max-w-[1200px] mx-auto"
>
  <div
    class="animate-fade-in-up flex items-center gap-[1.6rem] text-[1.4rem] text-muted mb-[3.2rem]"
  >
    <time>{date}</time>
    <span>·</span>
    {#each tags.slice(0, 3) as tag}
      <span class="text-sub">{tag}</span>
    {/each}
    <span>·</span>
    <span>{readingTime}min read</span>
  </div>
  <a {href} class="block no-underline text-inherit group">
    <h1
      class="animate-fade-in-up anim-delay-1 text-[4.8rem] sm:text-[5.6rem] font-semibold text-basic leading-[1.2] mb-[3.2rem] group-hover:text-hl transition-colors"
      style="word-break: keep-all; letter-spacing: -0.5px;"
    >
      {title}
    </h1>
    {#if description}
      <p
        class="animate-fade-in-up anim-delay-2 text-[1.8rem] text-muted leading-[1.7] max-w-[700px] mb-[3.2rem]"
      >
        {description}
      </p>
    {/if}
    <span
      class="animate-fade-in-up anim-delay-3 inline-block text-[1.6rem] text-hl font-semibold group-hover:underline"
    >
      Read more →
    </span>
  </a>
</section>
