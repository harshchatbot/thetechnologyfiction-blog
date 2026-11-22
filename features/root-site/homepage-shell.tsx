import Link from "next/link";
import type { Category, Post } from "@/types/content";
import { Container } from "@/components/layout/container";
import { ArticleCard } from "@/components/blog/article-card";
import { ScrollFlythrough } from "@/components/layout/scroll-flythrough";
import { HeroWord, HeroVisual } from "@/components/layout/hero-motion";
import { InnerCircleSignup } from "@/components/layout/inner-circle-signup";
const paths=[{title:"Admin",description:"Start with objects, security, and automation.",q:"admin"},{title:"Developer",description:"Build with Apex, LWC, and integrations.",q:"apex"},{title:"Interview Prep",description:"Practice questions and explain real projects.",q:"interview"},{title:"AI + Agentforce",description:"Understand applied AI in Salesforce.",q:"ai"}];
export function HomepageShell({latestPosts}:{latestPosts:Post[];categories:Category[]}) {
  const featured=latestPosts[0];
  return <div className="pb-20">
    <section className="ttf-hero">
      <Container className="grid min-h-[620px] gap-10 py-16 md:grid-cols-2 md:items-center md:py-24">
        <div className="relative z-10">
          <p className="ttf-eyebrow">The Technology Fiction / Your career starts here</p>
          <h1 className="mt-7 text-[clamp(3.1rem,6vw,6.6rem)] leading-[.99] tracking-[-.035em]">Your first <HeroWord /> job, in six clear steps.</h1>
          <p className="ttf-muted mt-7 max-w-xl text-base leading-8">Practical roadmaps, honest interview prep and real project guidance from a Salesforce Tech Lead with 14 years in IT. Built for freshers and career switchers.</p>
          <div className="mt-9 flex flex-wrap gap-3"><Link className="ttf-button" href="/roadmap">Start the free roadmap ↗</Link><Link className="ttf-button" href="/salesforce-coaching">Get coached ↗</Link></div>
        </div>
        <HeroVisual />
      </Container>
    </section>
    <ScrollFlythrough />
    <div className="border-y" style={{borderColor:"var(--line)"}}><Container className="grid grid-cols-1 gap-5 py-7 text-center sm:grid-cols-3 sm:gap-0"><div><strong className="ttf-gold text-2xl font-light">14</strong><span className="ttf-muted ml-2 text-sm">years in IT</span></div><div><strong className="ttf-gold text-2xl font-light">12</strong><span className="ttf-muted ml-2 text-sm">Salesforce certifications</span></div><div><strong className="ttf-gold text-2xl font-light">30+</strong><span className="ttf-muted ml-2 text-sm">engineers led on one program</span></div></Container></div>
    <Container className="py-16 sm:py-24">
      <p className="ttf-eyebrow">Start where you are</p><h2 className="mt-3 text-5xl sm:text-7xl">Choose your path.</h2>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{paths.map(path=><Link key={path.title} href={`/blog?q=${encodeURIComponent(path.q)}`} className="ttf-card flex min-h-[220px] flex-col justify-between p-6"><span className="ttf-gold text-sm">↗</span><div><h3 className="text-3xl">{path.title}</h3><p className="ttf-muted mt-3 text-sm leading-6">{path.description}</p></div></Link>)}</div>
    </Container>
    <Container id="latest" className="pb-16"><div className="flex flex-wrap items-end justify-between gap-4 border-b pb-5" style={{borderColor:"var(--line)"}}><div><p className="ttf-eyebrow">The journal</p><h2 className="mt-3 text-5xl sm:text-7xl">Recent writing.</h2></div><Link href="/blog" className="ttf-gold text-sm underline underline-offset-8">All articles ↗</Link></div><div className="mt-9 grid gap-x-12 gap-y-8 md:grid-cols-2">{latestPosts.slice(0,6).map(post=><ArticleCard key={post.id} post={post}/>)}</div>{!featured&&<p className="ttf-muted mt-8">New articles are on the way.</p>}</Container>
    <Container id="products" className="grid gap-8 border-y py-14 md:grid-cols-2 md:items-center" style={{borderColor:"var(--line)"}}><div><p className="ttf-eyebrow">Practice for free</p><h2 className="mt-4 text-5xl sm:text-6xl">Meet OrgReady.</h2></div><div><p className="ttf-muted leading-8">A completely free Salesforce practice platform developed by experienced Technical Architects.</p><a className="ttf-button mt-5" href="https://orgready.in" target="_blank" rel="noopener noreferrer">Start practicing ↗</a></div></Container>
    <Container id="newsletter" className="py-16 sm:py-24"><InnerCircleSignup /></Container>
  </div>;
}
