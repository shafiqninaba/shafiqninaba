import type { APIRoute } from 'astro';

import { HOBBIES, INTRO, SKILLS, STUDIES, WORK } from '../data/content';
import { PERSON, SITE, SOCIAL } from '../data/site';

/**
 * Markdown representation of the homepage for clients that negotiate
 * `Accept: text/markdown`. The HTML homepage remains the canonical browser
 * representation; this route is a compact, text-first equivalent for agents.
 */
export const prerender = true;

const markdown = [
  `# ${PERSON.name}`,
  `> ${PERSON.role} based in ${PERSON.locationLabel}`,
  '',
  '## About',
  INTRO,
  '',
  '## Work experience',
  ...WORK.flatMap((job) => [
    `### ${job.role} — ${job.company}`,
    `${job.startLabel} – ${job.endLabel}`,
    ...job.achievements.map((achievement) => `- ${achievement}`),
    '',
  ]),
  '## Technical skills',
  SKILLS.map((skill) => `- [${skill.title}](${skill.href})`).join('\n'),
  '',
  '## Studies',
  ...STUDIES.flatMap((study) => [
    `### ${study.name}`,
    `${study.startLabel} – ${study.endLabel}`,
    study.degree,
    study.description,
    '',
  ]),
  '## Hobbies and interests',
  ...HOBBIES.flatMap((hobby) => [`### ${hobby.name}`, hobby.description, '']),
  '## Contact',
  `- [Email](${SOCIAL.find((social) => social.name === 'Email')?.href ?? `mailto:${PERSON.email}`})`,
  `- [GitHub](https://github.com/shafiqninaba)`,
  `- [LinkedIn](https://www.linkedin.com/in/shafiq-ninaba/)`,
  '',
  `Canonical HTML page: ${SITE.canonical}`,
  `Agent guidance: ${SITE.origin}/llms.txt`,
].join('\n');

export const GET: APIRoute = () =>
  new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Vary': 'Accept, Accept-Encoding',
    },
  });
