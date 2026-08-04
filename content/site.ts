/* ============================================================================
 * SINGLE SOURCE OF TRUTH FOR EVERY WORD ON THIS SITE.
 *
 * Written from Miguel's CV (July 2026). Everything here is either taken from
 * the CV or is a stance rather than a claim. Where the CV did not give enough
 * detail to write something specific, the gap is marked `TODO` rather than
 * filled with an invention.
 *
 * Positioning: works for two audiences at once, companies hiring and clients
 * commissioning. No pricing, no packages, no stated availability window.
 *
 * Nothing outside this file needs editing to change copy.
 * ==========================================================================*/

export const site = {
  name: "Miguel Pedroso",
  role: "Product Designer",
  email: "mafpedroso@gmail.com",
  location: "Lisbon, Portugal",
  url: "https://miguelpedroso.com",
  socials: [
    { label: "LinkedIn", href: "https://linkedin.com/in/miguelpedroso" },
  ],
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

/* One label per intent, used in the nav, every CTA band and the footer.
   Deliberately neutral: it has to read right to a hiring manager and to a
   founder looking for a designer. */
export const cta = {
  primary: { label: "Get in touch", href: "/contact" },
  secondary: { label: "View projects", href: "/projects" },
} as const;

export const home = {
  headline: "I make complex software feel obvious.",
  // 16 words. Has to fit two lines beside the hero image at desktop.
  subhead:
    "Product designer in Lisbon, working on software where the user is an expert under time pressure.",
  availability: "Working on industrial software at Critical Techworks",

  about: {
    heading: "A bit about me",
    body: "I'm a Product Designer based in Lisbon with a degree in Multimedia Engineering from ISTEC and a UX Certificate from NN/G. I started out in visual and brand design, got into UX/UI and Webflow at Decode shipping products across e-commerce, SaaS, and healthcare, and now I'm focused on complex industrial UX at Critical Techworks, designing tools used across BMW manufacturing plants. I like working across the full process, from early discovery and research all the way through to testing and working side by side with engineering.",
  },

  projects: {
    heading: "Selected projects",
    link: "See all projects",
  },
} as const;

/* --------------------------------------------------------------------------
 * SERVICES
 * Capabilities, not packages. No prices and no quoted timelines: the site has
 * to work for a company hiring as well as a client commissioning.
 * ------------------------------------------------------------------------*/
export const services = {
  headline: "How I work, and what I bring",
  subhead:
    "The same set of skills applied whether I am embedded in a product team or brought in for a specific piece of work.",

  offerings: [
    {
      slug: "discovery",
      title: "Product discovery and research",
      summary:
        "Understanding how the work actually happens before deciding what to build.",
      includes: [
        "Discovery sessions with the people who use the product",
        "Problem and requirement definition alongside engineering",
        "User flows and information architecture",
        "Usability testing to validate before build",
      ],
    },
    {
      slug: "product-design",
      title: "End-to-end product design",
      summary:
        "From the first sketch of a flow to the design an engineer can build from.",
      includes: [
        "Wireframes reviewed with engineers before visual design",
        "Interface design including empty, loading and error states",
        "Prototypes for testing and stakeholder sign-off",
        "Handover and review of the build before release",
      ],
    },
    {
      slug: "complex-flows",
      title: "Prototyping complex flows",
      summary:
        "Multi-step, multi-role processes that cannot be explained in a single screen.",
      includes: [
        "Flows that span teams, sites and systems",
        "Real-time and multi-stage transactional states",
        "Designs that survive being interrupted and resumed",
        "The same flow resolved for both Web and iOS",
      ],
    },
    {
      slug: "design-systems",
      title: "Design systems and craft",
      summary:
        "Components and rules that keep a product coherent as it grows.",
      includes: [
        "Component libraries with variants and states",
        "Colour, type and spacing tokens defined once",
        "Documentation aimed at engineers, not only designers",
        "UI and visual craft applied consistently across the product",
      ],
    },
  ],

  process: {
    heading: "How the work runs",
    steps: [
      {
        title: "Frame the problem",
        body: "Before anything gets drawn, agree what is broken, who it affects and how we will know it worked. Written down, in one page.",
      },
      {
        title: "Design in the open",
        body: "Work goes up every few days rather than in one reveal. Engineers see structure early, when changing it is still cheap.",
      },
      {
        title: "Validate, then ship",
        body: "Prototype and test with the people who will use it, hand over specs, and review the build before it reaches production.",
      },
    ],
  },
} as const;

/* --------------------------------------------------------------------------
 * WORK
 *
 * A 3x2 grid, no detail pages for now. Every entry is a real project from the
 * CV, written only to the level of detail the CV supports.
 *
 * TODO: drop real imagery into /public/work/ at the same filenames. The plates
 * there now are generated placeholders.
 * ------------------------------------------------------------------------*/
export type WorkItem = {
  slug: string;
  client: string;
  title: string;
  discipline: string;
  year: string;
  summary: string;
  cover: string;
  coverAlt: string;
};

export const workItems: WorkItem[] = [
  {
    slug: "part-exchange",
    client: "Critical Techworks / BMW",
    title: "Part-exchange workflows across manufacturing teams",
    discipline: "Product design, Web and iOS",
    year: "2023 - 2026",
    summary:
      "Streamlined how teams exchange parts across a plant, reducing transactional friction and lifting user adoption by 10%.",
    cover: "/work/part-exchange.jpg",
    coverAlt: "Part-exchange workflow project",
  },
  {
    slug: "incident-reporting",
    client: "Critical Techworks / BMW",
    title: "Incident reporting for plant operators",
    discipline: "Product design, Web and iOS",
    year: "2023 - 2026",
    summary:
      "A tool that lets operators document, track and resolve issues on the line without leaving what they were doing.",
    cover: "/work/incident-reporting.jpg",
    coverAlt: "Incident reporting tool project",
  },
  {
    slug: "assembly-line-navigation",
    client: "Critical Techworks / BMW",
    title: "Assembly-line navigation, rebuilt for clarity",
    discipline: "Interaction design, information architecture",
    year: "2023 - 2026",
    summary:
      "Reworked how people move through assembly-line software, so the right screen is reachable without training.",
    cover: "/work/assembly-line.jpg",
    coverAlt: "Assembly line navigation project",
  },
  {
    slug: "supply-chain-visibility",
    client: "Critical Techworks / BMW",
    title: "Real-time visibility across a multi-stage supply chain",
    discipline: "Product design, complex flows",
    year: "2023 - 2026",
    summary:
      "Helped develop tools that show where a transaction actually is when it passes through several stages and several teams.",
    cover: "/work/supply-chain.jpg",
    coverAlt: "Supply chain visibility project",
  },
  {
    slug: "nutrition-platform",
    client: "Decode",
    title: "UX and UI redesign for a Portuguese nutrition brand",
    discipline: "UX and UI design",
    year: "2022",
    summary:
      "A full redesign for a well-known nutrition company in Portugal, from discovery through to high-fidelity delivery.",
    cover: "/work/nutrition.jpg",
    coverAlt: "Nutrition brand redesign project",
  },
  {
    slug: "confederacao-musical",
    client: "Confederação Musical Portuguesa",
    title: "Brand identity for a cultural institution",
    discipline: "Visual design, brand identity",
    year: "2020",
    summary:
      "Defined the brand identity and designed the organisation's first set of social media assets and digital presence.",
    cover: "/work/confederacao.jpg",
    coverAlt: "Confederação Musical Portuguesa identity project",
  },
];

/* --------------------------------------------------------------------------
 * ABOUT
 * ------------------------------------------------------------------------*/
export const about = {
  headline: "I design software that respects the person using it",
  intro: [
    "I am a product designer in Lisbon. For the past few years I have worked on software used inside BMW manufacturing plants, translating industrial workflows that are genuinely complicated into interfaces people can use while doing something else.",
    "Before that I spent two years at an agency designing mobile and web products across e-commerce, security, SaaS and healthcare. Different sectors, same underlying problem: someone has to decide what matters on the screen, and most of the time nobody had.",
    "That is where I spend most of a project. Which state matters, what happens when the data is missing, who this screen is really for. I work these out with engineers and the people who use the product rather than alone in a file, then make the result look effortless.",
  ],
  portrait: "/about/portrait.jpg",
  portraitAlt: "Portrait of Miguel Pedroso",

  experience: [
    {
      period: "2023 - now",
      role: "UX Designer",
      org: "Critical Techworks",
      note: "UX for digital products used across BMW manufacturing plants. Discovery, end-to-end flows and validation through prototyping and testing, plus internal work on a SharePoint redesign and a UX onboarding programme.",
    },
    {
      period: "2021 - 2023",
      role: "UX/UI Designer and Webflow Developer",
      org: "Decode",
      note: "Mobile and web products across e-commerce, security, SaaS and healthcare. Led discovery sessions and produced flows, wireframes, prototypes and high-fidelity design for several teams.",
    },
    {
      period: "2020",
      role: "Visual Designer",
      org: "Confederação Musical Portuguesa",
      note: "Freelance project defining the brand identity and the organisation's first set of social media assets and digital presence.",
    },
  ],

  education: [
    {
      period: "2026",
      title: "UX Certificate",
      org: "Nielsen Norman Group, Lisbon",
    },
    {
      period: "2015 - 2019",
      title: "Degree in Multimedia Engineering",
      org: "ISTEC, Lisbon",
    },
    {
      period: "2015",
      title: "CTeSP, Development of Multimedia Products",
      org: "ISTEC, Lisbon",
    },
  ],

  capabilities: [
    "Product discovery",
    "End-to-end product design",
    "Prototyping complex flows",
    "Design systems",
    "Design for iOS and Web",
    "Design thinking",
    "Collaboration with engineering",
    "UI design and visual craft",
    "Usability testing",
  ],

  tools: ["Figma", "FigJam", "Adobe Creative Cloud", "Webflow"],

  languages: [
    { name: "Portuguese", level: "Native" },
    { name: "English", level: "B2" },
  ],

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
      title: "Stay close to the build",
      body: "Nothing is proven in a Figma file. I work with engineers until the thing is in front of real users.",
    },
  ],
} as const;

/* --------------------------------------------------------------------------
 * CONTACT
 * ------------------------------------------------------------------------*/
export const contact = {
  headline: "Tell me what you are working on",
  subhead:
    "A role, a project, or a problem you are not sure how to frame yet. The more detail you send, the more useful my first reply will be.",
  expectations: [
    {
      title: "A reply within a few days",
      body: "Including a straight no if I am not the right fit.",
    },
    {
      title: "A conversation, not a pitch",
      body: "We talk about the product and what is actually in the way.",
    },
    {
      title: "A clear next step",
      body: "Whether that is a call, a portfolio walkthrough or an introduction elsewhere.",
    },
  ],
  reasons: [
    "A full-time role",
    "A project or contract",
    "A portfolio walkthrough",
    "Something else",
  ],
} as const;
