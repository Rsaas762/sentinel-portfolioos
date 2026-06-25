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
  full_name: "Mohamed Elhalabi",
  headline: "Network, Infrastructure & Cybersecurity Graduate",
  bio: "I'm a newly graduated engineer from Jönköping University with a BSc in Network, Infrastructure and Cybersecurity. I'm tech-focused and service-oriented, with hands-on experience troubleshooting technical problems and supporting users directly at a high tempo — structured, and comfortable juggling several tickets at once without losing quality. I'm based in Jönköping, Sweden, fluent in Swedish, English and Arabic, and motivated to keep growing in IT, infrastructure and cybersecurity. I learn by building, so I ship and document real projects.",
  location: "Jönköping, Sweden",
  email: "mohammadhalabi777@gmail.com",
  github_url: "https://github.com/Rsaas762",
  linkedin_url: "https://www.linkedin.com/in/mohamed-elhalabi-04296a205",
  website_url: "https://sentinel-portfolioos.vercel.app",
  avatar_url: null,
};

export const SEED_SETTINGS: SiteSettings = {
  hero_kicker: "Network · Infrastructure · Cybersecurity",
  hero_title: "Turn projects into proof.",
  hero_subtitle:
    "I'm Mohamed — a Network, Infrastructure & Cybersecurity graduate from Jönköping University. I learn by building: secure web apps, IT-support tooling, and networking labs, each documented as an honest case study.",
  hero_cta_label: "View my projects",
  cv_url: "/Mohamed_Elhalabi_CV.pdf",
  available_for_work: true,
  ai_assistant_enabled: true,
  contact_email: "mohammadhalabi777@gmail.com",
};

export const SEED_SKILLS: Skill[] = [
  // Cybersecurity
  { id: "sk-1", name: "Cyber & information security", category: "cybersecurity", proficiency: 4, note: "Degree focus", sort_order: 1 },
  { id: "sk-2", name: "Network security & segmentation", category: "cybersecurity", proficiency: 4, note: "VLANs, zoning, firewalls", sort_order: 2 },
  { id: "sk-3", name: "Secure-by-design web apps", category: "cybersecurity", proficiency: 3, note: "SSRF defence, headers, validation", sort_order: 3 },
  { id: "sk-4", name: "Security headers & TLS basics", category: "cybersecurity", proficiency: 3, note: "HSTS, CSP, cookies", sort_order: 4 },
  { id: "sk-5", name: "Phishing & social-engineering awareness", category: "cybersecurity", proficiency: 3, note: null, sort_order: 5 },

  // Frontend
  { id: "sk-6", name: "Next.js (App Router)", category: "frontend", proficiency: 4, note: "Built 3 real apps", sort_order: 1 },
  { id: "sk-7", name: "React", category: "frontend", proficiency: 4, note: null, sort_order: 2 },
  { id: "sk-8", name: "TypeScript", category: "frontend", proficiency: 4, note: null, sort_order: 3 },
  { id: "sk-9", name: "Tailwind CSS", category: "frontend", proficiency: 4, note: null, sort_order: 4 },

  // Backend
  { id: "sk-10", name: "Supabase (Auth + Postgres)", category: "backend", proficiency: 4, note: null, sort_order: 1 },
  { id: "sk-11", name: "Server-side validation (Zod)", category: "backend", proficiency: 4, note: "Client + server", sort_order: 2 },
  { id: "sk-12", name: "Node.js", category: "backend", proficiency: 3, note: null, sort_order: 3 },
  { id: "sk-13", name: "Python (scripting)", category: "backend", proficiency: 3, note: "Automation", sort_order: 4 },
  { id: "sk-14", name: "REST / Server Actions", category: "backend", proficiency: 3, note: null, sort_order: 5 },

  // Databases
  { id: "sk-15", name: "PostgreSQL", category: "databases", proficiency: 3, note: "Schema design", sort_order: 1 },
  { id: "sk-16", name: "Row-Level Security", category: "databases", proficiency: 3, note: "Supabase / Postgres RLS", sort_order: 2 },
  { id: "sk-17", name: "SQL", category: "databases", proficiency: 3, note: null, sort_order: 3 },

  // Tools
  { id: "sk-18", name: "Cisco Packet Tracer", category: "tools", proficiency: 4, note: "Network design & labs", sort_order: 1 },
  { id: "sk-19", name: "Routing & switching (Cisco)", category: "tools", proficiency: 3, note: "WAN, VLANs, wireless", sort_order: 2 },
  { id: "sk-20", name: "Troubleshooting & technical support", category: "tools", proficiency: 4, note: "Ticket handling", sort_order: 3 },
  { id: "sk-21", name: "Virtualization (VirtualBox/Parallels)", category: "tools", proficiency: 3, note: null, sort_order: 4 },
  { id: "sk-22", name: "Git & GitHub", category: "tools", proficiency: 3, note: null, sort_order: 5 },

  // Operating systems
  { id: "sk-23", name: "Windows administration", category: "operating_systems", proficiency: 4, note: null, sort_order: 1 },
  { id: "sk-24", name: "Linux (Ubuntu/Debian)", category: "operating_systems", proficiency: 3, note: null, sort_order: 2 },
  { id: "sk-25", name: "Bash / shell scripting", category: "operating_systems", proficiency: 3, note: null, sort_order: 3 },
  { id: "sk-26", name: "Cloud services & virtualization", category: "operating_systems", proficiency: 3, note: null, sort_order: 4 },
];

export const SEED_EXPERIENCE: Experience[] = [
  {
    id: "exp-1",
    role: "Retail Associate — Checkout & Online Orders",
    organization: "Stora Coop",
    location: "Sweden",
    start_date: "2025-08-01",
    end_date: null,
    summary:
      "Customer-facing retail role combining checkout service with accurate online order fulfilment.",
    highlights: [
      "Help customers daily with a service-minded, professional approach",
      "Pick online customer orders with a focus on accuracy, structure and on-time delivery",
      "Comfortable with high-tempo customer contact and resolving questions on the spot",
    ],
    sort_order: 1,
  },
  {
    id: "exp-2",
    role: "IT Technician / Technical Support",
    organization: "O-Ringen (one of Sweden's largest sporting events)",
    location: "Jönköping, Sweden",
    start_date: "2025-07-01",
    end_date: "2025-08-01",
    summary:
      "Provided fast, hands-on technical support to staff during a large-scale event, keeping systems and networks running.",
    highlights: [
      "Installed, troubleshot and maintained IT equipment so networks, computers and systems stayed stable throughout the event",
      "Worked at a high tempo on many parallel tickets, prioritising solutions around each user's needs",
      "Gave direct, on-site support to staff under real time pressure",
    ],
    sort_order: 2,
  },
  {
    id: "exp-3",
    role: "BSc — Network, Infrastructure & Cybersecurity",
    organization: "School of Engineering, Jönköping University",
    location: "Jönköping, Sweden",
    start_date: "2023-09-01",
    end_date: "2026-06-01",
    summary:
      "Bachelor's degree focused on the design, operation and security of IT infrastructure and networks.",
    highlights: [
      "Network technology, systems administration, cybersecurity and troubleshooting of complex IT environments",
      "Hands-on labs with Cisco Packet Tracer, virtualization, and Linux/Windows administration",
      "Built and documented several projects applying these skills (see Projects)",
    ],
    sort_order: 3,
  },
  {
    id: "exp-4",
    role: "Teknikprogrammet (Technology Programme)",
    organization: "Tranemo Gymnasieskola",
    location: "Tranemo, Sweden",
    start_date: "2020-08-01",
    end_date: "2023-06-01",
    summary:
      "Upper-secondary technology programme — a foundation in mathematics, programming and technology.",
    highlights: [],
    sort_order: 4,
  },
];

// No certifications listed on the CV yet — kept honestly empty.
// Add real, verifiable credentials from the admin dashboard as you earn them.
export const SEED_CERTIFICATIONS: Certification[] = [];

// No published testimonials yet (a professional reference is available on request).
export const SEED_TESTIMONIALS: Testimonial[] = [];

// Spoken languages (from CV) — surfaced on the About page.
export const SEED_LANGUAGES: { name: string; level: string }[] = [
  { name: "Swedish", level: "Fluent" },
  { name: "English", level: "Fluent" },
  { name: "Arabic", level: "Fluent" },
  { name: "Chinese", level: "Basic" },
];
