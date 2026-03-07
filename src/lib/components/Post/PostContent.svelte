<script lang="ts">
  import type { Snippet } from "svelte";
  import { onMount } from "svelte";
  import Giscus from "$lib/components/Giscus/Giscus.svelte";
  import PostCard from "$lib/components/Post/PostCard.svelte";
  import { reveal } from "$lib/actions/reveal";
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import { toast } from "svelte-sonner";

  interface RelatedPost {
    slug: string;
    title: string;
    date: string;
    tags: string[];
    description: string;
    href: string;
  }
  interface Props {
    title: string;
    date: string;
    tags: string[];
    relatedPosts?: RelatedPost[];
    children: Snippet;
  }
  let { title, date, tags, relatedPosts = [], children }: Props = $props();

  let containerEl: HTMLDivElement;
  let stickyEl: HTMLDivElement;
  let titleWrapEl: HTMLDivElement;
  let titleEl: HTMLHeadingElement;
  let contentEl: HTMLDivElement;

  onMount(() => {
    // 코드 블록 클릭 시 클립보드 복사 + 토스트
    function onCodeClick(e: MouseEvent) {
      const pre = (e.target as HTMLElement).closest("pre");
      if (!pre) return;
      const code = pre.querySelector("code");
      const text = code?.textContent ?? pre.textContent ?? "";
      navigator.clipboard.writeText(text);
      toast.success("복사되었습니다.");
    }
    contentEl.addEventListener("click", onCodeClick);
    gsap.registerPlugin(ScrollTrigger);

    // Header: 스크롤 delta에 비례해서 scrub 방식으로 숨김/표시
    const header = document.querySelector("header") as HTMLElement | null;

    if (header) {
      const headerH = header.offsetHeight;
      let lastScrollY = window.scrollY;
      let headerY = 0;

      // 초기 상태: 제목 영역을 헤더 높이만큼 아래로 (-1px로 틈새 제거)
      stickyEl.style.top = `${headerH - 1}px`;

      function onScroll() {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY;

        // 스크롤 delta만큼 헤더 위치 조정 (scrub 효과)
        headerY = Math.max(-headerH, Math.min(0, headerY - delta));

        header!.style.transform = `translateY(${headerY}px)`;
        stickyEl.style.top = `${headerH + headerY - 1}px`;

        lastScrollY = currentY;
      }

      window.addEventListener("scroll", onScroll, { passive: true });

      // Title: 스크롤에 비례해서 scale 축소 (8rem 고정, 0.375 = 3/8)
      const titleH = titleWrapEl.offsetHeight;
      const st = {
        trigger: containerEl,
        start: "top top",
        end: "+=300",
        scrub: true,
      };
      gsap.to(titleEl, {
        scale: 0.375,
        transformOrigin: "center top",
        ease: "none",
        scrollTrigger: st,
      });
      gsap.to(titleWrapEl, {
        height: titleH * 0.375,
        ease: "none",
        scrollTrigger: { ...st },
      });

      return () => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
        window.removeEventListener("scroll", onScroll);
        contentEl.removeEventListener("click", onCodeClick);
        header!.style.transform = "";
        stickyEl.style.top = "";
      };
    }

    // Header가 없는 경우 Title 애니메이션만
    const titleH = titleWrapEl.offsetHeight;
    const st = {
      trigger: containerEl,
      start: "top top",
      end: "+=300",
      scrub: true,
    };
    gsap.to(titleEl, {
      scale: 0.375,
      transformOrigin: "center top",
      ease: "none",
      scrollTrigger: st,
    });
    gsap.to(titleWrapEl, {
      height: titleH * 0.375,
      ease: "none",
      scrollTrigger: { ...st },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      contentEl.removeEventListener("click", onCodeClick);
      toast.remove();
    };
  });
</script>

