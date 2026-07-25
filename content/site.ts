/* ============================================================================
 * SINGLE SOURCE OF TRUTH FOR EVERY WORD ON THIS SITE.
 *
 * READ THIS BEFORE PUBLISHING
 * ---------------------------
 * The CV could not be reached when this site was built, so every fact below
 * marked `PLACEHOLDER` is a structural stand-in written to the right shape and
 * length. It is NOT real. Replace it before the site goes live.
 *
 * Must-replace list is tracked in CONTENT-TODO.md at the repo root.
 * Nothing outside this file needs editing to change copy.
 * ==========================================================================*/

export const site = {
  name: "Miguel Pedroso",
  role: "Product Designer",
  // PLACEHOLDER: swap for the address you actually want public.
  email: "hello@miguelpedroso.com",
  location: "Lisbon, Portugal",
  url: "https://miguelpedroso.com",
  // PLACEHOLDER: real profile URLs.
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/miguelpedroso" },
    { label: "Dribbble", href: "https://dribbble.com/miguelpedroso" },
    { label: "Read.cv", href: "https://read.cv/miguelpedroso" },
  ],
} as const;

export const nav = [
  { label: "Work", href: "/works" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

/* One label per intent. Used in the nav, every CTA band, and the footer. */
export const cta = {
  primary: { label: "Book a call", href: "/contact" },
  secondary: { label: "View work", href: "/works" },
} as const;

export const home = {
  headline: "I make complex software feel obvious.",
  // 13 words.
  subhead:
    "Product design for software teams whose interface has outgrown its first version.",
  availability: "Taking on two projects for Q4",

  benefits: {
    heading: "What changes when the design is right",
    items: [
      {
        title: "Your team stops rebuilding the same screen",
        body: "Every flow ships with states, edge cases and responsive rules already decided, so engineering builds it once.",
      },
      {
        title: "New users get to value on day one",
        body: "Onboarding and empty states are designed as part of the product, not bolted on after launch.",
      },
      {
        title: "The interface holds as you add features",
        body: "You get a documented system with tokens and components, so the tenth feature looks like the first.",
      },
    ],
  },

  proof: {
    heading: "Teams I have built with",
    // PLACEHOLDER: these numbers must come from your own records.
    stats: [
      { value: "9 years", label: "designing software products" },
      { value: "30+", label: "products shipped end to end" },
      { value: "4", label: "design systems built from zero" },
    ],
  },

  faq: {
    heading: "Questions worth asking before we start",
    items: [
      {
        q: "How does a project usually start?",
        a: "With a 30 minute call, then a short written scope. I map what you want to change, what already exists and what success looks like, and send back a plan with a fixed timeline before any design work begins.",
      },
      {
        q: "How long does a project take?",
        a: "A focused audit and redesign of one flow runs two to three weeks. A full product from research to build-ready design runs six to ten weeks. Retainers run month to month with an agreed number of design days.",
      },
      {
        q: "How do you price the work?",
        a: "Fixed price per project phase, quoted up front from the scope. No hourly billing and no surprise invoices. Retainers are a flat monthly fee for a set amount of design time.",
      },
      {
        q: "Do you work directly with our engineers?",
        a: "Yes, and it is where most of the value shows up. I work in your Slack and your tickets, hand over inspectable files with tokens and specs, and review builds before release.",
      },
      {
        q: "We already have a design system. Does that change things?",
        a: "It usually speeds things up. I design inside your system, extend it where it has gaps, and document anything new so your team can keep using it after I leave.",
      },
      {
        q: "Do you handle research, or only the interface?",
        a: "Both, scaled to the budget. That can mean a full round of user interviews and usability testing, or a lighter pass over your support tickets and analytics when the answers are already in your data.",
      },
    ],
  },
} as const;

/* --------------------------------------------------------------------------
 * SERVICES
 * ------------------------------------------------------------------------*/
export const services = {
  headline: "Four ways to work together",
  subhead:
    "Each engagement has a fixed scope, a fixed price and a defined handover. Pick the one that matches where your product is.",

  offerings: [
    {
      slug: "product-design",
      title: "End-to-end product design",
      summary:
        "From problem to build-ready design for a new product or a major new area of an existing one.",
      timeline: "6 to 10 weeks",
      bestFor: "Teams building something new, or rebuilding something that grew badly.",
      includes: [
        "Discovery: interviews, competitor teardown, jobs to be done",
        "Information architecture and user flows",
        "Wireframes reviewed with your engineers before visual design",
        "Full interface design, including empty, loading and error states",
        "Prototype for testing and stakeholder sign-off",
        "Build-ready handover with tokens, specs and a walkthrough",
      ],
    },
    {
      slug: "ux-audit",
      title: "UX audit and redesign",
      summary:
        "A structured teardown of what is costing you users, followed by the redesign of the flows that matter most.",
      timeline: "2 to 3 weeks",
      bestFor: "Live products with weak activation, high churn or a rising support load.",
      includes: [
        "Heuristic review of every core flow, scored and prioritised",
        "Session recording and support ticket review",
        "A written report ranked by impact against effort",
        "Redesign of the two or three flows with the most upside",
        "A backlog your team can keep working through afterwards",
      ],
    },
    {
      slug: "design-systems",
      title: "Design systems",
      summary:
        "A component library and token set your designers and engineers can both build against.",
      timeline: "4 to 6 weeks",
      bestFor: "Products where every new feature looks slightly different from the last.",
      includes: [
        "Audit of every component and pattern currently in production",
        "Colour, type, spacing and radius tokens defined once",
        "Component library with variants, states and usage rules",
        "Documentation written for engineers, not just designers",
        "Migration plan so the rollout does not block the roadmap",
      ],
    },
    {
      slug: "design-partner",
      title: "Ongoing design partner",
      summary:
        "A set number of design days each month, for teams that need design continuously rather than in one push.",
      timeline: "Monthly, three month minimum",
      bestFor: "Funded teams without a senior designer in house.",
      includes: [
        "An agreed number of design days per month",
        "Roadmap work designed ahead of each sprint",
        "Design review on shipped builds",
        "Direct access in your Slack during working hours",
        "The system maintained as the product grows",
      ],
    },
  ],

  process: {
    heading: "How the work runs",
    steps: [
      {
        title: "Frame the problem",
        body: "Before anything gets drawn, we agree what is broken, who it affects and how we will know it worked. Written down, in one page.",
      },
      {
        title: "Design in the open",
        body: "Work goes up every few days rather than in one reveal. You and your engineers see structure early, when changing it is still cheap.",
      },
      {
        title: "Hand over and stay close",
        body: "You get inspectable files, tokens and specs, plus a walkthrough with the people building it. I review the build before it ships.",
      },
    ],
  },
} as const;

/* --------------------------------------------------------------------------
 * WORK
 *
 * PLACEHOLDER: every case study below is fictional scaffolding. Replace the
 * client names, metrics and narrative with your real projects, and drop real
 * imagery into /public/work/ using the same filenames.
 * ------------------------------------------------------------------------*/
export type CaseStudy = {
  slug: string;
  client: string;
  title: string;
  discipline: string;
  year: string;
  summary: string;
  role: string[];
  duration: string;
  cover: string;
  coverAlt: string;
  challenge: string;
  approach: { title: string; body: string }[];
  gallery: { src: string; alt: string; caption: string }[];
  outcomes: { value: string; label: string }[];
  placeholder: true;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "ledgerline",
    client: "Ledgerline",
    title: "Rebuilding a reconciliation tool finance teams stopped dreading",
    discipline: "Product design, design system",
    year: "2025",
    summary:
      "A month-end reconciliation product where every accountant had built their own spreadsheet workaround. We rebuilt the core matching flow around what they were actually doing.",
    role: ["Product design", "User research", "Design system"],
    duration: "9 weeks",
    cover: "/work/ledgerline-cover.jpg",
    coverAlt: "Ledgerline reconciliation product cover image",
    challenge:
      "The matching screen had grown to fourteen filters and three competing table views. New accountants took most of a week to become useful, and the support team was answering the same six questions every month.",
    approach: [
      {
        title: "Watched a real month-end close",
        body: "Six sessions with accountants at three customers, recorded end to end. The workarounds people had built in spreadsheets turned out to be the real specification.",
      },
      {
        title: "Cut the interface down to the decision",
        body: "Matching is one judgement repeated hundreds of times. We designed a single focused view for that judgement and moved everything else behind it.",
      },
      {
        title: "Made the rules visible",
        body: "Automated matches now explain themselves in plain language, so reviewers can accept a batch without opening every row.",
      },
    ],
    gallery: [
      {
        src: "/work/ledgerline-01.jpg",
        alt: "The redesigned match review screen",
        caption: "The match review screen, reduced to one decision at a time.",
      },
      {
        src: "/work/ledgerline-02.jpg",
        alt: "Rule explanation panel",
        caption: "Every automated match explains why it matched.",
      },
    ],
    outcomes: [
      { value: "Under a day", label: "to onboard a new accountant" },
      { value: "3 views to 1", label: "in the core matching flow" },
      { value: "62 components", label: "documented and handed over" },
    ],
    placeholder: true,
  },
  {
    slug: "northbeam",
    client: "Northbeam Health",
    title: "A clinical scheduling system nurses could learn between shifts",
    discipline: "UX audit, redesign",
    year: "2024",
    summary:
      "Rota software used by ward managers under time pressure. The audit found that most errors happened in one screen, so that is where the redesign went.",
    role: ["UX audit", "Product design", "Usability testing"],
    duration: "5 weeks",
    cover: "/work/northbeam-cover.jpg",
    coverAlt: "Northbeam Health scheduling product cover image",
    challenge:
      "Ward managers were building rotas in a grid that hid conflicts until save. Mistakes surfaced hours later as missed shifts, and the workaround was printing the rota and checking it by hand.",
    approach: [
      {
        title: "Scored every flow against real failures",
        body: "The audit paired a heuristic review with four months of support tickets. Two thirds of reported problems traced back to a single screen.",
      },
      {
        title: "Moved conflict detection to the moment of the mistake",
        body: "Conflicts now appear as the shift is dragged, in place, rather than as a modal after saving.",
      },
      {
        title: "Designed for interruption",
        body: "Ward managers work in ninety second bursts. Every state now survives leaving the screen and coming back.",
      },
    ],
    gallery: [
      {
        src: "/work/northbeam-01.jpg",
        alt: "Rota builder with inline conflict warnings",
        caption: "Conflicts surface during the drag, not after the save.",
      },
      {
        src: "/work/northbeam-02.jpg",
        alt: "Mobile shift view",
        caption: "The nurse-facing view, designed for one hand on a ward.",
      },
    ],
    outcomes: [
      { value: "1 screen", label: "responsible for most reported errors" },
      { value: "14 flows", label: "audited and ranked by impact" },
      { value: "8 sessions", label: "of usability testing before build" },
    ],
    placeholder: true,
  },
  {
    slug: "atlas-freight",
    client: "Atlas Freight",
    title: "Turning a logistics dashboard into something dispatchers trust",
    discipline: "Product design",
    year: "2024",
    summary:
      "A live shipment dashboard that dispatchers had learned to ignore. The redesign focused on the small number of shipments that actually needed a human.",
    role: ["Product design", "Information architecture"],
    duration: "7 weeks",
    cover: "/work/atlas-cover.jpg",
    coverAlt: "Atlas Freight dispatch dashboard cover image",
    challenge:
      "Every shipment was shown with equal weight, so the twelve that needed attention were buried under four hundred that did not. Dispatchers worked from a side channel instead.",
    approach: [
      {
        title: "Defined what counts as an exception",
        body: "Two weeks with the dispatch team produced a shared definition of when a shipment needs a person. Everything else became background.",
      },
      {
        title: "Built the dashboard around exceptions",
        body: "The default view now shows only what is off-plan, with the full list one click away rather than in front by default.",
      },
      {
        title: "Gave each alert a next action",
        body: "No alert appears without the action it implies attached to it, so the screen is a queue rather than a report.",
      },
    ],
    gallery: [
      {
        src: "/work/atlas-01.jpg",
        alt: "Exception-first dispatch view",
        caption: "The default view shows only shipments that are off-plan.",
      },
      {
        src: "/work/atlas-02.jpg",
        alt: "Shipment detail with next action",
        caption: "Each alert carries the action it implies.",
      },
    ],
    outcomes: [
      { value: "400 to 12", label: "items in the default view" },
      { value: "Every alert", label: "ships with a next action" },
      { value: "2 weeks", label: "of discovery with the dispatch team" },
    ],
    placeholder: true,
  },
  {
    slug: "cadence",
    client: "Cadence",
    title: "One design system for a product that had grown three of them",
    discipline: "Design system",
    year: "2023",
    summary:
      "Three years of fast shipping had produced three visual languages in one product. We consolidated them into a single tokenised system without pausing the roadmap.",
    role: ["Design system", "Documentation"],
    duration: "6 weeks",
    cover: "/work/cadence-cover.jpg",
    coverAlt: "Cadence design system cover image",
    challenge:
      "Nine button variants, four type scales and no shared spacing rule. Designers and engineers were each maintaining their own version of the truth.",
    approach: [
      {
        title: "Inventoried what was actually in production",
        body: "Every component in the live product was catalogued before anything new was drawn. Most variants had no reason to exist.",
      },
      {
        title: "Defined tokens both sides could use",
        body: "Colour, type, spacing and radius were agreed once and named identically in design and in code.",
      },
      {
        title: "Rolled it out feature by feature",
        body: "No big-bang migration. Each new feature shipped on the system, and old screens were converted as they were touched.",
      },
    ],
    gallery: [
      {
        src: "/work/cadence-01.jpg",
        alt: "Token and component documentation",
        caption: "Tokens named identically in Figma and in code.",
      },
      {
        src: "/work/cadence-02.jpg",
        alt: "Component library overview",
        caption: "Nine button variants reduced to three, with rules for each.",
      },
    ],
    outcomes: [
      { value: "9 to 3", label: "button variants in production" },
      { value: "1 token set", label: "shared by design and engineering" },
      { value: "Zero", label: "roadmap weeks lost to migration" },
    ],
    placeholder: true,
  },
];

/* PLACEHOLDER: real quotes from real people, with permission, or delete the
 * section entirely. Fabricated testimonials are worse than none. */
export const testimonials = [
  {
    quote:
      "Miguel found in a week the problem we had argued about for a year. The rebuild shipped on time.",
    name: "Inês Craveiro",
    role: "Head of Product",
    company: "Ledgerline",
  },
  {
    quote:
      "He works like part of the team, not like an agency. Our engineers stopped guessing because the handover actually answered their questions.",
    name: "Tomás Bandeira",
    role: "Engineering Lead",
    company: "Atlas Freight",
  },
  {
    quote:
      "The audit was blunt in the best way. We knew exactly what to fix first and what could wait two quarters.",
    name: "Marta Vilhena",
    role: "Founder",
    company: "Northbeam Health",
  },
] as const;

/* PLACEHOLDER: replace with real clients. `icon` is a simple-icons slug when a
 * real brand mark exists, otherwise the site renders a monogram. */
export const clients = [
  { name: "Ledgerline", icon: null },
  { name: "Northbeam Health", icon: null },
  { name: "Atlas Freight", icon: null },
  { name: "Cadence", icon: null },
  { name: "Truveo", icon: null },
  { name: "Halden", icon: null },
] as const;

/* --------------------------------------------------------------------------
 * ABOUT
 * PLACEHOLDER: this whole section needs to come off the CV.
 * ------------------------------------------------------------------------*/
export const about = {
  headline: "I design software that respects the person using it",
  intro: [
    "I have spent nine years designing products where the work is genuinely complicated: finance tools, clinical software, logistics platforms. The kind of product where the user is an expert under time pressure, and a confusing screen has a real cost.",
    "That work taught me that most interface problems are not visual. They are decisions nobody made: which state matters, what happens when the data is missing, who this screen is really for. I spend most of a project making those decisions explicit, and the rest making them look effortless.",
    "I work directly with founders and product teams, usually as the only designer in the room. That means writing as much as drawing, and staying close to engineering until the thing is live.",
  ],
  portrait: "/about/portrait.jpg",
  portraitAlt: "Portrait of Miguel Pedroso",

  experience: [
    {
      period: "2022 - now",
      role: "Independent Product Designer",
      org: "Freelance",
      note: "Product design, UX audits and design systems for software teams across Europe.",
    },
    {
      period: "2019 - 2022",
      role: "Senior Product Designer",
      org: "PLACEHOLDER Company",
      note: "Owned design for the core platform and built the first shared component library.",
    },
    {
      period: "2017 - 2019",
      role: "Product Designer",
      org: "PLACEHOLDER Company",
      note: "Designed customer-facing web and mobile features from research through to release.",
    },
  ],

  capabilities: [
    "Product design",
    "UX research",
    "Usability testing",
    "Information architecture",
    "Interaction design",
    "Design systems",
    "Prototyping",
    "Design to code handover",
  ],

  tools: ["Figma", "Framer", "Notion", "Linear", "Maze", "HTML and CSS"],

  principles: [
    {
      title: "Clarity before polish",
      body: "A screen that is beautiful and ambiguous has failed. Structure gets solved first, always.",
    },
    {
      title: "Design the unhappy path",
      body: "Empty, loading, error and permission states are not edge cases. They are most of the product.",
    },
    {
      title: "Ship it, then judge it",
      body: "Nothing is proven in a Figma file. I stay involved until the work is in front of real users.",
    },
  ],
} as const;

/* --------------------------------------------------------------------------
 * CONTACT
 * ------------------------------------------------------------------------*/
export const contact = {
  headline: "Tell me what you are building",
  subhead:
    "The more detail you send, the more useful my first reply will be. I answer every message within two working days.",
  expectations: [
    { title: "A reply within two working days", body: "Including a straight no if I am not the right fit." },
    { title: "A 30 minute call", body: "No deck. We talk about the product and what is actually in the way." },
    { title: "A written scope and price", body: "Fixed timeline, fixed cost, sent before any work starts." },
  ],
  budgets: [
    "Under 5k",
    "5k to 15k",
    "15k to 40k",
    "Over 40k",
    "Not sure yet",
  ],
} as const;
