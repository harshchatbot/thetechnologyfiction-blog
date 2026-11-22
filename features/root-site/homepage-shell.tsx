import Link from "next/link";
import type { Category, Post } from "@/types/content";
import { Container } from "@/components/layout/container";
import { ArticleCard } from "@/components/blog/article-card";
import { TopicGrid } from "@/components/blog/topic-grid";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { ExternalImage } from "@/components/blog/external-image";

export function HomepageShell({ latestPosts, categories }: { latestPosts: Post[]; categories: Category[] }) {
  const featured = latestPosts[0];
  const others = latestPosts.filter(post => post.id !== featured?.id).slice(0, 6);
  return <main className="overflow-hidden pb-20">
    <section id="about" className="relative isolate overflow-hidden bg-[#191b1e] text-[#f5f3ef]">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-12 h-[360px] w-[360px] rounded-full border border-[#c6d88b]/20 sm:right-[-8%] sm:h-[580px] sm:w-[580px] lg:right-[2%] lg:top-[-10%] lg:h-[740px] lg:w-[740px]">
        <div className="absolute inset-[15%] rounded-full border border-[#c6d88b]/20" />
        <div className="absolute inset-[32%] rounded-full border border-[#c6d88b]/25 bg-[#c6d88b]/[0.04]" />
        <div className="absolute left-[12%] top-[26%] h-2 w-2 rounded-full bg-[#c6d88b]" />
      </div>
      <Container className="relative flex min-h-[520px] flex-col justify-center py-20 sm:min-h-[610px] sm:py-24 lg:min-h-[670px]">
        <p className="editorial-reveal text-xs font-semibold uppercase tracking-[0.28em] text-[#c6d88b]">The Technology Fiction / Salesforce learning</p>
        <h1 className="editorial-reveal mt-7 max-w-[900px] font-[var(--font-serif)] text-[clamp(3.1rem,8vw,7.5rem)] leading-[1.04] tracking-[-0.055em]">Understand more.<br /><span className="italic text-[#c6d88b]">Build better.</span></h1>
        <p className="editorial-reveal mt-8 max-w-xl text-base leading-8 text-[#d1d3d3] sm:text-lg">Practical Salesforce knowledge, real-world engineering lessons, and a clearer path from learning to doing.</p>
        <div className="editorial-reveal mt-9 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm font-semibold">
          <TrackedLink href="/blog" eventName="blog_cta_click" eventParams={{ placement: "hero" }} className="inline-flex items-center gap-2 border-b border-[#c6d88b] pb-2 text-[#f5f3ef] hover:text-[#c6d88b]">Explore the journal <span aria-hidden="true">↗</span></TrackedLink>
          <TrackedLink href="/salesforce-coaching-ajmer" eventName="training_cta_click" eventParams={{ placement: "hero" }} className="inline-flex items-center gap-2 border-b border-white/30 pb-2 text-[#f5f3ef] hover:text-[#c6d88b]">Learn Salesforce <span aria-hidden="true">↗</span></TrackedLink>
        </div>
        <div className="mt-16 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/15 pt-5 text-xs uppercase tracking-[0.14em] text-[#aeb4b5] sm:mt-24"><span>Learn</span><span className="text-[#c6d88b]">✳</span><span>Practice</span><span className="text-[#c6d88b]">✳</span><span>Grow</span></div>
      </Container>
    </section>

    <Container id="latest" className="scroll-mt-28 pt-16 sm:pt-24">
      <div className="mb-9 flex flex-wrap items-end justify-between gap-4 border-b border-slate-300 pb-5">
        <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#667b36]">The journal</p><h2 className="mt-3 font-[var(--font-serif)] text-4xl tracking-tight text-ink sm:text-6xl">Ideas worth exploring.</h2></div>
        <Link href="/blog" className="pb-1 text-sm font-semibold text-ink hover:text-[#667b36]">All articles ↗</Link>
      </div>
      {featured ? <div className="grid gap-7 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-center lg:gap-12">
        <Link href={`/blog/${featured.slug}`} className="group block aspect-[16/10] overflow-hidden bg-[#e6e4dd]">
          {featured.featuredImage ? <ExternalImage src={featured.featuredImage.url} alt={featured.featuredImage.alt} className="h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.025]" /> : <div className="flex h-full items-center justify-center bg-[#25292b] font-[var(--font-serif)] text-5xl italic text-[#c6d88b]">TTF.</div>}
        </Link>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#667b36]">Featured / {featured.category.name}</p>
          <h3 className="mt-4 font-[var(--font-serif)] text-3xl leading-[1.14] tracking-tight text-ink sm:text-4xl xl:text-5xl"><Link href={`/blog/${featured.slug}`} className="hover:text-[#667b36]">{featured.title}</Link></h3>
          <p className="mt-5 line-clamp-3 text-base leading-8 text-slate-600">{featured.excerpt}</p>
          <Link href={`/blog/${featured.slug}`} className="mt-7 inline-block border-b border-ink pb-2 text-sm font-semibold hover:text-[#667b36]">Read the story ↗</Link>
        </div>
      </div> : <p className="py-12 text-slate-600">New stories are on the way.</p>}
      {others.length > 0 && <div className="mt-12 grid gap-x-12 gap-y-7 border-t border-slate-300/70 pt-9 lg:mt-16 lg:grid-cols-2">{others.map(post => <ArticleCard key={post.id} post={post} />)}</div>}
    </Container>

    <section className="mt-20 bg-[#e9e9e1] py-16 sm:mt-28 sm:py-24">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-end">
        <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#667b36]">Learn with purpose</p><h2 className="mt-5 max-w-2xl font-[var(--font-serif)] text-4xl leading-[1.1] tracking-tight text-ink sm:text-6xl">Real experience.<br /><span className="italic">Practical teaching.</span></h2></div>
        <div><p className="max-w-lg text-base leading-8 text-slate-700">Salesforce guidance informed by over a decade of hands-on enterprise development and solution design. Built for fresh graduates, career switchers, and developers who want to understand the why behind the code.</p><Link href="/salesforce-coaching-ajmer" className="mt-7 inline-block border-b border-ink pb-2 text-sm font-semibold text-ink hover:text-[#667b36]">Explore Salesforce training ↗</Link></div>
      </Container>
    </section>

    <Container id="products" className="scroll-mt-28 py-16 sm:py-24">
      <div className="grid gap-8 border-b border-slate-300 pb-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-end">
        <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#667b36]">From learning to doing</p><h2 className="mt-4 font-[var(--font-serif)] text-4xl leading-tight tracking-tight text-ink sm:text-6xl">Meet OrgReady<span className="text-[#667b36]">.</span></h2></div>
        <div><p className="text-base leading-8 text-slate-700">A completely free Salesforce practice platform developed by experienced Technical Architects. Learn here, then put your knowledge to work.</p><a href="https://orgready.in" target="_blank" rel="noopener noreferrer" className="mt-6 inline-block border-b border-ink pb-2 text-sm font-semibold text-ink hover:text-[#667b36]">Start practicing for free ↗</a></div>
      </div>
    </Container>

    {categories.length > 0 && <Container id="topics" className="scroll-mt-28 pb-10"><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><h2 className="font-[var(--font-serif)] text-3xl tracking-tight text-ink sm:text-5xl">Follow your curiosity.</h2><Link href="/blog" className="text-sm font-semibold hover:text-[#667b36]">Browse the journal ↗</Link></div><TopicGrid categories={categories} /></Container>}
  </main>;
}