<div bind:this={containerEl} class="post-container mx-auto">
  <!-- 제목 + 메타 + 구분선: sticky 영역 -->
  <div
    bind:this={stickyEl}
    class="sticky -top-px z-[1040] bg-bg/80 backdrop-blur-[20px]"
  >
    <!-- 글 제목: 대형 중앙 정렬, 스크롤 시 축소 -->
    <div
      bind:this={titleWrapEl}
      class="flex justify-center px-[2.4rem] sm:px-[4.8rem] py-[1.6rem] overflow-hidden"
    >
      <h1
        bind:this={titleEl}
        class="text-basic font-black leading-[1.1] max-w-[900px]"
        style="word-break: keep-all; letter-spacing: -1px; text-align: center; font-size: 8rem;"
      >
        {title}
      </h1>
    </div>
    <!-- Metadata bar -->
    <div
      class="flex items-center justify-between px-[2.4rem] sm:px-[4.8rem] pb-[1.2rem] text-[1.3rem] text-muted"
    >
      <div class="flex items-center gap-[1.6rem]">
        <time>{date}</time>
      </div>
      <div class="flex items-center gap-[1.2rem]">
        {#each tags as tag}
          <span>{tag}</span>
        {/each}
      </div>
    </div>
    <!-- 구분선 -->
    <hr class="border-border" />
  </div>
  <!-- Content body -->
  <div
    bind:this={contentEl}
    class="post-content max-w-[800px] mx-auto px-[2.4rem] pb-[6.4rem]"
  >
    {@render children()}
    <Giscus />
  </div>
  {#if relatedPosts.length > 0}
    <section
      class="px-[2.4rem] sm:px-[4.8rem] pt-[4.8rem] pb-[9.6rem] border-t-2 border-border"
    >
      <h2 use:reveal class="text-[3.2rem] font-bold text-basic mb-[3.2rem]">
        다른 글 더 보기
      </h2>
      <ul class="grid grid-cols-1 md:grid-cols-3 gap-[2.4rem]">
        {#each relatedPosts as post, i (post.slug)}
          <li
            use:reveal={{ delay: i * 100 }}
            class="border border-border rounded-[1.2rem] overflow-hidden bg-white"
          >
            <PostCard
              href={post.href}
              title={post.title}
              date={post.date}
              tags={post.tags}
              description={post.description}
            />
          </li>
        {/each}
      </ul>
    </section>
  {/if}
</div>

<style>
  :global(.post-content h1) {
    color: var(--color-basic);
    font-size: 3.6rem;
    font-weight: 700;
    letter-spacing: -0.3px;
    margin: 6.4rem 0 2.4rem;
  }
  :global(.post-content h2) {
    font-size: 3.2rem;
    font-weight: 600;
    letter-spacing: -0.3px;
    margin: 6.4rem 0 2.4rem;
  }
  :global(.post-content h3) {
    font-size: 2.4rem;
    font-weight: 600;
    margin: 4.8rem 0 1.6rem;
  }
  :global(.post-content h4) {
    font-size: 2rem;
    font-weight: 600;
    margin: 3.2rem 0 1.6rem;
  }
  :global(.post-content a) {
    display: block;
    color: var(--color-hl);
  }
  :global(.post-content p) {
    font-size: 1.8rem;
    line-height: 1.7;
    color: var(--color-basic);
    margin-bottom: 2.4rem;
  }
  :global(.post-content p a) {
    display: inline;
    color: var(--color-hl);
  }
  :global(.post-content p code) {
    color: var(--color-hl-light);
    background-color: rgba(0, 0, 0, 0.04);
    padding: 0.2rem 0.6rem;
    border-radius: 4px;
    font-size: 1.6rem;
  }
  :global(.post-content img) {
    width: 100%;
    border-radius: 1.2rem;
    margin-bottom: 3.2rem;
  }
  :global(.post-content ol) {
    margin-left: 2.4rem;
  }
  :global(.post-content ol li) {
    list-style: auto;
  }
  :global(.post-content ol li ul) {
    margin: 0;
    margin-left: 1.6rem;
  }
  :global(.post-content ol li ul li) {
    list-style: disc;
    padding-left: 1.6rem;
  }
  :global(.post-content ul),
  :global(.post-content ol) {
    margin-bottom: 2.4rem;
  }
  :global(.post-content ul li),
  :global(.post-content ol li) {
    font-size: 1.6rem;
    line-height: 1.7;
    margin-bottom: 0.8rem;
  }
  :global(.post-content ul li ul li),
  :global(.post-content ul li ol li),
  :global(.post-content ol li ul li),
  :global(.post-content ol li ol li) {
    padding-left: 1.2rem;
  }
  :global(.post-content blockquote) {
    word-break: keep-all;
    margin: 1.2rem 0 2.4rem;
    padding: 0;
    background: none;
    border: none;
    font-style: italic;
    font-size: 1.8rem;
    line-height: 1.7;
    color: var(--color-basic);
    background-color: var(--color-white);
    padding: 1.6rem;
    border-radius: 1.2rem;
  }
  :global(.post-content blockquote p) {
    margin: 0;
    font-style: italic;
  }
  :global(.post-content pre) {
    position: relative;
    padding: 2.4rem;
    border-radius: 1.2rem;
    overflow-x: auto;
    margin-bottom: 3.2rem;
    line-height: 1.7;
    cursor: pointer;
    transition: opacity 0.15s;
  }
  :global(.post-content pre:hover) {
    opacity: 0.85;
  }
  :global(.post-content pre code) {
    background-color: transparent;
    padding: 0;
    color: inherit;
  }
  :global(.post-content code) {
    font-size: 1.4rem;
    letter-spacing: -0.01rem;
  }
  :global(.post-content .embeded-video) {
    width: 100%;
    margin: 0 auto;
    aspect-ratio: 16 / 9;
    border-radius: 1.2rem;
    overflow: hidden;
    margin-bottom: 3.2rem;
  }
  :global(.post-content .embeded-video iframe) {
    width: 100%;
    height: 100%;
  }

  @media (max-width: 450px) {
    :global(.post-content h1) {
      font-size: 2.8rem;
      line-height: 1.2;
    }
    :global(.post-content h2) {
      font-size: 2.4rem;
      line-height: 1.2;
    }
    :global(.post-content h3) {
      font-size: 2rem;
      line-height: 1.2;
    }
    :global(.post-content h4) {
      font-size: 1.8rem;
      line-height: 1.2;
    }
    :global(.post-content h5) {
      font-size: 1.6rem;
      line-height: 1.2;
    }
  }
</style>
