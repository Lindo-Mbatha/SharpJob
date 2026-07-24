import { Job } from "./types";

export const INITIAL_JOBS: Job[] = [
  {
    id: "job-1",
    title: "Product Designer",
    company: "Airbnb",
    category: "Design",
    location: "San Francisco, CA (Remote)",
    type: "Full-time",
    salary: "R135,000 - R160,000",
    closes: "Oct 28, 2026",
    description: "We are seeking a Product Designer to design seamless end-to-end booking and hosting workflows. You will craft interfaces that feel native, intuitive, and visually delightful while scaling Airbnb's design system.",
    responsibilities: [
      "Create high-fidelity mockups, user flows, and interactive prototypes.",
      "Collaborate closely with engineering to ensure implementation matches design specs.",
      "Conduct user research and convert qualitative insights into product improvements.",
      "Contribute elements back to the core brand design language."
    ],
    requirements: [
      "3+ years of experience designing complex web or mobile apps.",
      "Strong portfolio demonstrating user-centered design and micro-interactions.",
      "Expert command of Figma, prototyping tools, and asset delivery.",
      "Deep understanding of responsive grids and cross-platform UI standards."
    ],
    companyBio: "Airbnb is a global platform that connects hosts with travelers seeking local lodging and experiences. We champion belonging, creativity, and simple, beautiful design."
  },
  {
    id: "job-2",
    title: "Backend Developer",
    company: "Stripe",
    category: "Engineering",
    location: "Seattle, WA (Hybrid)",
    type: "Full-time",
    salary: "R150,000 - R185,000",
    closes: "Oct 15, 2026",
    description: "Join our API Foundations team to build ultra-reliable financial routing backend services. You will design, implement, and maintain scalable systems processing millions of transactions daily with millisecond-level latencies.",
    responsibilities: [
      "Design robust, highly secure RESTful and gRPC web services.",
      "Optimize database queries, distributed caching, and connection handling.",
      "Perform code reviews, draft comprehensive architectural blueprints, and lead feature releases.",
      "Collaborate with risk engineering to enhance fraud detection microservices."
    ],
    requirements: [
      "4+ years of professional backend software engineering experience.",
      "Proficiency in Ruby, Go, Java, or Node.js in high-throughput environments.",
      "Excellent understanding of SQL databases, ACID transactions, and Redis caching.",
      "Strong advocates for writing elegant, test-driven, self-documenting code."
    ],
    companyBio: "Stripe is a financial infrastructure platform for the internet. Millions of companies-from the world's largest enterprises to startups-use Stripe to accept payments and manage transactions."
  },
  {
    id: "job-3",
    title: "Marketing Manager",
    company: "HubSpot",
    category: "Marketing",
    location: "Boston, MA",
    type: "Full-time",
    salary: "R95,000 - R120,000",
    closes: "Nov 05, 2026",
    description: "HubSpot is seeking an inbound marketing master to orchestrate our customer acquisition campaigns. You will analyze target audiences, design cross-channel funnels, and write high-converting copy to expand our growth loop.",
    responsibilities: [
      "Lead omni-channel acquisition efforts including SEO, social media, and newsletter sponsorships.",
      "Configure and A/B test registration funnels and email nurture sequences.",
      "Analyze campaign KPIs, compiling monthly reports and forecasting user growth.",
      "Partner with product managers to trigger tailored in-app promotions."
    ],
    requirements: [
      "3+ years in growth marketing or growth product roles in B2B SaaS.",
      "Demonstrated track record of scaling newsletters or paid acquisition channels.",
      "Expertise with analytics suites (Google Analytics, Mixpanel, Amplitude).",
      "Excellent copywriting skills with an eye for clean visual presentation."
    ],
    companyBio: "HubSpot is a leading customer platform that provides software, service, and support to help businesses grow better. We believe in transparency, high alignment, and inbound-first strategies."
  },
  {
    id: "job-4",
    title: "Senior Cloud Engineer",
    company: "Snowflake",
    category: "Engineering",
    location: "San Jose, CA",
    type: "Full-time",
    salary: "R165,000 - R210,000",
    closes: "Nov 12, 2026",
    description: "We are seeking a Senior Cloud Infrastructure Engineer to scale our multi-cloud deployment automation. You will write infrastructure-as-code to manage millions of virtual nodes running in AWS, GCP, and Azure.",
    responsibilities: [
      "Author robust Terraform modules and Kubernetes manifests for globally distributed applications.",
      "Build self-healing CI/CD pipelines to release core database nodes safely and progressively.",
      "Monitor system health, manage incident response, and lead post-mortems for reliability improvements.",
      "Review network security policies and configure secure identity and access management."
    ],
    requirements: [
      "5+ years of production experience in high-scale DevOps or Site Reliability Engineering.",
      "Mastery of Docker, Kubernetes, Terraform, and cloud-native network architectures.",
      "Deep expertise in shell scripting or languages like Go and Python.",
      "Comfort with multi-region replication, fault tolerance, and disaster recovery strategies."
    ],
    companyBio: "Snowflake enables every organization to mobilize their data with the Data Cloud. We help customers solve the most complex data-sharing and analytics challenges."
  },
  {
    id: "job-5",
    title: "Brand Strategist",
    company: "Duolingo",
    category: "Design",
    location: "Pittsburgh, PA (Hybrid)",
    type: "Full-time",
    salary: "R85,000 - R110,000",
    closes: "Oct 20, 2026",
    description: "Are you creative, analytical, and fluent in digital culture? We're looking for a Brand Strategist to manage campaign activations that keep Duo the Owl top-of-mind across millions of learners globally.",
    responsibilities: [
      "Formulate brand positioning, campaign creative briefs, and localized marketing roadmaps.",
      "Coordinate high-profile partnership proposals with content creators and entertainment brands.",
      "Conduct target market surveys to track consumer sentiment and app engagement metrics.",
      "Review copywriting and visual assets to maintain a unified, humorous brand voice."
    ],
    requirements: [
      "2+ years of brand strategy experience inside top agencies or consumer-facing mobile apps.",
      "Obsessive tracker of internet memes, pop culture trends, and social platforms.",
      "Exceptional storytelling, deck presentation, and public speaking skills.",
      "Strong analytical backing to structure experiments and defend creative investments."
    ],
    companyBio: "Duolingo is the most popular language-learning platform and the most downloaded education app in the world. Our mission is to make education free, fun, and available to all."
  },
  {
    id: "job-6",
    title: "Social Media Specialist",
    company: "Canva",
    category: "Marketing",
    location: "Sydney, AU (Remote)",
    type: "Contract",
    salary: "R80 - R105 /hr",
    closes: "Sep 30, 2026",
    description: "Canva is hiring an experienced contractor to level up our social media video content! You will pitch, record, edit, and publish dynamic short-form videos (Reels, TikToks, Shorts) highlighting Canva's new AI design features.",
    responsibilities: [
      "Produce 3-5 high-quality creative short videos per week highlighting design workflows.",
      "Interact with Canva users in the comment sections, fostering community and solving user FAQs.",
      "Monitor viral audio tracks and editing patterns, executing fast turnarounds on trending ideas.",
      "Co-draft social copy and optimize hashtags for organic distribution."
    ],
    requirements: [
      "2+ years creating video content for consumer brands or a personal account with strong reach.",
      "Professional command of mobile video editing (CapCut, Premiere Pro, or Canva Video).",
      "Comfortable on camera, delivering engaging, high-energy demonstrations.",
      "Highly adaptable working with remote marketing teams across global time zones."
    ],
    companyBio: "Canva is a free-to-use online graphic design tool. Our mission is to empower everyone in the world to design anything and publish anywhere."
  }
];
