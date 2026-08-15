export const SITE = {
  /** apex, no www, no trailing slash — matches astro.config `site` */
  origin: 'https://shafiqninaba.com',
  canonical: 'https://shafiqninaba.com/',
  title: 'Shafiq Ninaba — AI Engineer in Singapore',
  description:
    'Shafiq Ninaba is an AI Engineer at AI Singapore building production ML systems — computer vision, MLOps on Kubernetes and Azure, and LLM agent workflows.',
  ogImage: 'https://shafiqninaba.com/og.png',
  ogImageAlt: 'Shafiq Ninaba, AI Engineer in Singapore',
  lang: 'en-SG',
  locale: 'en_SG',
  googleSiteVerification: 'ZUd9tz6kEcxWgjTJEgPI5CeNAQNzn3Yq6NUIOqbo_uU',
} as const;

export const PERSON = {
  firstName: 'Shafiq',
  lastName: 'Ninaba',
  name: 'Shafiq Ninaba',
  username: 'shafiqninaba',
  role: 'AI Engineer',
  email: 'shafiqninaba@gmail.com',
  /** Human-readable place. NEVER the IANA identifier — the live meta description
   *  currently reads "AI Engineer from Asia/Singapore" because these were conflated. */
  locationLabel: 'Singapore',
  /** IANA zone, kept only if a clock is ever added. Never rendered as prose. */
  timezone: 'Asia/Singapore',
  utcOffsetLabel: 'GMT+8',
  languages: ['English', 'Malay'] as const,
} as const;

export const SOCIAL = [
  { name: 'GitHub',   icon: 'github',   href: 'https://github.com/shafiqninaba' },
  { name: 'LinkedIn', icon: 'linkedin', href: 'https://www.linkedin.com/in/shafiq-ninaba/' },
  { name: 'Email',    icon: 'envelope', href: 'mailto:shafiqninaba@gmail.com' },
] as const;
// The "X" entry from the old content.js had link: "" and never rendered. Dropped.
