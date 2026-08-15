import type { ImageMetadata } from 'astro';

import aiap1     from '../assets/aiap/aiap-1.jpg';
import aiap2     from '../assets/aiap/aiap-2.jpg';
import aiap3     from '../assets/aiap/aiap-3.jpg';
import aiapCert  from '../assets/aiap/aiap-cert.png';
import climb     from '../assets/hobbies/transend-climb.jpg';
import portrait  from '../assets/hobbies/transend-portrait.jpg';

export interface Photo { src: ImageMetadata; alt: string; }

export interface Job {
  company: string;
  role: string;
  startISO: string;  startLabel: string;
  endISO: string | null; endLabel: string;
  achievements: string[];
  images: Photo[];
}

export const SECTIONS = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'work',         label: 'Work Experience' },
  { id: 'studies',      label: 'Studies' },
  { id: 'skills',       label: 'Technical skills' },
  { id: 'hobbies',      label: 'Hobbies & Interests' },
] as const;

/** First person. See BUILD-SPEC §H — candidate A. */
export const INTRO =
  "Hello! I'm Shafiq, a Singapore-based AI/ML Engineer with a background in Electrical & " +
  'Electronic Engineering. I build end-to-end machine learning systems spanning computer ' +
  'vision, data engineering, and LLM-powered agentic workflows. Having deployed real-world ' +
  'AI solutions in production, I enjoy building robust, scalable pipelines that go beyond ' +
  'the notebook.';

export const WORK: Job[] = [
  {
    company: 'AI Singapore',
    role: 'AI Engineer',
    startISO: '2025-07', startLabel: 'Jul 2025',
    endISO: null,        endLabel: 'Present',
    achievements: [
      'Contributing to the development of an enterprise AI-powered Learning Management System (LMS) as part of a 7-member team, architecting scalable cloud infrastructure on Azure to deliver personalized education experiences.',
      'Sole owner of MLOps and DevOps infrastructure for the platform, implementing robust CI/CD pipelines through GitLab and orchestrating containerized deployments using Kubernetes, Helm, ArgoCD and Terraform to ensure high availability, observability, and seamless system maintenance.',
      'Architecting and managing cloud-native infrastructure on Azure, leveraging Infrastructure as Code principles to enable rapid, reliable deployments across development and production environments.',
      'Mentoring and leading apprentices in delivering client-facing AI solutions, providing technical guidance on machine learning pipelines, deployment strategies, and best practices in production-grade AI systems.',
    ],
    images: [],
  },
  {
    company: 'AI Singapore',
    role: 'Associate AI Engineer',
    startISO: '2024-06', startLabel: 'Jun 2024',
    endISO: '2025-03',   endLabel: 'Mar 2025',
    achievements: [
      'Delivered an MVP for a $360,000 AI project in the construction industry in just 7 months.',
      'Designed and deployed a full ML pipeline for 360° panoptic segmentation using CNN-based models trained on 3,000+ images with 100+ classes, achieving 95% mean accuracy.',
      'Built a FastAPI backend to serve models with inference speeds 50% faster than required.',
      'Developed CI/CD pipelines with test coverage and documentation for maintainability and handover.',
    ],
    images: [
      { src: aiap1,    alt: 'My team and I at AI Singapore' },
      { src: aiap2,    alt: 'Introducing my AIAP experience to guests' },
      { src: aiap3,    alt: 'My team and I at AI Singapore' },
      { src: aiapCert, alt: 'AIAP Certificate' },
    ],
  },
  {
    company: 'PSA Corporation Ltd',
    role: 'Machine Learning Intern (Smart Systems & Solutions)',
    startISO: '2023-01', startLabel: 'Jan 2023',
    endISO: '2023-07',   endLabel: 'Jul 2023',
    achievements: [
      'Engineered features from crane sensor data to improve predictive maintenance model accuracy.',
      'Used DataRobot and Python for unsupervised anomaly detection via API integration.',
      'Streamlined ETL pipelines and automated reporting workflows with Python and SQL, improving efficiency by 90%.',
    ],
    images: [],
  },
];

export const STUDIES = [
  {
    name: 'Nanyang Technological University (NTU)',
    startISO: '2020-08', startLabel: 'Aug 2020',
    endISO: '2024-05',   endLabel: 'May 2024',
    degree: 'Bachelor of Engineering (Electrical and Electronic Engineering), Honours (Distinction)',
    description:
      'Specialized in Info-Communications Engineering with modules like Machine Learning Design & Application, Artificial Intelligence, Computer Vision, and Web Application Design.',
  },
];

export const SKILLS = [
  {
    title: 'Machine Learning & AI',
    description:
      'Skilled in building and deploying ML models with PyTorch, TensorFlow, scikit-learn, and MLFlow. Experienced with LangChain, LangGraph, and OpenAI APIs for building agentic systems.',
  },
  {
    title: 'Backend & Infra',
    description:
      'Proficient with FastAPI, Flask, Docker, Azure, AWS, Google Cloud Platform, and CI/CD tools for production-grade ML systems.',
  },
  {
    title: 'Data & Visualization',
    description:
      'Experienced with Pandas, NumPy, SQL, Apache Hive, and PySpark. Used Plotly and custom dashboards for model insights and data storytelling.',
  },
  {
    title: 'Web Development',
    description:
      'Built interactive applications with Streamlit, HTML/CSS/JS, and deployed full-stack solutions on Heroku and DigitalOcean.',
  },
];

export const HOBBIES = [
  {
    name: 'Bouldering',
    description:
      "I enjoy the problem-solving aspect of bouldering, which challenges both my mental and physical abilities. It's a great way to stay active while building strength and coordination.",
    images: [
      { src: climb,    alt: 'Climbing at a local competition' },
      { src: portrait, alt: 'Podium position at a local competition' },
    ] as Photo[],
  },
  {
    name: 'Tech reviews',
    description:
      'I love reading up & watching videos on the latest trends in technology, be it on the latest coolest gadgets, or the latest AI models and SWE frameworks!',
    images: [] as Photo[],
  },
];
