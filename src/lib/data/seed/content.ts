import type {
  Certification,
  Experience,
  Profile,
  SiteSettings,
  Skill,
  Testimonial,
} from "@/lib/data/types";

export const SEED_PROFILE: Profile = {
  id: "profile-1",
  full_name: "Alex Rivera",
  headline: "Cybersecurity & Full-Stack Engineer (Student)",
  bio: "I'm a final-year computing student focused on the overlap between secure systems and well-built software. I learn by building: hardened labs, security tooling, and full-stack apps that I document as real case studies. I care about honest engineering — shipping things that work, understanding the trade-offs, and being clear about what I do and don't yet know.",
  location: "Remote · Europe",
  email: "alex.rivera@example.com",
  github_url: "https://github.com/your-handle",
  linkedin_url: "https://www.linkedin.com/in/your-handle",
  website_url: "https://your-domain.example.com",
  avatar_url: null,
};

export const SEED_SETTINGS: SiteSettings = {
  hero_kicker: "Cybersecurity · Full-Stack",
  hero_title: "Turn projects into proof.",
  hero_subtitle:
    "I'm Alex — a cybersecurity and full-stack student. This is my portfolio operating system: polished case studies, verifiable skills, and the labs behind them.",
  hero_cta_label: "View case studies",
  cv_url: null,
  available_for_work: true,
  ai_assistant_enabled: true,
  contact_email: "alex.rivera@example.com",
};

export const SEED_SKILLS: Skill[] = [
  // Cybersecurity
  { id: "sk-1", name: "Web app security (OWASP Top 10)", category: "cybersecurity", proficiency: 4, note: "Headers, injection, auth flaws", sort_order: 1 },
  { id: "sk-2", name: "Network security & segmentation", category: "cybersecurity", proficiency: 4, note: "Firewalls, VLANs, IDS", sort_order: 2 },
  { id: "sk-3", name: "Threat modelling", category: "cybersecurity", proficiency: 3, note: "STRIDE, data-flow diagrams", sort_order: 3 },
  { id: "sk-4", name: "Incident triage & log analysis", category: "cybersecurity", proficiency: 3, note: null, sort_order: 4 },
  { id: "sk-5", name: "Cryptography fundamentals", category: "cybersecurity", proficiency: 3, note: "TLS, hashing, key handling", sort_order: 5 },

  // Frontend
  { id: "sk-6", name: "React", category: "frontend", proficiency: 4, note: "Hooks, server components", sort_order: 1 },
  { id: "sk-7", name: "Next.js (App Router)", category: "frontend", proficiency: 4, note: null, sort_order: 2 },
  { id: "sk-8", name: "TypeScript", category: "frontend", proficiency: 4, note: null, sort_order: 3 },
  { id: "sk-9", name: "Tailwind CSS", category: "frontend", proficiency: 4, note: null, sort_order: 4 },
  { id: "sk-10", name: "Accessibility (WCAG basics)", category: "frontend", proficiency: 3, note: "Keyboard, ARIA, contrast", sort_order: 5 },

  // Backend
  { id: "sk-11", name: "Node.js", category: "backend", proficiency: 4, note: null, sort_order: 1 },
  { id: "sk-12", name: "REST API design", category: "backend", proficiency: 3, note: null, sort_order: 2 },
  { id: "sk-13", name: "Server-side validation (Zod)", category: "backend", proficiency: 4, note: null, sort_order: 3 },
  { id: "sk-14", name: "Authentication & sessions", category: "backend", proficiency: 3, note: "OAuth, JWT, cookies", sort_order: 4 },

  // Databases
  { id: "sk-15", name: "PostgreSQL", category: "databases", proficiency: 4, note: "Schema design, indexes", sort_order: 1 },
  { id: "sk-16", name: "Row-Level Security", category: "databases", proficiency: 3, note: "Supabase / Postgres RLS", sort_order: 2 },
  { id: "sk-17", name: "SQL & query optimisation", category: "databases", proficiency: 3, note: null, sort_order: 3 },

  // Tools
  { id: "sk-18", name: "Git & GitHub", category: "tools", proficiency: 4, note: null, sort_order: 1 },
  { id: "sk-19", name: "Docker", category: "tools", proficiency: 3, note: null, sort_order: 2 },
  { id: "sk-20", name: "Ansible", category: "tools", proficiency: 3, note: null, sort_order: 3 },
  { id: "sk-21", name: "Wireshark", category: "tools", proficiency: 3, note: null, sort_order: 4 },
  { id: "sk-22", name: "Burp Suite (basics)", category: "tools", proficiency: 2, note: null, sort_order: 5 },

  // Operating systems
  { id: "sk-23", name: "Linux (Ubuntu/Debian)", category: "operating_systems", proficiency: 4, note: "Admin & hardening", sort_order: 1 },
  { id: "sk-24", name: "Windows administration", category: "operating_systems", proficiency: 3, note: null, sort_order: 2 },
  { id: "sk-25", name: "Bash scripting", category: "operating_systems", proficiency: 3, note: null, sort_order: 3 },
];

export const SEED_EXPERIENCE: Experience[] = [
  {
    id: "exp-1",
    role: "BSc Computing (Cybersecurity pathway)",
    organization: "University coursework & self-directed labs",
    location: "Europe",
    start_date: "2023-09-01",
    end_date: null,
    summary:
      "Final-year student combining formal coursework with a steady stream of self-built labs and projects, each documented as a case study.",
    highlights: [
      "Modules in network security, secure software development, databases, and operating systems",
      "Built and documented six portfolio projects spanning security tooling, infrastructure, and full-stack apps",
      "Maintain a reproducible home lab for safe, hands-on security practice",
    ],
    sort_order: 1,
  },
  {
    id: "exp-2",
    role: "Freelance web projects (small clients)",
    organization: "Self-employed",
    location: "Remote",
    start_date: "2024-06-01",
    end_date: null,
    summary:
      "Occasional freelance work building small marketing sites and internal tools, with an emphasis on accessible, maintainable code.",
    highlights: [
      "Delivered responsive sites with Next.js and Tailwind CSS",
      "Set up basic CI, environment hygiene, and documentation for handover",
      "Practised translating non-technical requirements into clear scope",
    ],
    sort_order: 2,
  },
  {
    id: "exp-3",
    role: "Volunteer IT support",
    organization: "Local community organisation",
    location: "On-site",
    start_date: "2023-02-01",
    end_date: "2024-05-01",
    summary:
      "Helped a small non-profit keep its devices and accounts running smoothly, which sparked my interest in helpdesk automation.",
    highlights: [
      "Triaged everyday IT issues for non-technical staff",
      "Wrote short how-to guides to reduce repeat questions",
      "This experience directly inspired the Sentinel Helpdesk AI project",
    ],
    sort_order: 3,
  },
];

export const SEED_CERTIFICATIONS: Certification[] = [
  {
    id: "cert-1",
    name: "CompTIA Security+",
    issuer: "CompTIA",
    status: "in_progress",
    issued_on: null,
    credential_url: null,
    sort_order: 1,
  },
  {
    id: "cert-2",
    name: "CompTIA Network+",
    issuer: "CompTIA",
    status: "earned",
    issued_on: "2025-04-01",
    credential_url: "https://www.credly.com/users/your-handle",
    sort_order: 2,
  },
  {
    id: "cert-3",
    name: "Google Cybersecurity Certificate",
    issuer: "Google / Coursera",
    status: "earned",
    issued_on: "2024-11-01",
    credential_url: "https://www.coursera.org/account/accomplishments",
    sort_order: 3,
  },
  {
    id: "cert-4",
    name: "TryHackMe — SOC Level 1 path",
    issuer: "TryHackMe",
    status: "in_progress",
    issued_on: null,
    credential_url: null,
    sort_order: 4,
  },
  {
    id: "cert-5",
    name: "OSCP",
    issuer: "OffSec",
    status: "planned",
    issued_on: null,
    credential_url: null,
    sort_order: 5,
  },
];

export const SEED_TESTIMONIALS: Testimonial[] = [
  {
    id: "tst-1",
    author: "J. Okafor",
    role: "Module lecturer, Secure Software Development",
    quote:
      "Alex consistently went beyond the brief — the GDPR coursework was one of the clearest mappings from principle to implementation I saw in the cohort.",
    source_url: null,
    approved: true,
    sort_order: 1,
  },
  {
    id: "tst-2",
    author: "M. Lindqvist",
    role: "Small-business owner (freelance client)",
    quote:
      "Reliable and easy to work with. Alex explained the trade-offs in plain language and handed over something I could actually maintain.",
    source_url: null,
    approved: true,
    sort_order: 2,
  },
  {
    id: "tst-3",
    author: "Peer review, study group",
    role: "Fellow student",
    quote:
      "The home lab write-ups are genuinely useful — I used the hardening notes as a checklist for my own setup.",
    source_url: null,
    approved: true,
    sort_order: 3,
  },
];
