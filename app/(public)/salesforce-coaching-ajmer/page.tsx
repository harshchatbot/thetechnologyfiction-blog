import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/layout/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/utils/format";

export const metadata = buildMetadata({
  title: "Salesforce Coaching in Ajmer | Online Salesforce Training Across India",
  description:
    "Expert Salesforce coaching and mentorship for learners in Ajmer and online across India, with roadmap guidance, real projects, and interview preparation.",
  path: "/salesforce-coaching-ajmer"
});

const faqItems = [
  {
    q: "Do you provide Salesforce coaching in Ajmer offline?",
    a: "Yes. Coaching supports learners in Ajmer, Rajasthan. Sessions are primarily online for flexibility, with offline arrangements possible when needed."
  },
  {
    q: "Is this suitable for non-IT and career switchers?",
    a: "Yes. The program is structured to help beginners and career switchers build foundations first, then move into projects, interview prep, and job-focused execution."
  },
  {
    q: "What topics are covered?",
    a: "Core Admin concepts, security, data modeling, Flows, Apex, LWC, data migration strategy, portfolio framing, and interview preparation."
  },
  {
    q: "Do you also provide online coaching outside Ajmer?",
    a: "Yes. The coaching model is designed for online delivery across India, with live guidance and a personalized roadmap."
  }
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a
    }
  }))
};

export default function SalesforceCoachingAjmerPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <div className="pb-20">
        <section className="border-b border-slate-200/70 bg-white/70">
          <Container className="py-16 sm:py-20">
            <div className="max-w-4xl">
              <p className="text-xs uppercase tracking-[0.24em] text-steel">
                Mentorship
              </p>
              <h1 className="mt-4 font-[var(--font-serif)] text-5xl leading-tight text-ink sm:text-6xl">
                Salesforce Coaching and Mentorship in Ajmer
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
                Learn Salesforce through live mentorship, real project thinking,
                and structured guidance for freshers, working professionals, and
                career switchers across Ajmer and India.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="https://wa.me/917976111087"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-[#15803d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#166534]"
                >
                  Chat on WhatsApp
                </a>
                <a
                  href="mailto:hello@thetechnologyfiction.com?subject=Salesforce%20Coaching%20Inquiry"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent"
                >
                  Book a free 15-minute call
                </a>
              </div>
            </div>
          </Container>
        </section>

        <Container className="mt-16 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <section className="space-y-10">
            <div className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-8 shadow-soft">
              <h2 className="text-3xl font-semibold text-ink">
                Why learn Salesforce now
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                Salesforce remains one of the strongest ecosystems for building
                a high-value career in CRM, enterprise automation, consulting,
                and platform development. The right coaching compresses the time
                between learning and employable execution.
              </p>
            </div>

            <div className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-8 shadow-soft">
              <h2 className="text-3xl font-semibold text-ink">
                What the coaching covers
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  "Salesforce Admin fundamentals and security",
                  "Apex, triggers, and LWC foundations",
                  "Data migration strategy and execution",
                  "Project framing, resume, and interview prep",
                  "Career-switcher learning roadmaps",
                  "Technical judgment for real client work"
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[1.5rem] border border-slate-200 bg-[#f9f6f1] px-4 py-4 text-sm text-slate-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-8 shadow-soft">
              <h2 className="text-3xl font-semibold text-ink">
                Who this is for
              </h2>
              <ul className="mt-5 space-y-3 text-base leading-8 text-slate-600">
                <li>Freshers starting a technical career</li>
                <li>Non-IT professionals switching into Salesforce</li>
                <li>Admins and developers trying to level up faster</li>
                <li>Professionals preparing for stronger roles and interviews</li>
              </ul>
            </div>
          </section>

          <aside className="space-y-8">
            <div className="rounded-[2rem] bg-[#101b2d] p-8 text-white shadow-soft">
              <p className="text-xs uppercase tracking-[0.24em] text-[#d8bc80]">
                Delivery format
              </p>
              <h2 className="mt-4 text-3xl font-semibold">
                Ajmer-based mentorship with online delivery across India
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                The model is optimized for consistency and depth. Most sessions
                are online, with Ajmer-based support and offline arrangements
                where practical.
              </p>
            </div>

            <div className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-ink">FAQs</h2>
              <div className="mt-6 space-y-4">
                {faqItems.map((item) => (
                  <details
                    key={item.q}
                    className="rounded-[1.5rem] border border-slate-200 bg-[#f9f6f1] p-5"
                  >
                    <summary className="cursor-pointer list-none text-base font-semibold text-ink">
                      {item.q}
                    </summary>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-ink">
                Book a free career call
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Start with a short conversation about your background, current
                skill level, and the role you want next.
              </p>
              <div className="mt-6 space-y-3">
                <a
                  href="https://wa.me/917976111087"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#15803d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#166534]"
                >
                  WhatsApp now
                </a>
                <a
                  href={absoluteUrl("/#newsletter")}
                  className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent"
                >
                  Join Inner Circle first
                </a>
              </div>
            </div>
          </aside>
        </Container>
      </div>
    </>
  );
}
