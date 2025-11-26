import {
  SiLangchain,
  SiPython,
  SiLinux,
  SiPytorch,
  SiDocker,
  SiRailway,
  SiKubernetes,
  SiAmazonwebservices,
  SiFastapi,
  SiGitlab,
  SiGithubactions,
  SiHelm,
  SiArgo,
  SiTerraform,
  SiPydantic,
  SiKedro
} from "react-icons/si";

import { VscAzure } from "react-icons/vsc";

const person = {
  firstName: "Shafiq",
  lastName: "Ninaba",
  get name() {
    return `${this.firstName} ${this.lastName}`;
  },
  role: "AI Engineer",
  avatar: "/images/avatar.jpg",
  email: "shafiqninaba@gmail.com",
  location: "Asia/Singapore", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: ["English", "Malay"], // optional: Leave the array empty if you don't want to display languages
};

const newsletter = {
  display: false,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: (
    <>
      I occasionally write about design, technology, and share thoughts on the intersection of
      creativity and engineering.
    </>
  ),
};

const social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/shafiqninaba",
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/shafiq-ninaba/",
  },
  {
    name: "X",
    icon: "x",
    link: "",
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
  },
];

const home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>Engineering intelligence, one pipeline at a time.</>,
  featured: {
    display: true,
    title: <>Recent project: <strong className="ml-4">ask-the-docs</strong></>,
    href: "/work/ask-the-docs",
  },
  subline: (
    <>
    I'm Shafiq, an AI Engineer crafting scalable ML systems — from computer vision to agentic systems. I build end-to-end solutions that ship.
    <br />
    <br />
    In my free time, I either boulder or work on my personal projects. You can find them <a href="/work">here</a>!
    </>
  ),
};

const about = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: false,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        {person.name} is a Singapore-based AI/ML Engineer with a background in Electrical & Electronic Engineering.
        He builds end-to-end machine learning systems that span computer vision, data engineering, and LLM-powered
        agentic workflows. With hands-on experience deploying real-world AI solutions, he enjoys building robust,
        scalable pipelines that go beyond the notebook.
      </>
    ),
  },
logoLoop: {
    display: true,
    // Add your logos here - each logo can be an image or a custom React node
    // Image format: { src: "/path/to/logo.svg", alt: "Company Name", href: "https://link.com" }
    // Node format: { node: <YourComponent />, title: "Label", href: "https://link.com" }
    logos: [
      { node: <SiPython />, title: "Python", href: "https://www.python.org/" },
      { node: <SiLinux />, title: "Linux", href: "https://www.linux.org/" },
      { node: <SiPytorch />, title: "PyTorch", href: "https://pytorch.org/" },
      { node: <SiDocker />, title: "Docker", href: "https://www.docker.com/" },
      { node: <SiKubernetes />, title: "Kubernetes", href: "https://kubernetes.io/" },
      { node: <VscAzure />, title: "Azure", href: "https://azure.microsoft.com/" },
      { node: <SiAmazonwebservices />, title: "AWS", href: "https://aws.amazon.com/" },
      { node: <SiRailway />, title: "Railway", href: "https://railway.com/" },
      { node: <SiFastapi />, title: "FastAPI", href: "https://fastapi.tiangolo.com/" },
      { node: <SiGitlab />, title: "GitLab CI/CD", href: "https://docs.gitlab.com/ci/" },
      { node: <SiGithubactions />, title: "GitHub Actions", href: "https://github.com/features/actions" },
      { node: <SiHelm />, title: "Helm", href: "https://helm.sh/" },
      { node: <SiArgo />, title: "ArgoCD", href: "https://argo-cd.readthedocs.io/" },
      { node: <SiLangchain />, title: "LangChain", href: "https://www.langchain.com/" },
      { node: <SiTerraform />, title: "Terraform", href: "https://www.terraform.io/" },
      { node: <SiPydantic />, title: "Pydantic", href: "https://docs.pydantic.dev/" },
      { node: <SiKedro />, title: "Kedro", href: "https://kedro.org/" },
    ],
  },
  work: {
    display: true,
    title: "Work Experience",
    experiences: [
      {
        company: "AI Singapore",
        timeframe: "Jul 2025 – Present",
        role: "AI Engineer",
        achievements: [
          <>
            Contributing to the development of an enterprise AI-powered Learning Management System (LMS) as part of a 7-member team, architecting scalable cloud infrastructure on Azure to deliver personalized education experiences.
          </>,
          <>
            Sole owner of MLOps and DevOps infrastructure for the platform, implementing robust CI/CD pipelines through GitLab and orchestrating containerized deployments using Kubernetes, Helm, ArgoCD and Terraform to ensure high availability, observability, and seamless system maintenance.
          </>,
          <>
            Architecting and managing cloud-native infrastructure on Azure, leveraging Infrastructure as Code principles to enable rapid, reliable deployments across development and production environments.
          </>,
          <>
            Mentoring and leading apprentices in delivering client-facing AI solutions, providing technical guidance on machine learning pipelines, deployment strategies, and best practices in production-grade AI systems.
          </>,
        ],
        images: [],
      },
      {
        company: "AI Singapore",
        timeframe: "Jun 2024 – Mar 2025",
        role: "Associate AI Engineer",
        achievements: [
          <>
            Delivered an MVP for a $360,000 AI project in the construction industry in just 7 months.
          </>,
          <>
            Designed and deployed a full ML pipeline for 360° panoptic segmentation using CNN-based models trained on 3,000+ images with 100+ classes, achieving 95% mean accuracy.
          </>,
          <>
            Built a FastAPI backend to serve models with inference speeds 50% faster than required.
          </>,
          <>
            Developed CI/CD pipelines with test coverage and documentation for maintainability and handover.
          </>,
        ],
        images: [
          {
            src: "/images/projects/aiap/aiap_1.jpg",
            alt: "My team and I at AI Singapore",
            width: 16,
            height: 9,
          },
          {
            src: "/images/projects/aiap/aiap_2.jpg",
            alt: "Introducing my AIAP experience to guests",
            width: 16,
            height: 9,
          },
          {
            src: "/images/projects/aiap/aiap_3.jpg",
            alt: "My team and I at AI Singapore",
            width: 16,
            height: 9,
          },
          {
            src: "/images/projects/aiap/aiap_cert.png",
            alt: "AIAP Certificate",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "PSA Corporation Ltd",
        timeframe: "Jan 2023 – Jul 2023",
        role: "Machine Learning Intern (Smart Systems & Solutions)",
        achievements: [
          <>
            Engineered features from crane sensor data to improve predictive maintenance model accuracy.
          </>,
          <>
            Used DataRobot and Python for unsupervised anomaly detection via API integration.
          </>,
          <>
            Streamlined ETL pipelines and automated reporting workflows with Python and SQL, improving efficiency by 90%.
          </>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true,
    title: "Studies",
    institutions: [
      {
        name: "Nanyang Technological University (NTU)",
        description: (
          <>
            Bachelor of Engineering (Electrical and Electronic Engineering), Honours (Distinction). 
            Specialized in Info-Communications Engineering with modules like Machine Learning Design & Application, 
            Artificial Intelligence, Computer Vision, and Web Application Design.
          </>
        ),
      },
    ],
  },
  technical: {
    display: true,
    title: "Technical skills",
    skills: [
      {
        title: "Machine Learning & AI",
        description: (
          <>
            Skilled in building and deploying ML models with PyTorch, TensorFlow, scikit-learn, and MLFlow. Experienced with LangChain, LangGraph, and OpenAI APIs for building agentic systems.
          </>
        ),
        images: [],
      },
      {
        title: "Backend & Infra",
        description: (
          <>
            Proficient with FastAPI, Flask, Docker, Azure, AWS, Google Cloud Platform, and CI/CD tools for production-grade ML systems.
          </>
        ),
        images: [],
      },
      {
        title: "Data & Visualization",
        description: (
          <>
            Experienced with Pandas, NumPy, SQL, Apache Hive, and PySpark. Used Plotly and custom dashboards for model insights and data storytelling.
          </>
        ),
        images: [],
      },
      {
        title: "Web Development",
        description: (
          <>
            Built interactive applications with Streamlit, HTML/CSS/JS, and deployed full-stack solutions on Heroku and DigitalOcean.
          </>
        ),
        images: [],
      },
    ],
  },
    hobbies: {
    display: true,
    title: "Hobbies & Interests",
    interests: [
      {
        name: "Bouldering",
        description: (
          <>
            I enjoy the problem-solving aspect of bouldering, which challenges both my mental and physical abilities. It's a great way to stay active while building strength and coordination.
          </>
        ),
        images: [
          {
            src: "/images/hobbies/transend-climb.jpg", 
            alt: "Climbing at a local competition",
            width: 16,
            height: 9,
          },
          {
            src: "/images/hobbies/transend-portrait.jpg",
            alt: "Podium position at a local competition",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        name: "Tech reviews",
        description: (
          <>
            I love reading up & watching videos on the latest trends in technology, be it on the latest coolest gadgets, or the latest AI models and SWE frameworks!
          </>
        ),
        images: [
          // {
          //   src: "/images/hobbies/photography.jpg",
          //   alt: "A photo I took during a trip",
          //   width: 16,
          //   height: 9,
          // },
        ],
      },
    ],
    }
};


const blog = {
  path: "/blog",
  label: "Blog",
  title: "Writing about design and tech...",
  description: `Read what ${person.name} has been up to recently`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `Dev projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  // Images by https://lorant.one
  // These are placeholder images, replace with your own
  images: [
    {
      src: "/images/gallery/horizontal-1.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-2.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-3.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-4.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-2.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-3.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-4.jpg",
      alt: "image",
      orientation: "vertical",
    },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };

