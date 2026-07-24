import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Bell,
  BellRing,
  Loader2,
  Search,
  Bookmark,
  User,
  CheckCircle,
  Palette,
  Megaphone,
  Server,
  MapPin,
  Banknote,
  Calendar,
  ArrowLeft,
  ChevronRight,
  Share2,
  X,
  Upload,
  Sparkles,
  Check,
  Trash2,
  ExternalLink,
  Info,
  Clock,
  ShieldCheck,
  FileText,
  Send,
  SlidersHorizontal,
  UserPen,
  Lock,
  Mail,
  Phone,
  Globe,
  ChevronDown,
  Moon,
  Sun,
  Volume2,
  Wifi,
  Zap,
  MessageCircle,
  Headphones,
  Star,
  LifeBuoy,
  Settings as SettingsIcon,
  Link2
} from "lucide-react";

// Accent options definition
interface AccentStyle {
  primary: string;
  text: string;
  textHover: string;
  bgLight: string;
  borderLight: string;
  borderHover: string;
  borderActive: string;
  ring: string;
  badge: string;
  name: string;
}

const ACCENTS: Record<string, AccentStyle> = {
  indigo: {
    primary: "bg-indigo-600",
    text: "text-indigo-600",
    textHover: "hover:text-indigo-700",
    bgLight: "bg-indigo-50",
    borderLight: "border-indigo-100",
    borderHover: "hover:border-indigo-300",
    borderActive: "border-indigo-600",
    ring: "focus:ring-indigo-500",
    badge: "bg-indigo-50 text-indigo-700 border-indigo-100",
    name: "Classic Indigo"
  },
  blue: {
    primary: "bg-blue-600",
    text: "text-blue-600",
    textHover: "hover:text-blue-700",
    bgLight: "bg-blue-50/80",
    borderLight: "border-blue-100",
    borderHover: "hover:border-blue-300",
    borderActive: "border-blue-600",
    ring: "focus:ring-blue-500",
    badge: "bg-blue-50 text-blue-700 border-blue-100",
    name: "SharpJob Blue"
  },
  emerald: {
    primary: "bg-emerald-600",
    text: "text-emerald-600",
    textHover: "hover:text-emerald-700",
    bgLight: "bg-emerald-50/80",
    borderLight: "border-emerald-100",
    borderHover: "hover:border-emerald-300",
    borderActive: "border-emerald-600",
    ring: "focus:ring-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
    name: "Mint Emerald"
  },
  rose: {
    primary: "bg-rose-600",
    text: "text-rose-600",
    textHover: "hover:text-rose-700",
    bgLight: "bg-rose-50/80",
    borderLight: "border-rose-100",
    borderHover: "hover:border-rose-300",
    borderActive: "border-rose-600",
    ring: "focus:ring-rose-500",
    badge: "bg-rose-50 text-rose-700 border-rose-100",
    name: "Rose Quartz"
  },
  amber: {
    primary: "bg-amber-600",
    text: "text-amber-600",
    textHover: "hover:text-amber-700",
    bgLight: "bg-amber-50/80",
    borderLight: "border-amber-100",
    borderHover: "hover:border-amber-300",
    borderActive: "border-amber-600",
    ring: "focus:ring-amber-500",
    badge: "bg-amber-50 text-amber-700 border-amber-100",
    name: "Golden Amber"
  }
};

const EXPERIENCE_SALARY_BANDS = {
  Entry: { min: 65, max: 145 },
  Mid: { min: 146, max: 325 },
  Senior: { min: 326, max: 465 },
  Executive: { min: 466, max: Number.POSITIVE_INFINITY }
} as const;

// Interface for job listing
interface Job {
  id: string;
  title: string;
  company: string;
  category: "Design" | "Engineering" | "Marketing" | "Product" | "Finance";
  location: string;
  type: "Full-time" | "Contract" | "Remote" | "Hybrid";
  salary: string;
  closes: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  companyBio: string;
  isSaved?: boolean;
  isApplied?: boolean;
  appliedStatus?: "Submitted" | "Screening" | "Interviewing" | "Offer Given" | "Archived";
  appliedDate?: string;
  applyUrl?: string;
}

// Initial mockup jobs
const INITIAL_JOBS: Job[] = [
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
    companyBio: "Stripe is a financial infrastructure platform for the internet. Millions of companies—from the world's largest enterprises to startups—use Stripe to accept payments and manage transactions."
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

// Helper to determine category styling
const getCategoryStyles = (category: string) => {
  const norm = category.toLowerCase();
  if (norm.includes("design") || norm.includes("creative") || norm.includes("ui") || norm.includes("ux")) {
    return {
      bg: "bg-blue-50/70 text-blue-600 border-blue-100",
      icon: Palette,
      label: "Design"
    };
  } else if (norm.includes("engineer") || norm.includes("developer") || norm.includes("tech") || norm.includes("backend") || norm.includes("frontend") || norm.includes("code") || norm.includes("data") || norm.includes("cloud")) {
    return {
      bg: "bg-purple-50/70 text-purple-600 border-purple-100",
      icon: Server,
      label: "Engineering"
    };
  } else if (norm.includes("marketing") || norm.includes("sales") || norm.includes("growth") || norm.includes("social") || norm.includes("brand")) {
    return {
      bg: "bg-emerald-50/70 text-emerald-600 border-emerald-100",
      icon: Megaphone,
      label: "Marketing"
    };
  } else {
    return {
      bg: "bg-amber-50/70 text-amber-600 border-amber-100",
      icon: Briefcase,
      label: category
    };
  }
};

// Curated registry of employer careers pages. Apply Now hands the candidate
// off to the real site in their default browser; anything not listed falls
// back to a targeted search so injected / unknown employers still land
// somewhere useful rather than dead-ending.
const COMPANY_CAREERS: Record<string, string> = {
  Airbnb: "https://careers.airbnb.com/",
  Stripe: "https://stripe.com/jobs",
  HubSpot: "https://www.hubspot.com/careers",
  Snowflake: "https://careers.snowflake.com/",
  Duolingo: "https://careers.duolingo.com/",
  Canva: "https://www.canva.com/careers/",
  Google: "https://careers.google.com/",
  Netflix: "https://jobs.netflix.com/",
  Figma: "https://www.figma.com/careers/"
};

const deriveApplyUrl = (job: Job): string => {
  if (job.applyUrl) return job.applyUrl;
  const known = COMPANY_CAREERS[job.company];
  if (known) return known;
  return `https://www.google.com/search?q=${encodeURIComponent(`${job.company} ${job.title} careers apply`)}`;
};

// ── Module-scope primitives ────────────────────────────────────────────────
// Small, presentational helpers used by the Profile hub's editor screens.
// Accent colour is passed in as plain class strings so these stay decoupled
// from the main component's closure and re-render cheaply.

type IconCmp = React.ComponentType<{ className?: string }>;

function Toggle({ on, onChange, accentBg, dark }: { on: boolean; onChange: () => void; accentBg: string; dark: boolean }) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={on}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ${
        on ? accentBg : (dark ? "bg-slate-700" : "bg-slate-300")
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
          on ? "translate-x-[18px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function SettingsRow({
  icon: Icon,
  iconWrap,
  title,
  subtitle,
  trailing,
  onClick,
  dark,
  accentText
}: {
  icon: IconCmp;
  iconWrap: string;
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  onClick: () => void;
  dark: boolean;
  accentText: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all group active:scale-[0.99] ${
        dark
          ? "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
          : "bg-white border-slate-200/70 hover:border-slate-300 hover:bg-slate-50/60"
      }`}
    >
      <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${iconWrap}`}>
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-[13px] font-bold truncate ${dark ? "text-white" : "text-slate-800"}`}>{title}</p>
        {subtitle && <p className="text-[11px] text-slate-500 truncate mt-0.5">{subtitle}</p>}
      </div>
      {trailing !== undefined && <div className="shrink-0 text-right">{trailing}</div>}
      <ChevronRight className={`h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${accentText}`} />
    </button>
  );
}

// Reader top-bar used by every Profile sub-screen — keeps navigation muscle
// memory identical to the Alerts reader.
function ReaderTopBar({ title, onBack, onBackLabel, right, dark, accentText }: { title: string; onBack: () => void; onBackLabel: string; right?: React.ReactNode; dark: boolean; accentText: string }) {
  return (
    <div className={`h-12 px-3 flex items-center justify-between border-b shrink-0 ${dark ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-100"}`}>
      <button onClick={onBack} className={`flex items-center gap-1 text-xs font-semibold ${accentText}`}>
        <ArrowLeft className="h-4 w-4" />
        {onBackLabel}
      </button>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[55%] text-center">{title}</span>
      <div className="w-12 flex justify-end">{right}</div>
    </div>
  );
}

export default function App() {
  // Mobile Frame Theme Color and Settings
  const [accentColor, setAccentColor] = useState<string>("blue");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [phoneTime, setPhoneTime] = useState<string>("09:41");
  const [activeTab, setActiveTab] = useState<"home" | "explore" | "saved" | "alerts" | "profile">("home");

  // Dynamic lists
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  
  // Search & Filters for Explore tab
  const [exploreQuery, setExploreQuery] = useState<string>("");
  const [exploreCategory, setExploreCategory] = useState<string>("All");
  const [exploreType, setExploreType] = useState<string>("All");

  // Advanced Search Modal State
  const [isAdvSearchOpen, setIsAdvSearchOpen] = useState<boolean>(false);
  const [isAdvSearchApplied, setIsAdvSearchApplied] = useState<boolean>(false);
  const [advKeyword, setAdvKeyword] = useState<string>("");
  const [advLocation, setAdvLocation] = useState<string>("");
  const [advExp, setAdvExp] = useState<keyof typeof EXPERIENCE_SALARY_BANDS | null>(null);
  const [advTypes, setAdvTypes] = useState<string[]>([]);
  const [advSalaryMin, setAdvSalaryMin] = useState<number>(1);
  const [advDate, setAdvDate] = useState<string>("Any time");
  const [advSkills, setAdvSkills] = useState<string[]>([]);
  const [advSkillInput, setAdvSkillInput] = useState<string>("");

  // Push notification state inside mock device
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; desc: string; time: string; read: boolean; jobId?: string; kind?: "match" | "interview" | "viewed" | "reminder" | "system" | "profile" }>>([
    { id: "1", title: "Welcome to SharpJob! 🎉", kind: "system", desc: "Your account is live and we've tailored 246 openings to your skills. Start with the Home feed for a curated shortlist, or jump into Explore to dial things in with Advanced Search. Pro tip: tap the bookmark on any card to build a save-list you can apply to later in a single tap.", time: "Just now", read: false },
    { id: "2", title: "New Job Match ✨", kind: "match", jobId: "job-1", desc: "Airbnb just published a Product Designer role that lines up with four of your saved skills — Figma, Design Systems, Prototyping and User Testing. The salary range sits inside your preferred band and applications close on Oct 28, so applying in the next 48 hours meaningfully improves your odds of a first-round review.", time: "2h ago", read: false },
    { id: "3", title: "Interview Request 📅", kind: "interview", jobId: "job-2", desc: "Great news — the API Foundations team at Stripe has reviewed your Backend Developer application and wants to schedule a 45-minute code walkthrough next week. We've emailed three calendar slots to your primary address; reply from there or confirm inside the role details to lock one in. Please have a recent project ready to walk through.", time: "1d ago", read: true },
    { id: "4", title: "Application Viewed 👀", kind: "viewed", jobId: "job-4", desc: "A recruiter at Snowflake opened your Senior Cloud Engineer application 12 minutes ago. First-response emails typically land within 48 hours of a view, so keep an eye on your inbox — and make sure your phone's notification permissions are on so we can ping you the moment something moves.", time: "3h ago", read: false },
    { id: "5", title: "Saved Role Closing Soon ⏰", kind: "reminder", jobId: "job-5", desc: "Heads up — the Brand Strategist opening at Duolingo that you bookmarked closes in under 48 hours. If it's still on your shortlist, now's the moment: open the save-list, tap Details, and use the one-tap cover-letter generator to ship a polished application in about ninety seconds.", time: "5h ago", read: false },
    { id: "6", title: "Profile Strength: 98% 💪", kind: "profile", desc: "You're one step away from a perfect profile. Adding a single portfolio link or a short 'About me' blurb unlocks the 100% badge, which — according to our internal data — increases recruiter first-response rates by roughly 2.3x. Head to the Profile tab to finish it off.", time: "Yesterday", read: true }
  ]);
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);
  const [alertsFilter, setAlertsFilter] = useState<"all" | "unread">("all");
  // id of the job whose Apply Now is mid-handoff (button shows a spinner for ~650ms
  // before we park the user on Saved — gives the tap a perceptible, designed beat
  // instead of the drawer vanishing the instant the browser takes over)
  const [openingJobId, setOpeningJobId] = useState<string | null>(null);

  // Apply Job Process State
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [applyStep, setApplyStep] = useState<number>(1);
  const [applicantName, setApplicantName] = useState<string>("Alex Mercer");
  const [applicantEmail, setApplicantEmail] = useState<string>("alex.mercer@sharpjob.dev");
  const [applicantPhone, setApplicantPhone] = useState<string>("+27 82 555 0147");
  const [applicantHeadline, setApplicantHeadline] = useState<string>("Product Designer");
  const [applicantLocation, setApplicantLocation] = useState<string>("Cape Town, ZA");
  const [applicantAbout, setApplicantAbout] = useState<string>("Product designer who ships. Six years turning fuzzy briefs into clean, shippable mobile flows. Currently obsessed with design-system tokens and accessible micro-interactions.");
  const [applicantPortfolio, setApplicantPortfolio] = useState<string>("portfolio.alexmercer.design");
  const [applicantLinkedIn, setApplicantLinkedIn] = useState<string>("linkedin.com/in/alexmercer");
  const [profileSkills, setProfileSkills] = useState<string[]>(["Product Design", "Figma", "React", "Mobile Architecture", "Tailwind CSS", "Design Systems", "Prototypes", "User Testing"]);
  const [profileSkillDraft, setProfileSkillDraft] = useState<string>("");
  const [profileSubScreen, setProfileSubScreen] = useState<null | "edit" | "resume" | "alertprefs" | "settings" | "help">(null);

  // Resume & CV
  const [resumeVersions, setResumeVersions] = useState<Array<{ name: string; date: string; size: string; active: boolean }>>([
    { name: "Alex_Mercer_CV_2026.pdf", date: "Aug 2026", size: "1.2 MB", active: true },
    { name: "Alex_Mercer_CV_2025.pdf", date: "Mar 2025", size: "980 KB", active: false },
    { name: "Alex_Mercer_CV_2024.pdf", date: "Jan 2024", size: "820 KB", active: false }
  ]);
  const [autoAttachResume, setAutoAttachResume] = useState<boolean>(true);

  // Job-alert preferences
  const [prefMatches, setPrefMatches] = useState<boolean>(true);
  const [prefInterviews, setPrefInterviews] = useState<boolean>(true);
  const [prefViews, setPrefViews] = useState<boolean>(true);
  const [prefReminders, setPrefReminders] = useState<boolean>(true);
  const [prefDigest, setPrefDigest] = useState<boolean>(false);
  const [prefFrequency, setPrefFrequency] = useState<"instant" | "hourly" | "daily">("instant");
  const [prefQuietFrom, setPrefQuietFrom] = useState<string>("22:00");
  const [prefQuietTo, setPrefQuietTo] = useState<string>("07:00");
  const [prefEmail, setPrefEmail] = useState<boolean>(true);
  const [prefPush, setPrefPush] = useState<boolean>(true);

  // App settings
  const [settingWifiOnly, setSettingWifiOnly] = useState<boolean>(false);
  const [settingHaptics, setSettingHaptics] = useState<boolean>(true);
  const [settingSound, setSettingSound] = useState<"chime" | "ping" | "none">("chime");
  const [settingLanguage, setSettingLanguage] = useState<string>("English");
  const [cacheMB, setCacheMB] = useState<number>(42);

  // Help & support
  const [helpQuery, setHelpQuery] = useState<string>("");
  const [helpOpenFaq, setHelpOpenFaq] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [uploadedResume, setUploadedResume] = useState<string | null>("Alex_Mercer_CV_2026.pdf");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [coverLetterText, setCoverLetterText] = useState<string>("");
  const [isSubmittingApp, setIsSubmittingApp] = useState<boolean>(false);

  // Simple visual confetti state
  const [confettiActive, setConfettiActive] = useState<boolean>(false);

  // Live device status bar data.
  const [batteryLevel, setBatteryLevel] = useState<number>(0.85);
  const [batteryCharging, setBatteryCharging] = useState<boolean>(false);
  const [networkLabel, setNetworkLabel] = useState<string>("Wi-Fi");
  const [networkOnline, setNetworkOnline] = useState<boolean>(true);

  // Keep mobile mode active for portrait and landscape phones.
  const [isMobileView, setIsMobileView] = useState<boolean>(() => Math.min(window.innerWidth, window.innerHeight) < 640);

  useEffect(() => {
    const handleResize = () => setIsMobileView(Math.min(window.innerWidth, window.innerHeight) < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let batteryManager: any = null;
    const handleBatteryLevelChange = () => updateBattery(batteryManager);
    const handleBatteryChargingChange = () => updateBattery(batteryManager);

    function updateBattery(manager: any) {
      setBatteryLevel(typeof manager?.level === "number" ? manager.level : 0.85);
      setBatteryCharging(Boolean(manager?.charging));
    }

    const updateNetwork = () => {
      const nav = navigator as Navigator & { connection?: any };
      const connection = nav.connection;

      setNetworkOnline(navigator.onLine);
      if (!navigator.onLine) {
        setNetworkLabel("OFF");
        return;
      }

      const effectiveTypeMap: Record<string, string> = {
        "slow-2g": "2G",
        "2g": "2G",
        "3g": "3G",
        "4g": "4G"
      };

      setNetworkLabel(effectiveTypeMap[connection?.effectiveType] || (connection?.type === "wifi" ? "Wi-Fi" : "Online"));
    };

    updateNetwork();

    const nav = navigator as Navigator & { getBattery?: () => Promise<any>; connection?: any };
    if (nav.getBattery) {
      nav.getBattery().then((manager) => {
        batteryManager = manager;
        updateBattery(manager);
        manager.addEventListener("levelchange", handleBatteryLevelChange);
        manager.addEventListener("chargingchange", handleBatteryChargingChange);
      }).catch(() => {
        batteryManager = null;
      });
    }

    const updateNetworkBound = () => updateNetwork();
    window.addEventListener("online", updateNetworkBound);
    window.addEventListener("offline", updateNetworkBound);
    nav.connection?.addEventListener?.("change", updateNetworkBound);

    return () => {
      window.removeEventListener("online", updateNetworkBound);
      window.removeEventListener("offline", updateNetworkBound);
      nav.connection?.removeEventListener?.("change", updateNetworkBound);
      if (batteryManager) {
        batteryManager.removeEventListener?.("levelchange", handleBatteryLevelChange);
        batteryManager.removeEventListener?.("chargingchange", handleBatteryChargingChange);
      }
    };
  }, []);

  // Real clock effect in status bar
  useEffect(() => {
    const updateClock = () => {
      const date = new Date();
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12; // Convert to 12-hour format
      setPhoneTime(`${hours}:${minutes} ${ampm}`);
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Set selected accent styles
  const activeAccent = ACCENTS[accentColor] || ACCENTS.blue;

  // Live profile completion score based on Edit Profile fields.
  const profileCompletionChecks = [
    applicantName.trim().length > 0,
    applicantEmail.trim().length > 0,
    applicantPhone.trim().length > 0,
    applicantHeadline.trim().length > 0,
    applicantLocation.trim().length > 0,
    applicantAbout.trim().length > 0,
    applicantPortfolio.trim().length > 0,
    applicantLinkedIn.trim().length > 0,
    profileSkills.length > 0
  ];
  const profileCompletedCount = profileCompletionChecks.filter(Boolean).length;
  const profileTotalChecks = profileCompletionChecks.length;
  const profileMissingCount = profileTotalChecks - profileCompletedCount;
  const profileStrength = Math.round((profileCompletedCount / profileCompletionChecks.length) * 100);
  const profileStrengthLabel = `${profileStrength}%`;

  useEffect(() => {
    const profileTitle = `Profile Strength: ${profileStrengthLabel} 💪`;
    const profileDesc = profileMissingCount === 0
      ? "Your profile is fully complete. You're maximising recruiter visibility and ready to apply quickly."
      : `You are ${profileMissingCount} field${profileMissingCount === 1 ? "" : "s"} away from a complete profile. Fill out missing details in Edit Profile to improve recruiter visibility.`;

    setNotifications(prev => {
      let changed = false;
      const next = prev.map(n => {
        if (n.kind !== "profile") return n;
        if (n.title === profileTitle && n.desc === profileDesc) return n;
        changed = true;
        return { ...n, title: profileTitle, desc: profileDesc };
      });
      return changed ? next : prev;
    });
  }, [profileStrengthLabel, profileMissingCount]);

  // Notification simulator trigger helper
  const triggerNotification = (message: string) => {
    const newId = (notifications.length + 1).toString();
    const newNotif = {
      id: newId,
      title: "SharpJob Alert 🔔",
      desc: message,
      time: "Just now",
      read: false
    };
    setNotifications([newNotif, ...notifications]);
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Apply Now → hand off to the employer's real site in the device's default
  // browser, while simultaneously recording the action and tucking the role
  // into Saved so the candidate has a persistent ledger of everything they've
  // acted on. The ~650ms delay before we switch tabs lets the button's
  // "Opening in browser…" state and the toast land visually before the drawer
  // closes — otherwise the tap would feel like it swallowed itself.
  const handleApplyOutbound = (job: Job, mode: "apply" | "reopen" = "apply") => {
    const url = deriveApplyUrl(job);

    // gesture-initiated open so mobile OSes hand off to the default browser /
    // new tab; the synthetic-anchor path is a belt-and-braces fallback for
    // preview sandboxes whose window.open returns null.
    const launch = (u: string) => {
      try {
        const a = document.createElement("a");
        a.href = u; a.target = "_blank"; a.rel = "noopener noreferrer";
        document.body.appendChild(a); a.click(); a.remove();
      } catch { /* swallow — the toast still tells the user what happened */ }
    };
    const openUrl = (u: string) => {
      try { const w = window.open(u, "_blank", "noopener,noreferrer"); if (!w) launch(u); }
      catch { launch(u); }
    };

    // RE-OPEN: the role is already recorded — just bounce back to the site
    // without touching state or yanking the reader closed. The candidate is
    // mid-read; stealing the page out from under them would be hostile.
    if (mode === "reopen") {
      openUrl(url);
      triggerNotification(`Re-opening ${job.company}'s application page in your browser.`);
      return;
    }

    // FIRST APPLY: record + auto-save + hand off + park on Saved. The ~650ms
    // delay lets the button's "Opening in browser…" spinner and the toast land
    // before the drawer closes, so the tap reads as a deliberate beat rather
    // than the UI swallowing itself.
    if (openingJobId) return; // debounce rapid double-taps
    const todayStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    setOpeningJobId(job.id);
    setJobs(prev => prev.map(j => j.id === job.id ? { ...j, isApplied: true, isSaved: true, appliedDate: todayStr } : j));
    setSelectedJob(prev => prev && prev.id === job.id ? { ...prev, isApplied: true, isSaved: true, appliedDate: todayStr } : prev);
    openUrl(url);

    triggerNotification(`Opening ${job.company}'s application page in your browser — this role is now saved so you can track it from Saved.`);

    window.setTimeout(() => {
      setOpeningJobId(null);
      setSelectedJob(null);
      setActiveTab("saved");
    }, 650);
  };

  // Reconcile the optimistic "applied" mark we set on Apply Now. A candidate
  // may bounce off the employer's form, hit a broken page, or apply through
  // some other channel — this lets them tell the tracker the truth without
  // leaving the drawer. Kept on Saved either way so the role stays on their
  // radar; only the applied flag (and its date) move.
  const confirmAppliedOnSite = (applied: boolean) => {
    if (!selectedJob) return;
    if (applied === Boolean(selectedJob.isApplied)) {
      triggerNotification(applied
        ? `Already marked as applied — nothing to change.`
        : `Already marked as not applied — the role stays in Saved.`);
      return;
    }
    const id = selectedJob.id;
    const todayStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const title = selectedJob.title;
    const company = selectedJob.company;
    const patch = (j: Job): Job => ({ ...j, isApplied: applied, appliedDate: applied ? todayStr : undefined, isSaved: true });
    setJobs(prev => prev.map(j => j.id === id ? patch(j) : j));
    setSelectedJob(prev => prev && prev.id === id ? patch(prev) : prev);
    triggerNotification(applied
      ? `Confirmed — "${title}" at ${company} is marked as applied. We'll surface recruiter updates on Alerts.`
      : `Marked "${title}" at ${company} as not applied. It stays in Saved so you can finish it on their site later.`);
  };

  // Toggle Save Job
  const handleToggleSave = (jobId: string, event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    
    setJobs(prevJobs =>
      prevJobs.map(job => {
        if (job.id === jobId) {
          const newState = !job.isSaved;
          triggerNotification(
            newState 
              ? `Saved "${job.title}" from ${job.company} to your bookmarks.` 
              : `Removed "${job.title}" from your bookmarks.`
          );
          return { ...job, isSaved: newState };
        }
        return job;
      })
    );

    // Also update selectedJob if open
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob(prev => prev ? { ...prev, isSaved: !prev.isSaved } : null);
    }
  };

  // Generate Tailored Cover Letter Mock
  const generateMockCoverLetter = (job: Job) => {
    const text = `Dear Hiring Team at ${job.company},

I am incredibly excited to submit my application for the ${job.title} role at your company. Having followed ${job.company}'s journey in the industry, I am consistently inspired by your mission and products.

As a designer and developer with extensive experience building intuitive web and mobile solutions, I possess the technical skills and user-centric approach required to make an immediate impact on your team. I thrive on collaborating across functions to build solutions that scale beautifully.

Thank you so much for your time and consideration. I look forward to hopefully presenting my portfolio and discussing how my background aligns with your vision.

Sincerely,
${applicantName}`;
    setCoverLetterText(text);
  };

  // Trigger Fake File Upload
  const handleMockUpload = () => {
    setIsUploading(true);
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadedResume("Alex_CV_SharpJob_Tailored.pdf");
          return 100;
        }
        return prev + 30;
      });
    }, 300);
  };

  // Complete Application submission
  const handleFinalSubmitApp = () => {
    if (!selectedJob) return;
    setIsSubmittingApp(true);

    setTimeout(() => {
      setIsSubmittingApp(false);
      setJobs(prevJobs =>
        prevJobs.map(job => {
          if (job.id === selectedJob.id) {
            return {
              ...job,
              isApplied: true,
              appliedStatus: "Submitted",
              appliedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            };
          }
          return job;
        })
      );

      // Trigger Confetti Visual Effect
      setConfettiActive(true);
      setApplyStep(4);
      triggerNotification(`Application submitted! stripe has received your resume for ${selectedJob.title}.`);

      // Turn off confetti after a few seconds
      setTimeout(() => {
        setConfettiActive(false);
      }, 5000);
    }, 1500);
  };

  const activeExperienceBand = advExp ? EXPERIENCE_SALARY_BANDS[advExp] : null;
  const isExperienceSearchActive = isAdvSearchApplied && activeExperienceBand !== null;

  // Filter Jobs for Explore view
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(exploreQuery.toLowerCase()) || 
                          job.company.toLowerCase().includes(exploreQuery.toLowerCase()) ||
                          job.location.toLowerCase().includes(exploreQuery.toLowerCase());
    
    const matchesCategory = exploreCategory === "All" || job.category === exploreCategory;
    
    const matchesType = exploreType === "All" || job.type === exploreType;

    const jobMinSalaryStr = job.salary.split('-')[0].replace(/[^0-9]/g, '');
    const jobMinSalary = jobMinSalaryStr ? parseInt(jobMinSalaryStr) / 1000 : 0;

    // Experience is a primary salary-band search and deliberately ignores every other filter.
    if (isExperienceSearchActive && activeExperienceBand) {
      return jobMinSalary >= activeExperienceBand.min && jobMinSalary <= activeExperienceBand.max;
    }

    // Other advanced filters are combined with the normal Explore filters.
    let matchesAdv = true;
    if (isAdvSearchApplied) {
      const advKMatch = !advKeyword || job.title.toLowerCase().includes(advKeyword.toLowerCase()) || job.company.toLowerCase().includes(advKeyword.toLowerCase());
      const advLMatch = !advLocation || job.location.toLowerCase().includes(advLocation.toLowerCase());
      const advTMatch = advTypes.length === 0 || advTypes.includes(job.type);
      const advSMatch = jobMinSalary >= advSalaryMin;

      const advSkillsMatch = advSkills.length === 0 || advSkills.every(skill => 
        job.requirements.some(req => req.toLowerCase().includes(skill.toLowerCase())) ||
        job.description.toLowerCase().includes(skill.toLowerCase()) ||
        job.title.toLowerCase().includes(skill.toLowerCase())
      );
      
      matchesAdv = advKMatch && advLMatch && advTMatch && advSMatch && advSkillsMatch;
    }

    return matchesSearch && matchesCategory && matchesType && matchesAdv;
  });

  const savedJobs = jobs.filter(job => job.isSaved);
  const appliedJobs = jobs.filter(job => job.isApplied);

  return (
    <div className={`${isMobileView ? "h-screen w-screen" : "min-h-screen"} bg-slate-900 font-sans text-slate-100 flex items-center justify-center antialiased select-none`}>
      {/* CENTRAL AREA: MODERN SMARTPHONE DEVICE CONTAINER */}
      <div className={`flex items-center justify-center ${isMobileView ? "h-full w-full p-0" : "p-4 md:p-8 xl:p-12"} relative overflow-hidden bg-slate-900`}>
        
        {/* Soft atmospheric backlight based on current accent */}
        {!isMobileView && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full filter blur-[100px] opacity-10 pointer-events-none transition-all duration-700 bg-blue-500" style={{ backgroundColor: accentColor === "indigo" ? "#4f46e5" : accentColor === "blue" ? "#2563eb" : accentColor === "emerald" ? "#10b981" : accentColor === "rose" ? "#f43f5e" : "#f59e0b" }} />
        )}

        {/* PHONE CHASSIS MOCKUP */}
        <div className={`relative w-full ${isMobileView ? "h-full rounded-none border-0 p-0 shadow-none" : "max-w-[400px] aspect-[9/19.5] rounded-[52px] border-[12px] p-3 shadow-2xl"} flex flex-col transition-all duration-300 select-none ${
          darkMode 
            ? "bg-slate-950 border-slate-800 text-slate-100" 
            : "bg-slate-50 border-slate-300 text-slate-800"
        }`}
        style={isMobileView ? undefined : { height: "820px" }}>
          
          {/* Hardware elements: Side buttons */}
          {!isMobileView && (
            <>
              <div className={`absolute left-[-15px] top-[140px] w-1 h-12 rounded-l-md ${darkMode ? "bg-slate-800" : "bg-slate-400"}`} />
              <div className={`absolute left-[-15px] top-[200px] w-1 h-12 rounded-l-md ${darkMode ? "bg-slate-800" : "bg-slate-400"}`} />
              <div className={`absolute right-[-15px] top-[170px] w-1.5 h-16 rounded-r-md ${darkMode ? "bg-slate-800" : "bg-slate-400"}`} />
            </>
          )}

          {/* INTERNAL PHONE SCREEN CONTAINER (Everything inside phone) */}
          <div className={`w-full h-full ${isMobileView ? "rounded-none" : "rounded-[40px]"} overflow-hidden flex flex-col relative ${
            darkMode ? "bg-slate-950 text-slate-100" : "bg-white text-slate-800"
          }`}>
            
            {/* 1. SMARTPHONE STATUS BAR (TOP ROW) */}
            <div className={`h-11 px-6 pt-3 flex items-center justify-between z-40 relative select-none shrink-0 ${
              darkMode ? "bg-slate-950 text-slate-200" : "bg-white text-slate-700"
            }`}>
              {/* Actual computer time refreshed dynamically */}
              <span className="text-xs font-semibold tracking-tight">{phoneTime}</span>

              {/* Speaker & Dynamic Camera Notch */}
              {!isMobileView && (
                <div className="absolute left-1/2 -translate-x-1/2 top-2 h-5 w-24 bg-black rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-slate-900 rounded-full absolute right-4" />
                  <div className="w-12 h-1 bg-slate-850 rounded-full absolute top-1" />
                </div>
              )}

              {/* Status Icons */}
              <div className="flex items-center gap-1.5">
                <Wifi className={`w-3.5 h-3.5 ${networkOnline ? (darkMode ? "text-slate-300" : "text-slate-600") : "text-rose-500"}`} />
                <span className="text-[10px] font-bold tracking-tighter">{networkLabel}</span>
                {/* Battery Icon */}
                <div className="w-[18px] h-2.5 rounded border border-current p-[1px] flex items-center">
                  <div
                    className={`h-full rounded-xs transition-all duration-300 ${batteryCharging ? "bg-emerald-500" : "bg-current"}`}
                    style={{ width: `${Math.round(Math.max(0, Math.min(1, batteryLevel)) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 2. REAL-TIME INTERACTIVE TOAST PUSH NOTIFICATION (Simulated banner) */}
            {toastMessage && (
              <div className="absolute top-12 left-3 right-3 z-50 animate-slide-down">
                <div className="bg-slate-900 text-white rounded-xl p-3 border border-slate-800 shadow-lg flex gap-3 items-start select-none">
                  <div className={`p-2 rounded-lg shrink-0 text-white ${activeAccent.primary}`}>
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-100 flex items-center justify-between">
                      SharpJob 
                      <span className="text-[9px] font-normal text-slate-400">now</span>
                    </p>
                    <p className="text-xs text-slate-300 font-medium leading-tight mt-0.5 line-clamp-2">
                      {toastMessage}
                    </p>
                  </div>
                  <button 
                    onClick={() => setToastMessage(null)}
                    className="text-slate-400 hover:text-white p-0.5"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* 3. APP SCREEN BODY (DYNAMIC BY TAB) */}
            <div className={`flex-1 overflow-y-auto no-scrollbar flex flex-col ${isMobileView ? "pb-20" : "pb-16"} relative`}>
              
              {/* HOME TAB SCREEN */}
              {activeTab === "home" && (
                <div className="p-5 space-y-5 flex-1 flex flex-col">
                  
                  {/* APP HEADER */}
                  <div className="flex flex-col gap-4">
                    {/* Top Row */}
                    <div className="flex items-center justify-between">
                      {/* Logo & Brand Name */}
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg text-white shrink-0 ${activeAccent.primary}`}>
                          <Briefcase className="h-4 w-4" />
                        </div>
                        <div className="leading-none">
                          <span className={`block font-semibold text-[15px] tracking-tight ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
                            SharpJob
                          </span>
                          <span className="mt-1 block text-[8px] font-medium tracking-wide text-slate-400">
                            by Player99 Inc
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* Below That: Header text */}
                    <div>
                      <h2 className={`text-2xl font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
                        Find your dream job
                      </h2>
                      <p className={`text-xs mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                        {jobs.length} jobs available for you.
                      </p>
                    </div>
                  </div>

                  {/* JOB CARDS CONTAINER */}
                  <div className="space-y-4 flex-1">
                    {jobs.map((job) => {
                      const catStyle = getCategoryStyles(job.category);
                      const CatIcon = catStyle.icon;

                      return (
                        <div
                          key={job.id}
                          onClick={() => setSelectedJob(job)}
                          className={`rounded-xl border p-4 transition-all duration-200 group cursor-pointer ${
                            darkMode 
                              ? "bg-slate-900/60 border-slate-800 hover:border-slate-700" 
                              : "bg-white border-slate-200/60 hover:border-slate-300"
                          }`}
                        >
                          {/* TOP ROW */}
                          <div className="flex items-start gap-3">
                            {/* Color-coded Icon Tile */}
                            <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${catStyle.bg}`}>
                              <CatIcon className="h-5 w-5" />
                            </div>

                            {/* Job & Company */}
                            <div className="min-w-0 flex-1">
                              <h4 className={`text-sm font-semibold truncate ${darkMode ? "text-white" : "text-slate-800"}`}>
                                {job.title}
                              </h4>
                              <p className={`text-xs mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                                {job.company}
                              </p>
                            </div>

                            {/* Bookmark Action */}
                            <button
                              onClick={(e) => handleToggleSave(job.id, e)}
                              className={`p-1.5 rounded-full transition-colors shrink-0 ${
                                job.isSaved
                                  ? `${activeAccent.text} bg-rose-50/50`
                                  : "text-slate-400 hover:text-slate-600"
                              }`}
                            >
                              <Bookmark className="h-4.5 w-4.5 fill-current" style={{ fillOpacity: job.isSaved ? 1 : 0 }} />
                            </button>
                          </div>

                          {/* MIDDLE ROW */}
                          <div className="grid grid-cols-3 gap-2 mt-3.5 pt-0.5 text-[11px] text-slate-500 select-none">
                            <div className="flex items-center gap-1 min-w-0">
                              <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                              <span className="truncate">{job.location.split("(")[0].trim()}</span>
                            </div>
                            <div className="flex items-center gap-1 min-w-0 justify-center">
                              <Briefcase className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                              <span className="truncate">{job.type}</span>
                            </div>
                            <div className="flex items-center gap-1 min-w-0 justify-end font-medium text-slate-600 dark:text-slate-400">
                              <Banknote className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                              <span className="truncate">{job.salary.includes("/yr") ? job.salary.replace(" /yr", "").split(" - ")[0] : job.salary.split(" ")[0]}</span>
                            </div>
                          </div>

                          {/* HAIRLINE DIVIDER */}
                          <div className={`border-t my-3 ${darkMode ? "border-slate-800" : "border-slate-100"}`} />

                          {/* BOTTOM ROW */}
                          <div className="flex items-center justify-between gap-2">
                            {job.isApplied ? (
                              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider animate-fade-in">
                                <CheckCircle className="h-3.5 w-3.5" />
                                <span className="truncate">Applied{job.appliedDate ? ` · ${job.appliedDate}` : ""}</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-red-500 text-[10px] font-medium uppercase tracking-wider">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>Closes {job.closes.split(",")[0]}</span>
                              </div>
                            )}
                            <span
                              className={`text-[11px] font-semibold flex items-center gap-0.5 shrink-0 ${activeAccent.text}`}
                            >
                              Details
                              <ChevronRight className="h-3.5 w-3.5" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}


              {/* EXPLORE TAB SCREEN */}
              {activeTab === "explore" && (
                <div className="p-5 space-y-4 flex-1 flex flex-col">
                  
                  {/* Explore Header */}
                  <div>
                    <h2 className={`text-xl font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
                      Explore Jobs
                    </h2>
                    <p className={`text-xs mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      Search and discover your next adventure.
                    </p>
                  </div>

                  {/* Interactive Search input & filter */}
                  <div className="space-y-2 select-none">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          value={exploreQuery}
                          onChange={e => setExploreQuery(e.target.value)}
                          placeholder="Search title, company, or location..."
                          className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 ${
                            darkMode 
                              ? "bg-slate-900 border-slate-800 text-white focus:border-slate-700 focus:ring-slate-700" 
                              : "bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-300 focus:ring-slate-300"
                          }`}
                        />
                        {exploreQuery && (
                          <button 
                            onClick={() => setExploreQuery("")}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                      <button 
                        onClick={() => setIsAdvSearchOpen(true)}
                        className={`p-2 rounded-xl border flex items-center justify-center shrink-0 transition-colors ${
                          isAdvSearchApplied 
                            ? `${activeAccent.text} bg-opacity-20 border-current shadow-sm ${darkMode ? "bg-slate-800" : "bg-slate-100"}` 
                            : (darkMode ? "border-slate-800 text-slate-400 hover:bg-slate-800" : "border-slate-200 text-slate-500 hover:bg-slate-100")
                        }`}
                        title="Advanced Search"
                      >
                        <SlidersHorizontal className="h-4.5 w-4.5" />
                      </button>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                      {["All", "Design", "Engineering", "Marketing"].map(cat => {
                        const isSelected = exploreCategory === cat;
                        return (
                          <button
                            key={cat}
                            onClick={() => setExploreCategory(cat)}
                            className={`px-3 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap border transition-all ${
                              isSelected
                                ? `${activeAccent.primary} border-transparent text-white`
                                : darkMode
                                  ? "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>

                    {/* Type Filters */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mr-1">Type:</span>
                      {["All", "Full-time", "Contract", "Remote", "Hybrid"].map(type => {
                        const isSelected = exploreType === type;
                        return (
                          <button
                            key={type}
                            onClick={() => setExploreType(type)}
                            className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                              isSelected
                                ? `bg-slate-800 text-white border-b-2 border-slate-400`
                                : "text-slate-400 hover:text-slate-600"
                            }`}
                          >
                            {type}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Explore Results */}
                  <div className="space-y-4 flex-1">
                    {filteredJobs.length > 0 ? (
                      filteredJobs.map((job) => {
                        const catStyle = getCategoryStyles(job.category);
                        const CatIcon = catStyle.icon;

                        return (
                          <div
                            key={job.id}
                            onClick={() => setSelectedJob(job)}
                            className={`rounded-xl border p-4 transition-all duration-200 group cursor-pointer ${
                              darkMode 
                                ? "bg-slate-900/60 border-slate-800 hover:border-slate-700" 
                                : "bg-white border-slate-200/60 hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${catStyle.bg}`}>
                                <CatIcon className="h-5 w-5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className={`text-sm font-semibold truncate ${darkMode ? "text-white" : "text-slate-800"}`}>
                                  {job.title}
                                </h4>
                                <p className={`text-xs mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                                  {job.company}
                                </p>
                              </div>
                              <button
                                onClick={(e) => handleToggleSave(job.id, e)}
                                className={`p-1.5 rounded-full transition-colors shrink-0 ${
                                  job.isSaved
                                    ? `${activeAccent.text} bg-rose-50/50`
                                    : "text-slate-400 hover:text-slate-600"
                                }`}
                              >
                                <Bookmark className="h-4.5 w-4.5 fill-current" style={{ fillOpacity: job.isSaved ? 1 : 0 }} />
                              </button>
                            </div>

                            <div className="grid grid-cols-3 gap-2 mt-3.5 pt-0.5 text-[11px] text-slate-500 select-none">
                              <div className="flex items-center gap-1 min-w-0">
                                <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                <span className="truncate">{job.location.split("(")[0].trim()}</span>
                              </div>
                              <div className="flex items-center gap-1 min-w-0 justify-center">
                                <Briefcase className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                <span className="truncate">{job.type}</span>
                              </div>
                              <div className="flex items-center gap-1 min-w-0 justify-end font-medium text-slate-600 dark:text-slate-400">
                                <Banknote className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                <span className="truncate">{job.salary.includes("/yr") ? job.salary.replace(" /yr", "").split(" - ")[0] : job.salary.split(" ")[0]}</span>
                              </div>
                            </div>

                            <div className={`border-t my-3 ${darkMode ? "border-slate-800" : "border-slate-100"}`} />

                            <div className="flex items-center justify-between gap-2">
                              {job.isApplied ? (
                                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider animate-fade-in">
                                  <CheckCircle className="h-3.5 w-3.5" />
                                  <span className="truncate">Applied{job.appliedDate ? ` · ${job.appliedDate}` : ""}</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-red-500 text-[10px] font-medium uppercase tracking-wider">
                                  <Calendar className="h-3.5 w-3.5" />
                                  <span>Closes {job.closes.split(",")[0]}</span>
                                </div>
                              )}
                              <span className={`text-[11px] font-semibold flex items-center gap-0.5 shrink-0 ${activeAccent.text}`}>
                                Details
                                <ChevronRight className="h-3.5 w-3.5" />
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-12 text-center text-slate-400">
                        <Search className="h-10 w-10 text-slate-500 mx-auto mb-2 opacity-40" />
                        <p className="text-sm font-semibold">No results match filters</p>
                        <p className="text-xs text-slate-500 mt-1">Try resetting your keywords or categories.</p>
                        <button
                          onClick={() => {
                            setExploreQuery("");
                            setExploreCategory("All");
                            setExploreType("All");
                          }}
                          className={`mt-3 text-xs font-semibold px-4 py-1.5 rounded-lg border ${darkMode ? "border-slate-800 text-slate-300" : "border-slate-200 text-slate-600"}`}
                        >
                          Reset Filters
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}


              {/* SAVED TAB SCREEN */}
              {activeTab === "saved" && (
                <div className="p-5 space-y-4 flex-1 flex flex-col">
                  
                  {/* Saved Header */}
                  <div>
                    <h2 className={`text-xl font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
                      Saved Jobs
                    </h2>
                    <p className={`text-xs mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      Keep track of roles you're interested in.
                    </p>
                  </div>

                  {/* Saved listings */}
                  <div className="space-y-4 flex-1">
                    {savedJobs.length > 0 ? (
                      savedJobs.map((job) => {
                        const catStyle = getCategoryStyles(job.category);
                        const CatIcon = catStyle.icon;

                        return (
                          <div
                            key={job.id}
                            onClick={() => setSelectedJob(job)}
                            className={`rounded-xl border p-4 transition-all duration-200 group cursor-pointer relative ${
                              darkMode 
                                ? "bg-slate-900/60 border-slate-800 hover:border-slate-700" 
                                : "bg-white border-slate-200/60 hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${catStyle.bg}`}>
                                <CatIcon className="h-5 w-5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className={`text-sm font-semibold truncate ${darkMode ? "text-white" : "text-slate-800"}`}>
                                  {job.title}
                                </h4>
                                <p className={`text-xs mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                                  {job.company}
                                </p>
                              </div>
                              <button
                                onClick={(e) => handleToggleSave(job.id, e)}
                                className={`p-1.5 rounded-full transition-colors shrink-0 text-red-500 bg-red-50/50 hover:bg-red-100/50`}
                              >
                                <Trash2 className="h-4.5 w-4.5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-3 gap-2 mt-3.5 pt-0.5 text-[11px] text-slate-500 select-none">
                              <div className="flex items-center gap-1 min-w-0">
                                <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                <span className="truncate">{job.location.split("(")[0].trim()}</span>
                              </div>
                              <div className="flex items-center gap-1 min-w-0 justify-center">
                                <Briefcase className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                <span className="truncate">{job.type}</span>
                              </div>
                              <div className="flex items-center gap-1 min-w-0 justify-end font-medium text-slate-600 dark:text-slate-400">
                                <Banknote className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                <span className="truncate">{job.salary.includes("/yr") ? job.salary.replace(" /yr", "").split(" - ")[0] : job.salary.split(" ")[0]}</span>
                              </div>
                            </div>

                            <div className={`border-t my-3 ${darkMode ? "border-slate-800" : "border-slate-100"}`} />

                            <div className="flex items-center justify-between gap-2">
                              {job.isApplied ? (
                                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider animate-fade-in">
                                  <CheckCircle className="h-3.5 w-3.5" />
                                  <span className="truncate">Applied{job.appliedDate ? ` · ${job.appliedDate}` : ""}</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-red-500 text-[10px] font-medium uppercase tracking-wider">
                                  <Calendar className="h-3.5 w-3.5" />
                                  <span>Closes {job.closes.split(",")[0]}</span>
                                </div>
                              )}
                              <span className={`text-[11px] font-semibold flex items-center gap-0.5 shrink-0 ${activeAccent.text}`}>
                                Details
                                <ChevronRight className="h-3.5 w-3.5" />
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-16 text-center text-slate-400">
                        <Bookmark className="h-10 w-10 text-slate-500 mx-auto mb-2 opacity-40" />
                        <p className="text-sm font-semibold">No saved jobs yet</p>
                        <p className="text-xs text-slate-500 mt-1">Tap the bookmark icon on any job card to save roles you love.</p>
                        <button
                          onClick={() => setActiveTab("explore")}
                          className={`mt-4 text-xs font-semibold px-4 py-2 rounded-lg text-white ${activeAccent.primary}`}
                        >
                          Explore Listings
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}


              {/* ALERTS TAB SCREEN (replaces the old Applied tracker) */}
              {activeTab === "alerts" && (() => {
                const selectedNotif = selectedNotificationId ? notifications.find(n => n.id === selectedNotificationId) || null : null;
                const visibleNotifs = notifications.filter(n => alertsFilter === "all" ? true : !n.read);
                const unreadCount = notifications.filter(n => !n.read).length;
                const linkedJob = selectedNotif?.jobId ? jobs.find(j => j.id === selectedNotif.jobId) || null : null;

                return (
                  <div className="flex-1 flex flex-col relative">

                    {/* LIST VIEW */}
                    {!selectedNotif && (
                      <div className="p-5 space-y-4 flex-1 flex flex-col animate-fade-in">
                        {/* Header row */}
                        <div className="flex items-end justify-between gap-3">
                          <div className="min-w-0">
                            <h2 className={`text-xl font-bold tracking-tight flex items-center gap-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
                              Alerts
                              {unreadCount > 0 && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold text-white ${activeAccent.primary}`}>
                                  {unreadCount}
                                </span>
                              )}
                            </h2>
                            <p className={`text-xs mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                              Every match, view and interview — in one place.
                            </p>
                          </div>
                          {unreadCount > 0 && (
                            <button
                              onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                              className={`text-[10px] font-bold uppercase tracking-wider shrink-0 ${activeAccent.text}`}
                            >
                              Mark all read
                            </button>
                          )}
                        </div>

                        {/* Filter chips */}
                        <div className="flex items-center gap-1.5 select-none">
                          {(["all", "unread"] as const).map(f => {
                            const isActive = alertsFilter === f;
                            const count = f === "all" ? notifications.length : unreadCount;
                            return (
                              <button
                                key={f}
                                onClick={() => setAlertsFilter(f)}
                                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all flex items-center gap-1.5 ${
                                  isActive
                                    ? `${activeAccent.primary} text-white border-transparent`
                                    : (darkMode
                                        ? "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100")
                                }`}
                              >
                                {f}
                                <span className={`text-[9px] px-1 rounded-full ${
                                  isActive ? "bg-white/20" : (darkMode ? "bg-slate-800 text-slate-400" : "bg-slate-200 text-slate-500")
                                }`}>
                                  {count}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Notification list */}
                        <div className="space-y-2 flex-1 overflow-y-auto no-scrollbar -mx-1 px-1">
                          {visibleNotifs.length === 0 ? (
                            <div className="py-16 text-center text-slate-400">
                              <BellRing className="h-10 w-10 text-slate-500 mx-auto mb-2 opacity-40" />
                              <p className="text-sm font-semibold">
                                {alertsFilter === "unread" ? "Inbox zero — nicely done." : "No alerts yet."}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                {alertsFilter === "unread"
                                  ? "You've read everything. New matches and updates will land here."
                                  : "Matches, interview requests and profile tips will show up here."}
                              </p>
                            </div>
                          ) : visibleNotifs.map((n, idx) => (
                            <button
                              key={n.id}
                              onClick={() => {
                                setSelectedNotificationId(n.id);
                                setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
                              }}
                              style={{ animationDelay: `${idx * 40}ms` }}
                              className={`w-full text-left rounded-xl border p-3.5 transition-all group relative overflow-hidden animate-fade-in ${
                                !n.read
                                  ? (darkMode
                                      ? "bg-slate-900 border-slate-800 hover:border-slate-700"
                                      : "bg-white border-slate-200/80 hover:border-slate-300")
                                  : (darkMode
                                      ? "bg-slate-900/40 border-slate-800/60 hover:border-slate-700/80"
                                      : "bg-white/60 border-slate-200/40 hover:border-slate-200")
                              }`}
                            >
                              {/* Unread accent rail */}
                              {!n.read && (
                                <span className={`absolute left-0 top-0 bottom-0 w-[3px] ${activeAccent.primary}`} />
                              )}

                              {/* Kind emoji badge */}
                              <div className="flex items-start gap-3">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0 border ${
                                  n.kind === "match" ? "bg-indigo-50 border-indigo-100" :
                                  n.kind === "interview" ? "bg-emerald-50 border-emerald-100" :
                                  n.kind === "viewed" ? "bg-amber-50 border-amber-100" :
                                  n.kind === "reminder" ? "bg-rose-50 border-rose-100" :
                                  n.kind === "profile" ? "bg-sky-50 border-sky-100" :
                                  "bg-slate-50 border-slate-100"
                                }`}>
                                  {n.kind === "match" ? "✨" :
                                   n.kind === "interview" ? "📅" :
                                   n.kind === "viewed" ? "👀" :
                                   n.kind === "reminder" ? "⏰" :
                                   n.kind === "profile" ? "💪" : "🔔"}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-2">
                                    <h4 className={`text-[13px] font-bold truncate flex items-center gap-1.5 ${
                                      !n.read
                                        ? (darkMode ? "text-white" : "text-slate-900")
                                        : (darkMode ? "text-slate-300" : "text-slate-700")
                                    }`}>
                                      {n.title}
                                      {!n.read && (
                                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeAccent.primary}`} />
                                      )}
                                    </h4>
                                    <span className="text-[9px] text-slate-400 shrink-0 font-semibold tracking-wide">
                                      {n.time}
                                    </span>
                                  </div>
                                  <p className={`mt-1 text-[11px] leading-relaxed text-slate-500 line-clamp-2 ${
                                    !n.read ? (darkMode ? "text-slate-300" : "text-slate-600") : ""
                                  }`}>
                                    {n.desc}
                                  </p>
                                </div>

                                <ChevronRight className={`h-4 w-4 shrink-0 mt-2 transition-transform ${
                                  activeAccent.text
                                } group-hover:translate-x-0.5`} />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* DETAIL / READER VIEW */}
                    {selectedNotif && (
                      <div className={`absolute inset-0 flex flex-col animate-slide-up ${
                        darkMode ? "bg-slate-950" : "bg-white"
                      }`}>
                        {/* Reader top bar */}
                        <div className={`h-12 px-3 flex items-center justify-between border-b shrink-0 ${
                          darkMode ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-100"
                        }`}>
                          <button
                            onClick={() => setSelectedNotificationId(null)}
                            className={`flex items-center gap-1 text-xs font-semibold ${activeAccent.text}`}
                          >
                            <ArrowLeft className="h-4 w-4" />
                            Alerts
                          </button>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Message
                          </span>
                          <button
                            onClick={() => {
                              setNotifications(prev => prev.filter(x => x.id !== selectedNotif.id));
                              setSelectedNotificationId(null);
                              triggerNotification("Alert dismissed.");
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-500"
                            title="Dismiss"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Reader body */}
                        <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-5">
                          {/* Kind chip + time */}
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                              selectedNotif.kind === "match" ? "bg-indigo-50 text-indigo-700 border-indigo-100" :
                              selectedNotif.kind === "interview" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                              selectedNotif.kind === "viewed" ? "bg-amber-50 text-amber-700 border-amber-100" :
                              selectedNotif.kind === "reminder" ? "bg-rose-50 text-rose-700 border-rose-100" :
                              selectedNotif.kind === "profile" ? "bg-sky-50 text-sky-700 border-sky-100" :
                              "bg-slate-50 text-slate-600 border-slate-200"
                            }`}>
                              {selectedNotif.kind || "update"}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold">{selectedNotif.time}</span>
                            {selectedNotif.read && (
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider ml-auto flex items-center gap-1">
                                <Check className="h-3 w-3" /> read
                              </span>
                            )}
                          </div>

                          {/* Big title */}
                          <h2 className={`text-[22px] font-extrabold leading-tight tracking-tight ${
                            darkMode ? "text-white" : "text-slate-900"
                          }`}>
                            {selectedNotif.title}
                          </h2>

                          {/* Hairline */}
                          <div className={`border-t ${darkMode ? "border-slate-850" : "border-slate-100"}`} />

                          {/* Full body */}
                          <p className={`text-[13px] leading-[1.7] ${
                            darkMode ? "text-slate-200" : "text-slate-700"
                          }`}>
                            {selectedNotif.desc}
                          </p>

                          {/* Linked job card (if any) */}
                          {linkedJob && (
                            <button
                              onClick={() => {
                                setSelectedJob(linkedJob);
                              }}
                              className={`w-full text-left rounded-xl border p-3 transition-all hover:-translate-y-0.5 ${
                                darkMode ? "bg-slate-900 border-slate-800 hover:border-slate-700" : "bg-slate-50 border-slate-200 hover:border-slate-300"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${
                                  getCategoryStyles(linkedJob.category).bg
                                }`}>
                                  {React.createElement(getCategoryStyles(linkedJob.category).icon, { className: "h-5 w-5" })}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                    Related opening
                                  </p>
                                  <p className={`text-xs font-bold truncate ${darkMode ? "text-white" : "text-slate-800"}`}>
                                    {linkedJob.title} • {linkedJob.company}
                                  </p>
                                  <p className="text-[10px] text-slate-500 truncate mt-0.5">
                                    {linkedJob.location} • {linkedJob.salary}
                                  </p>
                                </div>
                                <ChevronRight className={`h-4 w-4 ${activeAccent.text}`} />
                              </div>
                            </button>
                          )}

                          {/* Helper context card */}
                          <div className={`p-3 rounded-xl border ${
                            darkMode ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-100"
                          }`}>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                              From SharpJob
                            </p>
                            <p className="text-[11px] leading-relaxed text-slate-500">
                              {selectedNotif.kind === "match" && "We match you to roles using your saved skills, target salary and location preferences. Tune any of those from the Profile tab to refine future alerts."}
                              {selectedNotif.kind === "interview" && "Interview confirmations are mirrored to your primary email. If you don't see the calendar invite within 5 minutes, check spam or tap 'Resend' from the email itself."}
                              {selectedNotif.kind === "viewed" && "A 'viewed' event means a human recruiter opened your application inside their ATS. Response rates are highest within the first 72 hours of a view."}
                              {selectedNotif.kind === "reminder" && "Closing-date reminders fire 48 hours and 4 hours before a saved role stops accepting applications."}
                              {selectedNotif.kind === "profile" && "Profile Strength is calculated from completed fields, verified skills and uploaded assets. A 100% profile gets prioritised in recruiter search results."}
                              {selectedNotif.kind === "system" && "Need help? Our support team replies within one business day from the Profile tab → Help & Feedback."}
                              {!selectedNotif.kind && "This is a general product update from the SharpJob team."}
                            </p>
                          </div>
                        </div>

                        {/* Reader action bar */}
                        <div className={`p-3 border-t flex items-center gap-2 shrink-0 ${
                          darkMode ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-100"
                        }`}>
                          <button
                            onClick={() => {
                              setNotifications(prev => prev.map(x => x.id === selectedNotif.id ? { ...x, read: !x.read } : x));
                            }}
                            className={`h-10 px-3 rounded-xl text-[11px] font-bold border flex items-center gap-1.5 transition-colors ${
                              darkMode ? "border-slate-800 text-slate-300 hover:bg-slate-900" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            {selectedNotif.read ? (
                              <><span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Mark unread</>
                            ) : (
                              <><Check className="h-3.5 w-3.5" /> Mark read</>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setNotifications(prev => prev.filter(x => x.id !== selectedNotif.id));
                              setSelectedNotificationId(null);
                            }}
                            className={`h-10 px-3 rounded-xl text-[11px] font-bold border flex items-center gap-1.5 transition-colors ${
                              darkMode ? "border-slate-800 text-slate-300 hover:bg-slate-900" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Dismiss
                          </button>
                          {linkedJob ? (
                            <button
                              onClick={() => setSelectedJob(linkedJob)}
                              className={`flex-1 h-10 rounded-xl text-[11px] font-bold text-white flex items-center justify-center gap-1.5 ${activeAccent.primary}`}
                            >
                              View job <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => setSelectedNotificationId(null)}
                              className={`flex-1 h-10 rounded-xl text-[11px] font-bold text-white flex items-center justify-center gap-1.5 ${activeAccent.primary}`}
                            >
                              Done
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                  </div>
                );
              })()}


              {/* PROFILE TAB SCREEN */}
              {activeTab === "profile" && (
                <div className="relative flex-1 flex flex-col">
                  <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
                  {/* Profile Header — bound to live edit state */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className={`w-14 h-14 rounded-full border-2 overflow-hidden bg-slate-100 flex items-center justify-center ${activeAccent.borderActive}`}>
                        <div className="w-11 h-11 rounded-full bg-slate-300 flex items-center justify-center font-bold text-slate-700 text-lg tracking-tight">
                          {applicantName.trim().split(/\s+/).filter(Boolean).map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?"}
                        </div>
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full border border-white">
                        <Check className="h-2.5 w-2.5" />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className={`text-base font-bold tracking-tight truncate ${darkMode ? "text-white" : "text-slate-900"}`}>
                        {applicantName || "Your name"}
                      </h3>
                      <p className="text-xs text-slate-500 truncate">
                        {applicantHeadline || "Your headline"} • {applicantLocation || "—"}
                      </p>
                      <span className="inline-block mt-1 text-[9px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold uppercase">
                        Active Candidate
                      </span>
                    </div>
                  </div>

                  {/* Profile Quick Stats — Strength tile jumps into Edit Profile */}
                  <div className="grid grid-cols-3 gap-2 select-none">
                    <button
                      type="button"
                      aria-label="View applied jobs"
                      title="View applied jobs"
                      onClick={() => {
                        setActiveTab("saved");
                      }}
                      className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-center border border-slate-100 dark:border-slate-800 transition-all active:scale-[0.97] hover:border-emerald-300 dark:hover:border-emerald-700/60"
                    >
                      <span className="block text-sm font-bold text-slate-800 dark:text-slate-100">{appliedJobs.length}</span>
                      <span className="text-[9px] text-slate-400 font-semibold">Applied</span>
                    </button>
                    <button
                      type="button"
                      aria-label="View saved jobs"
                      title="View saved jobs"
                      onClick={() => {
                        setActiveTab("saved");
                      }}
                      className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-center border border-slate-100 dark:border-slate-800 transition-all active:scale-[0.97] hover:border-emerald-300 dark:hover:border-emerald-700/60"
                    >
                      <span className="block text-sm font-bold text-slate-800 dark:text-slate-100">{savedJobs.length}</span>
                      <span className="text-[9px] text-slate-400 font-semibold">Saved</span>
                    </button>
                    <button
                      onClick={() => setProfileSubScreen("edit")}
                      className={`p-2 rounded-xl text-center border transition-all active:scale-[0.97] ${
                        darkMode
                          ? "bg-slate-900 border-slate-800 hover:border-emerald-700/60"
                          : "bg-slate-50 border-slate-100 hover:border-emerald-300"
                      }`}
                    >
                      <span className="block text-sm font-bold text-emerald-600">{profileStrengthLabel}</span>
                      <span className="text-[9px] text-slate-400 font-semibold">Strength</span>
                    </button>
                  </div>

                  {/* ── SETTINGS HUB LIST ─────────────────────────────────── */}
                  <div className="space-y-2 pt-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                      Account &amp; preferences
                    </p>
                    <SettingsRow
                      icon={UserPen}
                      iconWrap="bg-indigo-50 text-indigo-600 border-indigo-100"
                      title="Edit Profile"
                      subtitle="Name, headline, about, skills, links"
                      dark={darkMode}
                      accentText={activeAccent.text}
                      trailing={<span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">{profileStrengthLabel}</span>}
                      onClick={() => setProfileSubScreen("edit")}
                    />
                    <SettingsRow
                      icon={FileText}
                      iconWrap="bg-blue-50 text-blue-600 border-blue-100"
                      title="Resume &amp; CV"
                      subtitle={uploadedResume || "No resume on file"}
                      dark={darkMode}
                      accentText={activeAccent.text}
                      trailing={<span className="text-[10px] text-slate-400 font-semibold">{resumeVersions.length} saved</span>}
                      onClick={() => setProfileSubScreen("resume")}
                    />
                    <SettingsRow
                      icon={BellRing}
                      iconWrap="bg-amber-50 text-amber-600 border-amber-100"
                      title="Job Alerts"
                      subtitle="Matches, interviews, digests, quiet hours"
                      dark={darkMode}
                      accentText={activeAccent.text}
                      trailing={<span className="text-[10px] text-slate-400 font-semibold capitalize">{prefFrequency}</span>}
                      onClick={() => setProfileSubScreen("alertprefs")}
                    />
                    <SettingsRow
                      icon={SettingsIcon}
                      iconWrap="bg-slate-100 text-slate-600 border-slate-200"
                      title="App Settings"
                      subtitle="Appearance, language, data, sound"
                      dark={darkMode}
                      accentText={activeAccent.text}
                      trailing={<span className="text-[10px] text-slate-400 font-semibold">{darkMode ? "Dark" : "Light"}</span>}
                      onClick={() => setProfileSubScreen("settings")}
                    />
                    <SettingsRow
                      icon={LifeBuoy}
                      iconWrap="bg-emerald-50 text-emerald-600 border-emerald-100"
                      title="Help &amp; Support"
                      subtitle="FAQs, contact us, send feedback"
                      dark={darkMode}
                      accentText={activeAccent.text}
                      trailing={<span className="text-[10px] text-slate-400 font-semibold">24/7</span>}
                      onClick={() => setProfileSubScreen("help")}
                    />
                  </div>

                  <p className="text-center text-[10px] text-slate-400 pt-1 pb-2">
                    SharpJob v1.2 · by Player99 Inc
                  </p>
                  </div>

                  {/* ── EDIT PROFILE READER ───────────────────────────────── */}
                  {profileSubScreen === "edit" && (
                    <div className={`absolute inset-0 z-40 flex flex-col animate-slide-up ${darkMode ? "bg-slate-950" : "bg-white"}`}>
                      <ReaderTopBar title="Edit Profile" onBackLabel="Profile" onBack={() => setProfileSubScreen(null)} dark={darkMode} accentText={activeAccent.text} />
                      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-5">
                        {/* Live preview card */}
                        <div className={`p-3 rounded-xl border flex items-center gap-3 ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                          <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center bg-slate-200 font-bold text-slate-700 text-sm ${activeAccent.borderActive}`}>
                            {applicantName.trim().split(/\s+/).filter(Boolean).map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?"}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Preview · recruiters see this</p>
                            <p className={`text-[13px] font-bold truncate ${darkMode ? "text-white" : "text-slate-800"}`}>{applicantName || "Your name"}</p>
                            <p className="text-[11px] text-slate-500 truncate">{applicantHeadline || "Your headline"} · {applicantLocation || "—"}</p>
                          </div>
                        </div>

                        {/* Name + email */}
                        <div className="grid grid-cols-1 gap-3">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Full name</label>
                            <input value={applicantName} onChange={e => setApplicantName(e.target.value)} className={`w-full text-xs px-3 py-2 rounded-xl border focus:outline-none focus:ring-1 ${darkMode ? "bg-slate-900 border-slate-800 text-white focus:border-slate-700" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-300"}`} />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email</label>
                            <input value={applicantEmail} onChange={e => setApplicantEmail(e.target.value)} className={`w-full text-xs px-3 py-2 rounded-xl border focus:outline-none focus:ring-1 ${darkMode ? "bg-slate-900 border-slate-800 text-white focus:border-slate-700" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-300"}`} />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Phone</label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                              <input value={applicantPhone} onChange={e => setApplicantPhone(e.target.value)} className={`w-full pl-8 pr-3 text-xs py-2 rounded-xl border focus:outline-none focus:ring-1 ${darkMode ? "bg-slate-900 border-slate-800 text-white focus:border-slate-700" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-300"}`} />
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Headline</label>
                            <input value={applicantHeadline} onChange={e => setApplicantHeadline(e.target.value)} placeholder="e.g. Product Designer" className={`w-full text-xs px-3 py-2 rounded-xl border focus:outline-none focus:ring-1 ${darkMode ? "bg-slate-900 border-slate-800 text-white focus:border-slate-700" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-300"}`} />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Location</label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                              <input value={applicantLocation} onChange={e => setApplicantLocation(e.target.value)} className={`w-full pl-8 pr-3 text-xs py-2 rounded-xl border focus:outline-none focus:ring-1 ${darkMode ? "bg-slate-900 border-slate-800 text-white focus:border-slate-700" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-300"}`} />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">About</label>
                              <span className={`text-[10px] font-bold ${applicantAbout.length > 160 ? "text-amber-500" : "text-slate-400"}`}>{applicantAbout.length}/180</span>
                            </div>
                            <textarea value={applicantAbout} maxLength={180} onChange={e => setApplicantAbout(e.target.value)} rows={3} placeholder="Two or three lines on what you do and what you're after next." className={`w-full text-xs p-3 rounded-xl border focus:outline-none focus:ring-1 resize-none leading-relaxed ${darkMode ? "bg-slate-900 border-slate-800 text-white focus:border-slate-700" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-300"}`} />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Portfolio</label>
                            <div className="relative">
                              <Link2 className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                              <input value={applicantPortfolio} onChange={e => setApplicantPortfolio(e.target.value)} className={`w-full pl-8 pr-3 text-xs py-2 rounded-xl border focus:outline-none focus:ring-1 ${darkMode ? "bg-slate-900 border-slate-800 text-white focus:border-slate-700" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-300"}`} />
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">LinkedIn</label>
                            <div className="relative">
                              <Link2 className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                              <input value={applicantLinkedIn} onChange={e => setApplicantLinkedIn(e.target.value)} className={`w-full pl-8 pr-3 text-xs py-2 rounded-xl border focus:outline-none focus:ring-1 ${darkMode ? "bg-slate-900 border-slate-800 text-white focus:border-slate-700" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-300"}`} />
                            </div>
                          </div>
                        </div>

                        {/* Skills chip editor */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Target skills</label>
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {profileSkills.map(s => (
                              <span key={s} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${darkMode ? "bg-slate-900 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-700"}`}>
                                {s}
                                <button onClick={() => setProfileSkills(prev => prev.filter(x => x !== s))} className="opacity-50 hover:opacity-100 hover:text-red-500"><X className="h-3 w-3" /></button>
                              </span>
                            ))}
                          </div>
                          <input
                            value={profileSkillDraft}
                            onChange={e => setProfileSkillDraft(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                const v = profileSkillDraft.trim();
                                if (v && !profileSkills.includes(v)) setProfileSkills([...profileSkills, v]);
                                setProfileSkillDraft("");
                              }
                            }}
                            placeholder="Add a skill · press Enter"
                            className={`w-full text-xs px-3 py-2 rounded-xl border focus:outline-none focus:ring-1 ${darkMode ? "bg-slate-900 border-slate-800 text-white focus:border-slate-700" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-300"}`}
                          />
                        </div>
                      </div>
                      <div className={`p-3 border-t shrink-0 ${darkMode ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-100"}`}>
                        <button onClick={() => { triggerNotification("Profile saved — recruiters will see the updates immediately."); setProfileSubScreen(null); }} className={`w-full h-11 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 ${activeAccent.primary}`}>
                          <Check className="h-4 w-4" /> Save profile
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── RESUME & CV READER ─────────────────────────────────── */}
                  {profileSubScreen === "resume" && (
                    <div className={`absolute inset-0 z-40 flex flex-col animate-slide-up ${darkMode ? "bg-slate-950" : "bg-white"}`}>
                      <ReaderTopBar title="Resume & CV" onBackLabel="Profile" onBack={() => setProfileSubScreen(null)} dark={darkMode} accentText={activeAccent.text} />
                      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-5">
                        {/* Current resume */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Active resume</label>
                          {uploadedResume ? (
                            <div className={`p-3 rounded-xl border flex items-center justify-between ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
                              <div className="flex items-center gap-2.5 min-w-0">
                                <FileText className={`h-5 w-5 shrink-0 ${activeAccent.text}`} />
                                <div className="min-w-0">
                                  <p className={`text-xs font-bold truncate ${darkMode ? "text-slate-200" : "text-slate-800"}`}>{uploadedResume}</p>
                                  <p className="text-[10px] text-slate-400">PDF · attached to new applications</p>
                                </div>
                              </div>
                              <button onClick={() => { setUploadedResume(null); setResumeVersions(prev => prev.map(v => ({ ...v, active: false }))); triggerNotification("Active resume removed."); }} className="text-slate-400 hover:text-red-500 p-1"><Trash2 className="h-4 w-4" /></button>
                            </div>
                          ) : (
                            <button onClick={handleMockUpload} className={`w-full h-28 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-1 text-xs font-semibold transition-colors ${isUploading ? "border-slate-300 text-slate-400" : (darkMode ? "border-slate-700 text-slate-300 hover:border-slate-600" : "border-slate-300 text-slate-500 hover:border-slate-400")}`}>
                              {isUploading ? (
                                <div className="w-full max-w-[200px] space-y-1.5 px-4">
                                  <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400"><span>Uploading</span><span>{uploadProgress}%</span></div>
                                  <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden"><div className={`h-full ${activeAccent.primary} transition-all`} style={{ width: `${uploadProgress}%` }} /></div>
                                </div>
                              ) : (<><Upload className="h-6 w-6 opacity-60" /><span>Tap to upload a PDF</span></>)}
                            </button>
                          )}
                        </div>

                        {/* Auto-attach toggle */}
                        <button onClick={() => setAutoAttachResume(v => !v)} className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
                          <div className="w-9 h-9 rounded-lg border bg-blue-50 text-blue-600 border-blue-100 flex items-center justify-center shrink-0"><Zap className="h-4 w-4" /></div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Auto-attach to applications</p>
                            <p className="text-[11px] text-slate-500">Skip the upload step on every Apply flow.</p>
                          </div>
                          <Toggle on={autoAttachResume} onChange={() => setAutoAttachResume(v => !v)} accentBg={activeAccent.primary} dark={darkMode} />
                        </button>

                        {/* Version history */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Version history</label>
                          <div className="space-y-2">
                            {resumeVersions.map(v => (
                              <div key={v.name} className={`p-3 rounded-xl border flex items-center gap-3 ${v.active ? (darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-slate-300") : (darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white/60 border-slate-200")}`}>
                                <FileText className={`h-4 w-4 shrink-0 ${v.active ? activeAccent.text : "text-slate-400"}`} />
                                <div className="min-w-0 flex-1">
                                  <p className={`text-[11px] font-bold truncate ${darkMode ? "text-slate-200" : "text-slate-800"}`}>{v.name}</p>
                                  <p className="text-[10px] text-slate-400">{v.date} · {v.size}</p>
                                </div>
                                {v.active ? (
                                  <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${activeAccent.badge} border`}>Active</span>
                                ) : (
                                  <button onClick={() => { setUploadedResume(v.name); setResumeVersions(prev => prev.map(x => ({ ...x, active: x.name === v.name }))); triggerNotification(`Restored ${v.name} as your active resume.`); }} className={`text-[10px] font-bold ${activeAccent.text}`}>Restore</button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Privacy note */}
                        <div className={`p-3 rounded-xl border flex gap-2.5 ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                          <Lock className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                          <p className="text-[11px] leading-relaxed text-slate-500">Resumes are encrypted in transit and at rest. Only recruiters you apply to can download your file — never sold, never used to train models.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── JOB ALERTS READER ──────────────────────────────────── */}
                  {profileSubScreen === "alertprefs" && (
                    <div className={`absolute inset-0 z-40 flex flex-col animate-slide-up ${darkMode ? "bg-slate-950" : "bg-white"}`}>
                      <ReaderTopBar title="Job Alerts" onBackLabel="Profile" onBack={() => setProfileSubScreen(null)} dark={darkMode} accentText={activeAccent.text} />
                      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-3">
                        <p className="text-[11px] text-slate-500 leading-relaxed -mt-1">Choose what pings you and when. Changes save instantly.</p>

                        {[
                          { icon: Sparkles, wrap: "bg-indigo-50 text-indigo-600 border-indigo-100", title: "New matches", desc: "Roles that fit your skills & salary band.", on: prefMatches, set: setPrefMatches },
                          { icon: BellRing, wrap: "bg-emerald-50 text-emerald-600 border-emerald-100", title: "Interview updates", desc: "Invites, reschedules, outcomes.", on: prefInterviews, set: setPrefInterviews },
                          { icon: CheckCircle, wrap: "bg-amber-50 text-amber-600 border-amber-100", title: "Application views", desc: "When a recruiter opens your CV.", on: prefViews, set: setPrefViews },
                          { icon: Clock, wrap: "bg-rose-50 text-rose-600 border-rose-100", title: "Closing-date reminders", desc: "48h and 4h before a saved role closes.", on: prefReminders, set: setPrefReminders },
                          { icon: Mail, wrap: "bg-sky-50 text-sky-600 border-sky-100", title: "Weekly digest", desc: "One email, Monday 08:00, top matches.", on: prefDigest, set: setPrefDigest }
                        ].map(row => {
                          const RowIcon = row.icon;
                          return (
                            <button key={row.title} onClick={() => row.set(!row.on)} className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${darkMode ? "bg-slate-900/60 border-slate-800 hover:bg-slate-900" : "bg-white border-slate-200 hover:bg-slate-50"}`}>
                              <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${row.wrap}`}><RowIcon className="h-4 w-4" /></div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>{row.title}</p>
                                <p className="text-[11px] text-slate-500">{row.desc}</p>
                              </div>
                              <Toggle on={row.on} onChange={() => row.set(!row.on)} accentBg={activeAccent.primary} dark={darkMode} />
                            </button>
                          );
                        })}

                        <div className={`border-t my-1 ${darkMode ? "border-slate-850" : "border-slate-100"}`} />

                        {/* Frequency segmented */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Delivery frequency</label>
                          <div className={`grid grid-cols-3 gap-1 p-1 rounded-xl border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                            {(["instant", "hourly", "daily"] as const).map(f => (
                              <button key={f} onClick={() => setPrefFrequency(f)} className={`py-1.5 rounded-lg text-[11px] font-bold capitalize transition-all ${prefFrequency === f ? `${activeAccent.primary} text-white` : (darkMode ? "text-slate-400" : "text-slate-500")}`}>{f}</button>
                            ))}
                          </div>
                        </div>

                        {/* Quiet hours */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Quiet hours</label>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-[9px] text-slate-400 block mb-1 font-semibold uppercase">From</span>
                              <select value={prefQuietFrom} onChange={e => setPrefQuietFrom(e.target.value)} className={`w-full text-xs px-2.5 py-2 rounded-xl border focus:outline-none ${darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`}>
                                {["20:00", "21:00", "22:00", "23:00", "00:00"].map(t => <option key={t}>{t}</option>)}
                              </select>
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-400 block mb-1 font-semibold uppercase">Until</span>
                              <select value={prefQuietTo} onChange={e => setPrefQuietTo(e.target.value)} className={`w-full text-xs px-2.5 py-2 rounded-xl border focus:outline-none ${darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`}>
                                {["06:00", "07:00", "08:00", "09:00"].map(t => <option key={t}>{t}</option>)}
                              </select>
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1.5">Alerts queue silently and deliver in a single batch at {prefQuietTo}.</p>
                        </div>

                        <div className={`border-t my-1 ${darkMode ? "border-slate-850" : "border-slate-100"}`} />

                        {/* Channels */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Channels</label>
                          <div className="space-y-2">
                            <button onClick={() => setPrefPush(v => !v)} className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
                              <div className="w-9 h-9 rounded-lg border bg-indigo-50 text-indigo-600 border-indigo-100 flex items-center justify-center shrink-0"><Bell className="h-4 w-4" /></div>
                              <div className="flex-1"><p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Push notifications</p><p className="text-[11px] text-slate-500">On this device.</p></div>
                              <Toggle on={prefPush} onChange={() => setPrefPush(v => !v)} accentBg={activeAccent.primary} dark={darkMode} />
                            </button>
                            <button onClick={() => setPrefEmail(v => !v)} className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
                              <div className="w-9 h-9 rounded-lg border bg-sky-50 text-sky-600 border-sky-100 flex items-center justify-center shrink-0"><Mail className="h-4 w-4" /></div>
                              <div className="flex-1"><p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Email</p><p className="text-[11px] text-slate-500 truncate">{applicantEmail}</p></div>
                              <Toggle on={prefEmail} onChange={() => setPrefEmail(v => !v)} accentBg={activeAccent.primary} dark={darkMode} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── APP SETTINGS READER ────────────────────────────────── */}
                  {profileSubScreen === "settings" && (
                    <div className={`absolute inset-0 z-40 flex flex-col animate-slide-up ${darkMode ? "bg-slate-950" : "bg-white"}`}>
                      <ReaderTopBar title="App Settings" onBackLabel="Profile" onBack={() => setProfileSubScreen(null)} dark={darkMode} accentText={activeAccent.text} />
                      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
                        {/* Appearance */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Appearance</label>
                          <div className={`grid grid-cols-2 gap-1 p-1 rounded-xl border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                            <button onClick={() => setDarkMode(false)} className={`py-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${!darkMode ? `${activeAccent.primary} text-white` : "text-slate-500"}`}><Sun className="h-3.5 w-3.5" /> Light</button>
                            <button onClick={() => setDarkMode(true)} className={`py-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${darkMode ? `${activeAccent.primary} text-white` : "text-slate-500"}`}><Moon className="h-3.5 w-3.5" /> Dark</button>
                          </div>
                        </div>

                        {/* Accent color */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Accent colour</label>
                          <div className="flex items-center gap-2">
                            {Object.entries(ACCENTS).map(([k, v]) => (
                              <button key={k} onClick={() => setAccentColor(k)} className={`w-8 h-8 rounded-full ${v.primary} flex items-center justify-center transition-transform ${accentColor === k ? "scale-110 ring-2 ring-offset-2 " + (darkMode ? "ring-offset-slate-950" : "ring-offset-white") + " ring-current " + v.text : "opacity-60"}`} aria-label={v.name}>
                                {accentColor === k && <Check className="h-3.5 w-3.5 text-white" />}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className={`border-t ${darkMode ? "border-slate-850" : "border-slate-100"}`} />

                        {/* Language */}
                        <div className={`p-3 rounded-xl border flex items-center gap-3 ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
                          <div className="w-9 h-9 rounded-lg border bg-emerald-50 text-emerald-600 border-emerald-100 flex items-center justify-center shrink-0"><Globe className="h-4 w-4" /></div>
                          <div className="flex-1 min-w-0"><p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Language</p><p className="text-[11px] text-slate-500">Interface & email copy.</p></div>
                          <select value={settingLanguage} onChange={e => { setSettingLanguage(e.target.value); triggerNotification(`Language set to ${e.target.value}.`); }} className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none ${darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-700"}`}>
                            <option>English</option><option>Afrikaans</option><option>isiZulu</option><option>isiXhosa</option><option>Sesotho</option>
                          </select>
                        </div>

                        {/* Currency (locked) */}
                        <div className={`p-3 rounded-xl border flex items-center gap-3 ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
                          <div className="w-9 h-9 rounded-lg border bg-amber-50 text-amber-600 border-amber-100 flex items-center justify-center shrink-0 font-black text-[11px]">R</div>
                          <div className="flex-1 min-w-0"><p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Currency</p><p className="text-[11px] text-slate-500">South African Rand (ZAR) · locked to your region.</p></div>
                        </div>

                        <div className={`border-t ${darkMode ? "border-slate-850" : "border-slate-100"}`} />

                        {/* Data + haptics */}
                        <button onClick={() => setSettingWifiOnly(v => !v)} className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
                          <div className="w-9 h-9 rounded-lg border bg-sky-50 text-sky-600 border-sky-100 flex items-center justify-center shrink-0"><Wifi className="h-4 w-4" /></div>
                          <div className="flex-1 min-w-0"><p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Wi-Fi only</p><p className="text-[11px] text-slate-500">Pause media & large syncs on mobile data.</p></div>
                          <Toggle on={settingWifiOnly} onChange={() => setSettingWifiOnly(v => !v)} accentBg={activeAccent.primary} dark={darkMode} />
                        </button>
                        <button onClick={() => setSettingHaptics(v => !v)} className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
                          <div className="w-9 h-9 rounded-lg border bg-indigo-50 text-indigo-600 border-indigo-100 flex items-center justify-center shrink-0"><Zap className="h-4 w-4" /></div>
                          <div className="flex-1 min-w-0"><p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Haptic feedback</p><p className="text-[11px] text-slate-500">Subtle taps on toggles & confirms.</p></div>
                          <Toggle on={settingHaptics} onChange={() => setSettingHaptics(v => !v)} accentBg={activeAccent.primary} dark={darkMode} />
                        </button>

                        {/* Sound */}
                        <div className={`p-3 rounded-xl border flex items-center gap-3 ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
                          <div className="w-9 h-9 rounded-lg border bg-rose-50 text-rose-600 border-rose-100 flex items-center justify-center shrink-0"><Volume2 className="h-4 w-4" /></div>
                          <div className="flex-1 min-w-0"><p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Notification sound</p></div>
                          <select value={settingSound} onChange={e => setSettingSound(e.target.value as any)} className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none capitalize ${darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-700"}`}>
                            <option value="chime">Chime</option><option value="ping">Ping</option><option value="none">None</option>
                          </select>
                        </div>

                        <div className={`border-t ${darkMode ? "border-slate-850" : "border-slate-100"}`} />

                        {/* Storage */}
                        <div className={`p-3 rounded-xl border flex items-center gap-3 ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
                          <div className="w-9 h-9 rounded-lg border bg-slate-100 text-slate-600 border-slate-200 flex items-center justify-center shrink-0"><FileText className="h-4 w-4" /></div>
                          <div className="flex-1 min-w-0"><p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Cached data</p><p className="text-[11px] text-slate-500">{cacheMB} MB · listings, avatars, icons.</p></div>
                          <button onClick={() => { setCacheMB(0); triggerNotification("Cache cleared. Listings will refresh on next open."); }} className="text-[10px] font-bold text-red-500 px-2 py-1 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100">Clear</button>
                        </div>

                        {/* Version */}
                        <div className={`p-3 rounded-xl border flex items-center justify-between ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                          <span className="text-[11px] text-slate-500 font-semibold">App version</span>
                          <span className="text-[11px] text-slate-400 font-bold">1.2.0 (build 248)</span>
                        </div>

                        {/* Sign out */}
                        <button onClick={() => { if (confirm("Sign out of SharpJob on this device?")) { triggerNotification("Signed out. (Demo only — session restored on reload.)"); setProfileSubScreen(null); } }} className="w-full flex items-center justify-center gap-1.5 p-3 rounded-xl border border-red-200 bg-red-50 text-red-600 text-[12px] font-bold hover:bg-red-100 transition-colors">
                          <Lock className="h-3.5 w-3.5" /> Sign out
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── HELP & SUPPORT READER ──────────────────────────────── */}
                  {profileSubScreen === "help" && (() => {
                    const faqs = [
                      { id: "f1", q: "How do I apply to a job?", a: "Open any job card, tap Details, then Apply Now. The three-step wizard walks you through contact info, resume attach and an optional cover letter. You can auto-generate the cover letter with one tap." },
                      { id: "f2", q: "Can recruiters see when I update my profile?", a: "Recruiters see the latest version of your profile the next time they open it. We don't send them a ping for every edit — only when you apply or explicitly share your profile." },
                      { id: "f3", q: "Why did my application status change?", a: "Status moves through Submitted → Screening → Interviewing → Offer Given as the recruiter advances you in their ATS. You'll get an alert at each step if Interview updates are enabled in Job Alerts." },
                      { id: "f4", q: "How is Profile Strength calculated?", a: "It scores completed fields (name, headline, about, skills), a verified email, an uploaded resume and at least one external link. Hitting 100% lifts your rank in recruiter search by roughly 2.3×." },
                      { id: "f5", q: "Is my data safe?", a: "Yes. Resumes and personal details are encrypted in transit and at rest. We never sell data or use it to train external models. You can delete your account any time from Help → Contact us." }
                    ];
                    const q = helpQuery.trim().toLowerCase();
                    const visibleFaqs = q ? faqs.filter(f => (f.q + " " + f.a).toLowerCase().includes(q)) : faqs;
                    return (
                      <div className={`absolute inset-0 z-40 flex flex-col animate-slide-up ${darkMode ? "bg-slate-950" : "bg-white"}`}>
                        <ReaderTopBar title="Help & Support" onBackLabel="Profile" onBack={() => setProfileSubScreen(null)} dark={darkMode} accentText={activeAccent.text} />
                        <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
                          {/* Search */}
                          <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input value={helpQuery} onChange={e => setHelpQuery(e.target.value)} placeholder="Search help articles…" className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 ${darkMode ? "bg-slate-900 border-slate-800 text-white focus:border-slate-700" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-300"}`} />
                          </div>

                          {/* FAQ accordion */}
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Frequently asked</p>
                            <div className="space-y-2">
                              {visibleFaqs.length === 0 ? (
                                <p className="text-[11px] text-slate-400 py-4 text-center">No articles match “{helpQuery}”. Try a shorter phrase or contact us below.</p>
                              ) : visibleFaqs.map(f => {
                                const open = helpOpenFaq === f.id;
                                return (
                                  <div key={f.id} className={`rounded-xl border overflow-hidden ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
                                    <button onClick={() => setHelpOpenFaq(open ? null : f.id)} className="w-full flex items-center justify-between gap-2 p-3 text-left">
                                      <span className={`text-[12px] font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>{f.q}</span>
                                      <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""} ${activeAccent.text}`} />
                                    </button>
                                    {open && (
                                      <div className={`px-3 pb-3 -mt-0.5 text-[11px] leading-relaxed animate-fade-in ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{f.a}</div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div className={`border-t ${darkMode ? "border-slate-850" : "border-slate-100"}`} />

                          {/* Contact cards */}
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Talk to a human</p>
                            <div className="space-y-2">
                              {[
                                { icon: Mail, wrap: "bg-sky-50 text-sky-600 border-sky-100", title: "Email us", meta: "support@sharpjob.co.za · replies < 1 business day" },
                                { icon: Headphones, wrap: "bg-emerald-50 text-emerald-600 border-emerald-100", title: "Live chat", meta: "Mon–Fri · 08:00–18:00 SAST" },
                                { icon: Phone, wrap: "bg-amber-50 text-amber-600 border-amber-100", title: "Call us", meta: "0800 SHARP JO · Mon–Fri · 09:00–17:00 SAST" },
                                { icon: MessageCircle, wrap: "bg-indigo-50 text-indigo-600 border-indigo-100", title: "Community forum", meta: "2.4k members · peer help & tips" }
                              ].map(c => {
                                const CIcon = c.icon;
                                return (
                                  <button key={c.title} onClick={() => triggerNotification(`Opening ${c.title.toLowerCase()}…`)} className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${darkMode ? "bg-slate-900/60 border-slate-800 hover:bg-slate-900" : "bg-white border-slate-200 hover:bg-slate-50"}`}>
                                    <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${c.wrap}`}><CIcon className="h-4 w-4" /></div>
                                    <div className="flex-1 min-w-0">
                                      <p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>{c.title}</p>
                                      <p className="text-[11px] text-slate-500 truncate">{c.meta}</p>
                                    </div>
                                    <ChevronRight className={`h-4 w-4 ${activeAccent.text}`} />
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className={`border-t ${darkMode ? "border-slate-850" : "border-slate-100"}`} />

                          {/* Rate */}
                          <div className={`p-3 rounded-xl border flex items-center justify-between ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-lg border bg-amber-50 text-amber-600 border-amber-100 flex items-center justify-center shrink-0"><Star className="h-4 w-4 fill-current" /></div>
                              <div><p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Rate SharpJob</p><p className="text-[11px] text-slate-500">Takes 10 seconds. Helps a lot.</p></div>
                            </div>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map(i => <Star key={i} className={`h-3.5 w-3.5 ${i <= 4 ? "text-amber-400 fill-current" : "text-slate-300"}`} />)}
                            </div>
                          </div>

                          {/* Feedback */}
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Send feedback</label>
                            <textarea value={feedbackText} onChange={e => setFeedbackText(e.target.value)} rows={3} placeholder="Tell us what's working, what's not, or what you wish existed…" className={`w-full text-xs p-3 rounded-xl border focus:outline-none focus:ring-1 resize-none leading-relaxed ${darkMode ? "bg-slate-900 border-slate-800 text-white focus:border-slate-700" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-300"}`} />
                          </div>

                          {/* Legal */}
                          <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1">
                            {["Terms", "Privacy", "Cookies", "POPIA"].map(l => (
                              <button key={l} onClick={() => triggerNotification(`Opening ${l} policy…`)} className="text-[10px] font-bold text-slate-400 hover:text-slate-600 underline-offset-2 hover:underline">{l}</button>
                            ))}
                          </div>
                        </div>
                        {feedbackText.trim() && (
                          <div className={`p-3 border-t shrink-0 ${darkMode ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-100"}`}>
                            <button onClick={() => { triggerNotification("Thanks — your feedback reached the Player99 team."); setFeedbackText(""); }} className={`w-full h-11 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 ${activeAccent.primary}`}>
                              <Send className="h-4 w-4" /> Send feedback
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                </div>
              )}

            </div>


            {/* SLIDABLE DETAILED JOB OVERLAY / DRAWER (INSIDE PHONE CONTAINER) */}
            {selectedJob && (
              <div className={`absolute inset-0 z-40 flex flex-col animate-slide-up ${
                darkMode ? "bg-slate-950 text-slate-100" : "bg-white text-slate-800"
              }`}>
                {/* Drawer Top Navigation Bar */}
                <div className={`h-12 px-4 flex items-center justify-between border-b shrink-0 ${
                  darkMode ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-100"
                }`}>
                  <button 
                    onClick={() => {
                      setSelectedJob(null);
                      setIsApplying(false);
                      setApplyStep(1);
                    }}
                    className={`flex items-center gap-1 text-xs font-semibold ${activeAccent.text}`}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>

                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest truncate max-w-[150px]">
                    {selectedJob.company}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleSave(selectedJob.id)}
                      className={`p-1.5 rounded-full ${selectedJob.isSaved ? "text-rose-500" : "text-slate-400"}`}
                    >
                      <Bookmark className="h-4 w-4 fill-current" style={{ fillOpacity: selectedJob.isSaved ? 1 : 0 }} />
                    </button>
                    <button
                      onClick={() => handleApplyOutbound(selectedJob, selectedJob.isApplied ? "reopen" : "apply")}
                      className={`p-1.5 rounded-full transition-colors ${darkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-800"}`}
                      title={selectedJob.isApplied ? "Re-open application in your browser" : "Apply on the company site"}
                      aria-label={selectedJob.isApplied ? "Re-open application in your browser" : "Apply on the company site"}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        triggerNotification(`Shared "${selectedJob.title}" with your clipboard!`);
                      }}
                      className="p-1.5 rounded-full text-slate-400 hover:text-slate-600"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Main Body - Job specifications */}
                <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-5">
                  
                  {/* Category, Title, Company Header */}
                  <div className="text-center pb-4 border-b border-slate-100 dark:border-slate-850">
                    <div className={`mx-auto w-12 h-12 rounded-xl border flex items-center justify-center mb-2.5 ${
                      getCategoryStyles(selectedJob.category).bg
                    }`}>
                      {React.createElement(getCategoryStyles(selectedJob.category).icon, { className: "h-6 w-6" })}
                    </div>
                    
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                      darkMode
                        ? "bg-slate-900 text-slate-300 border-slate-800"
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    }`}>
                      {selectedJob.category}
                    </span>

                    <h3 className={`text-lg font-bold mt-2 tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
                      {selectedJob.title}
                    </h3>
                    
                    <p className={`text-xs font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}>{selectedJob.company}</p>
                  </div>

                  {/* Highlights Grid — values wrap to show full content */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className={`p-3 rounded-xl border flex flex-col gap-1 ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                      <span className={`block text-[10px] uppercase font-bold tracking-wider ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Location</span>
                      <span className={`block text-[12px] font-bold leading-snug whitespace-normal break-words select-text ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{selectedJob.location}</span>
                    </div>
                    <div className={`p-3 rounded-xl border flex flex-col gap-1 ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                      <span className={`block text-[10px] uppercase font-bold tracking-wider ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Salary Range</span>
                      <span className={`block text-[12px] font-bold leading-snug whitespace-normal break-words select-text ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{selectedJob.salary}</span>
                    </div>
                    <div className={`p-3 rounded-xl border flex flex-col gap-1 ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                      <span className={`block text-[10px] uppercase font-bold tracking-wider ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Employment Type</span>
                      <span className={`block text-[12px] font-bold leading-snug whitespace-normal break-words select-text ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{selectedJob.type}</span>
                    </div>
                    <div className={`p-3 rounded-xl border flex flex-col gap-1 ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-rose-50/60 border-rose-200"}`}>
                      <span className="block text-[10px] uppercase font-bold tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 shrink-0" /> Deadline
                      </span>
                      <span className="block text-[12px] font-bold leading-snug whitespace-normal break-words select-text text-red-700 dark:text-red-400">{selectedJob.closes}</span>
                    </div>
                  </div>

                  {/* Standard Job Content Section */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <h4 className={`text-xs font-bold uppercase tracking-wide ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Job Overview</h4>
                      <p className={`text-[13px] leading-relaxed ${darkMode ? "text-slate-200" : "text-slate-800"}`}>
                        {selectedJob.description}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className={`text-xs font-bold uppercase tracking-wide ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Key Responsibilities</h4>
                      <ul className="space-y-1.5">
                        {selectedJob.responsibilities.map((resp, i) => (
                          <li key={i} className={`text-[13px] leading-relaxed flex items-start gap-2 ${darkMode ? "text-slate-200" : "text-slate-800"}`}>
                            <span className={`text-[14px] leading-[1.4] shrink-0 ${activeAccent.text}`}>•</span>
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className={`text-xs font-bold uppercase tracking-wide ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Requirements &amp; Qualifications</h4>
                      <ul className="space-y-1.5">
                        {selectedJob.requirements.map((req, i) => (
                          <li key={i} className={`text-[13px] leading-relaxed flex items-start gap-2 ${darkMode ? "text-slate-200" : "text-slate-800"}`}>
                            <span className="text-red-500 dark:text-red-400 text-[14px] leading-[1.4] shrink-0">•</span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1.5 pb-4">
                      <h4 className={`text-xs font-bold uppercase tracking-wide ${darkMode ? "text-slate-400" : "text-slate-600"}`}>About {selectedJob.company}</h4>
                      <p className={`text-[13px] leading-relaxed italic ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                        &ldquo;{selectedJob.companyBio}&rdquo;
                      </p>
                    </div>
                  </div>

                </div>

                {/* Persistent Sticky Bottom applying action bar */}
                <div className={`p-3 border-t shrink-0 space-y-2 ${
                  darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-150"
                }`}>
                  {/* Reconcile row — appears whenever the role is on Saved, so a
                      candidate who bounced off the employer's form (or applied
                      through another channel) can tell the tracker the truth
                      without leaving the drawer. A red/green yes-no semaphore
                      makes the current confirmed state legible at a glance. */}
                  {selectedJob.isSaved && (
                    <div className={`flex items-center justify-between gap-3 px-1 animate-fade-in ${
                      darkMode ? "text-slate-300" : "text-slate-700"
                    }`}>
                      <span className="flex items-center gap-1.5 min-w-0">
                        <Info className={`h-3.5 w-3.5 shrink-0 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
                        <span className="text-[10px] font-bold uppercase tracking-wider truncate">
                          Applied on their site?
                        </span>
                      </span>
                      <div className={`inline-flex p-0.5 rounded-lg border shrink-0 ${
                        darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                      }`} role="group" aria-label="Confirm whether you applied on the company site">
                        <button
                          type="button"
                          onClick={() => confirmAppliedOnSite(true)}
                          aria-pressed={Boolean(selectedJob.isApplied)}
                          className={`flex items-center gap-1 px-2.5 h-7 rounded-md text-[11px] font-bold transition-all active:scale-95 ${
                            selectedJob.isApplied
                              ? "bg-emerald-600 text-white shadow-sm"
                              : darkMode ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                          }`}
                        >
                          <Check className="h-3.5 w-3.5" />
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => confirmAppliedOnSite(false)}
                          aria-pressed={!selectedJob.isApplied}
                          className={`flex items-center gap-1 px-2.5 h-7 rounded-md text-[11px] font-bold transition-all active:scale-95 ${
                            !selectedJob.isApplied
                              ? "bg-rose-500 text-white shadow-sm"
                              : darkMode ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                          }`}
                        >
                          <X className="h-3.5 w-3.5" />
                          No
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Primary action row: save/remove + open the company site */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleSave(selectedJob.id)}
                      aria-pressed={Boolean(selectedJob.isSaved)}
                      aria-label={selectedJob.isSaved ? "Remove from Saved" : "Save this role"}
                      title={selectedJob.isSaved ? "Remove from Saved" : "Save this role"}
                      className={`h-11 w-11 border rounded-xl flex items-center justify-center transition-all active:scale-95 ${
                        selectedJob.isSaved
                          ? "bg-rose-50 border-rose-200 text-rose-500"
                          : darkMode ? "border-slate-800 text-slate-400 hover:bg-slate-850" : "border-slate-200 bg-white hover:bg-slate-100"
                      }`}
                    >
                      <Bookmark className="h-5 w-5 fill-current" style={{ fillOpacity: selectedJob.isSaved ? 1 : 0 }} />
                    </button>

                    <button
                      onClick={() => handleApplyOutbound(selectedJob, selectedJob.isApplied ? "reopen" : "apply")}
                      disabled={openingJobId === selectedJob.id}
                      aria-busy={openingJobId === selectedJob.id}
                      className={`flex-1 h-11 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                        openingJobId === selectedJob.id
                          ? "bg-slate-400 cursor-wait"
                          : selectedJob.isApplied
                            ? "bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99]"
                            : `${activeAccent.primary} active:scale-[0.99]`
                      }`}
                    >
                      {openingJobId === selectedJob.id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Opening in browser…
                        </>
                      ) : selectedJob.isApplied ? (
                        <>
                          <ExternalLink className="h-3.5 w-3.5" />
                          Re-open application
                        </>
                      ) : (
                        <>
                          <ExternalLink className="h-3.5 w-3.5" />
                          Apply on company site
                        </>
                      )}
                    </button>
                  </div>
                </div>


                {/* FULL SCREEN INTEGRATED JOB APPLICATION WIZARD SHEET (INSIDE MOBILE SPECIFICATION) */}
                {isApplying && (
                  <div className={`absolute inset-0 z-50 flex flex-col animate-slide-up ${
                    darkMode ? "bg-slate-950 text-slate-100" : "bg-white text-slate-800"
                  }`}>
                    {/* Applying Wizard Header */}
                    <div className={`h-12 px-4 flex items-center justify-between border-b shrink-0 ${
                      darkMode ? "bg-slate-900 border-slate-850" : "bg-slate-50 border-slate-100"
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className={`p-1 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-bold ${activeAccent.text}`}>
                          Step {applyStep === 4 ? 4 : applyStep}/3
                        </span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          Apply to {selectedJob.company}
                        </span>
                      </div>
                      <button 
                        onClick={() => {
                          if (applyStep === 4 || confirm("Discard current job application?")) {
                            setIsApplying(false);
                            setApplyStep(1);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-slate-600"
                      >
                        <X className="h-4.5 w-4.5" />
                      </button>
                    </div>

                    {/* Step Content Wrapper */}
                    <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
                      
                      {/* Step 1: Personal Details */}
                      {applyStep === 1 && (
                        <div className="space-y-4">
                          <div className="text-center pb-2">
                            <h4 className={`text-base font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Verify Personal Info</h4>
                            <p className="text-xs text-slate-500 mt-0.5">Please confirm your current application profile details.</p>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Full Name</label>
                              <input
                                type="text"
                                value={applicantName}
                                onChange={e => setApplicantName(e.target.value)}
                                className={`w-full text-xs px-3 py-2 rounded-xl border focus:outline-none ${
                                  darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                                }`}
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email Address</label>
                              <input
                                type="email"
                                value={applicantEmail}
                                onChange={e => setApplicantEmail(e.target.value)}
                                className={`w-full text-xs px-3 py-2 rounded-xl border focus:outline-none ${
                                  darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                                }`}
                              />
                            </div>
                            <div className="p-3 bg-amber-50 text-amber-800 rounded-xl border border-amber-100 text-[11px] leading-relaxed flex gap-2">
                              <Info className="h-4.5 w-4.5 shrink-0" />
                              <span>Your details will be synchronized instantly into the profile database dashboard!</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 2: Resume Selection */}
                      {applyStep === 2 && (
                        <div className="space-y-4">
                          <div className="text-center pb-2">
                            <h4 className={`text-base font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Attach Your Resume</h4>
                            <p className="text-xs text-slate-500 mt-0.5">Recruiters prioritize applications with complete PDFs.</p>
                          </div>

                          <div className="space-y-3">
                            {uploadedResume ? (
                              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                                darkMode ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-200"
                              }`}>
                                <div className="flex items-center gap-3 min-w-0">
                                  <FileText className={`h-6 w-6 shrink-0 ${activeAccent.text}`} />
                                  <div className="min-w-0">
                                    <p className={`text-xs font-bold truncate ${darkMode ? "text-slate-200" : "text-slate-800"}`}>
                                      {uploadedResume}
                                    </p>
                                    <p className="text-[9px] text-slate-400">PDF • 1.2 MB • Ready for delivery</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => {
                                    setUploadedResume(null);
                                    triggerNotification("Removed resume from application drawer.");
                                  }}
                                  className="text-red-500 hover:text-red-600 p-1"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <button
                                  type="button"
                                  onClick={handleMockUpload}
                                  className="w-full h-32 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:border-slate-400 transition-colors"
                                >
                                  {isUploading ? (
                                    <div className="space-y-2 w-full max-w-[200px]">
                                      <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                                        <span>Uploading...</span>
                                        <span>{uploadProgress}%</span>
                                      </div>
                                      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                        <div className={`h-full ${activeAccent.primary} transition-all duration-300`} style={{ width: `${uploadProgress}%` }} />
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <Upload className="h-8 w-8 text-slate-400 mb-1.5" />
                                      <p className="text-xs font-bold text-slate-500">Attach Alex_CV_2026.pdf</p>
                                      <p className="text-[10px] text-slate-400 mt-0.5">Click to simulate fast document upload</p>
                                    </>
                                  )}
                                </button>
                              </div>
                            )}

                            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] leading-relaxed flex gap-2">
                              <ShieldCheck className="h-4.5 w-4.5 shrink-0 text-emerald-500" />
                              <span className="text-slate-500">SharpJob encrypts resume uploads with bank-level transmission protocols.</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 3: Cover Letter generation */}
                      {applyStep === 3 && (
                        <div className="space-y-4">
                          <div className="text-center pb-2">
                            <h4 className={`text-base font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Draft Cover Letter</h4>
                            <p className="text-xs text-slate-500 mt-0.5">Introduce yourself and summarize your value.</p>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cover Letter (Optional)</span>
                              <button
                                type="button"
                                onClick={() => generateMockCoverLetter(selectedJob)}
                                className={`text-[10px] font-bold flex items-center gap-1 cursor-pointer ${activeAccent.text}`}
                              >
                                <Sparkles className="h-3.5 w-3.5" />
                                Generate matching copy
                              </button>
                            </div>

                            <textarea
                              value={coverLetterText}
                              onChange={e => setCoverLetterText(e.target.value)}
                              placeholder={`Explain why you are the perfect candidate for the ${selectedJob.title} opening...`}
                              rows={7}
                              className={`w-full text-xs p-3 rounded-xl border focus:outline-none resize-none leading-relaxed ${
                                darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                              }`}
                            />
                          </div>
                        </div>
                      )}

                      {/* Step 4: Submission success & Confetti layout */}
                      {applyStep === 4 && (
                        <div className="py-8 text-center space-y-5 animate-scale-up select-none">
                          {/* Simulated Confetti Overlay items inside phone screen */}
                          {confettiActive && (
                            <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
                              {[...Array(24)].map((_, i) => {
                                const left = Math.random() * 100;
                                const delay = Math.random() * 2;
                                const size = Math.random() * 8 + 4;
                                const colors = ["#2563eb", "#10b981", "#ef4444", "#f59e0b", "#06b6d4", "#ec4899"];
                                const color = colors[Math.floor(Math.random() * colors.length)];
                                return (
                                  <div
                                    key={i}
                                    className="absolute rounded-full animate-confetti-fall"
                                    style={{
                                      left: `${left}%`,
                                      top: `-20px`,
                                      width: `${size}px`,
                                      height: `${size}px`,
                                      backgroundColor: color,
                                      animationDelay: `${delay}s`,
                                      animationDuration: `${Math.random() * 2 + 1.5}s`
                                    }}
                                  />
                                );
                              })}
                            </div>
                          )}

                          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                            <Check className="h-8 w-8 text-emerald-600" />
                          </div>

                          <div className="space-y-2">
                            <h4 className={`text-lg font-bold ${darkMode ? "text-white" : "text-slate-850"}`}>
                              Application Submitted!
                            </h4>
                            <p className="text-xs text-slate-500 leading-relaxed max-w-[280px] mx-auto">
                              Your profile, resume, and letter were successfully dispatched to the recruitment desk at <strong>{selectedJob.company}</strong>.
                            </p>
                          </div>

                          <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-left space-y-1 max-w-[300px] mx-auto select-none">
                            <span className="block text-[10px] uppercase text-slate-400 font-bold">What happens next?</span>
                            <p className="text-[10px] text-slate-500 leading-normal">
                              The team at {selectedJob.company} will review your resume within 5 business days. Any movement — views, interview invites, decisions — will ping you on the <strong>Alerts tab</strong>.
                            </p>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Step Navigation Bar buttons */}
                    <div className={`p-4 border-t flex items-center justify-between shrink-0 ${
                      darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-150"
                    }`}>
                      {applyStep < 4 ? (
                        <>
                          <button
                            onClick={() => {
                              if (applyStep > 1) {
                                setApplyStep(prev => prev - 1);
                              } else {
                                setIsApplying(false);
                              }
                            }}
                            className="px-4 py-2.5 rounded-xl text-xs font-semibold border text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800"
                          >
                            Back
                          </button>

                          <button
                            onClick={() => {
                              if (applyStep === 1) {
                                if (!applicantName || !applicantEmail) {
                                  alert("Please verify your name and email.");
                                  return;
                                }
                                setApplyStep(2);
                              } else if (applyStep === 2) {
                                if (!uploadedResume) {
                                  alert("Please attach your resume PDF.");
                                  return;
                                }
                                setApplyStep(3);
                              } else if (applyStep === 3) {
                                handleFinalSubmitApp();
                              }
                            }}
                            className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-1 ${activeAccent.primary}`}
                          >
                            {isSubmittingApp ? (
                              <span>Submitting...</span>
                            ) : applyStep === 3 ? (
                              <>
                                Submit Application
                                <Send className="h-3.5 w-3.5" />
                              </>
                            ) : (
                              <>
                                Continue
                                <ChevronRight className="h-3.5 w-3.5" />
                              </>
                            )}
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            setIsApplying(false);
                            setSelectedJob(null);
                            setApplyStep(1);
                            setActiveTab("home");
                          }}
                          className={`w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all text-center ${activeAccent.primary}`}
                        >
                          Back to Browse
                        </button>
                      )}
                    </div>

                  </div>
                )}

              </div>
            )}


            {/* FULL SCREEN ADVANCED SEARCH MODAL (BOTTOM SHEET) */}
            {isAdvSearchOpen && (
              <div className="absolute inset-0 z-50 flex flex-col">
                <div 
                  className="absolute inset-0 bg-black/60 animate-fade-in"
                  onClick={() => setIsAdvSearchOpen(false)}
                />
                <div className={`absolute bottom-0 left-0 right-0 max-h-[85%] rounded-t-3xl flex flex-col animate-slide-up shadow-2xl ${
                  darkMode ? "bg-slate-950 border-t border-slate-800" : "bg-white border-t border-slate-200"
                }`}>
                  <div className={`flex items-center justify-between p-4 border-b shrink-0 ${
                    darkMode ? "border-slate-850" : "border-slate-100"
                  }`}>
                    <div>
                      <h3 className={`text-base font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>Advanced search</h3>
                      <p className="text-[11px] text-slate-500">Narrow down your next role.</p>
                    </div>
                    <button 
                      onClick={() => setIsAdvSearchOpen(false)} 
                      className={`p-1.5 rounded-full transition-colors ${darkMode ? "bg-slate-900 text-slate-400 hover:text-slate-200" : "bg-slate-100 text-slate-500 hover:text-slate-700"}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-5">
                    {/* Keyword */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Job title or keyword</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          value={advKeyword}
                          onChange={e => setAdvKeyword(e.target.value)}
                          placeholder="e.g. Product designer"
                          className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 ${
                            darkMode ? "bg-slate-900 border-slate-800 text-white focus:border-slate-700" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-300"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          value={advLocation}
                          onChange={e => setAdvLocation(e.target.value)}
                          placeholder="City, state, or remote"
                          className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 ${
                            darkMode ? "bg-slate-900 border-slate-800 text-white focus:border-slate-700" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-300"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Job type */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Job type</label>
                      <div className="flex flex-wrap gap-2">
                        {['Full-time', 'Contract', 'Remote', 'Hybrid'].map(type => {
                          const isActive = advTypes.includes(type);
                          return (
                            <button
                              key={type}
                              onClick={() => setAdvTypes(prev => isActive ? prev.filter(t => t !== type) : [...prev, type])}
                              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${
                                isActive 
                                  ? `${activeAccent.primary} text-white border-transparent` 
                                  : darkMode ? "border-slate-800 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              {type}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Salary range */}
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Salary range (minimum)</label>
                        <span className={`text-[11px] font-bold ${activeAccent.text}`}>
                          R{advSalaryMin}k - R750K+
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="750"
                        step="1"
                        value={advSalaryMin}
                        onChange={(e) => setAdvSalaryMin(Number(e.target.value))}
                        className={`w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer outline-none ${activeAccent.text}`}
                        style={{ accentColor: "currentColor" }}
                      />
                    </div>

                    {/* Date posted */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Date posted</label>
                      <select
                        value={advDate}
                        onChange={e => setAdvDate(e.target.value)}
                        className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 appearance-none ${
                          darkMode ? "bg-slate-900 border-slate-800 text-white focus:border-slate-700" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-300"
                        }`}
                      >
                        <option>Any time</option>
                        <option>Past 24 hours</option>
                        <option>Past week</option>
                        <option>Past month</option>
                      </select>
                    </div>

                    {/* Skills */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Skills or qualifications</label>
                      <div className="space-y-2">
                        {advSkills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {advSkills.map(skill => (
                              <span key={skill} className={`px-2 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1 ${
                                darkMode ? "bg-slate-900 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-700"
                              }`}>
                                {skill}
                                <X 
                                  className="h-3 w-3 cursor-pointer opacity-50 hover:opacity-100" 
                                  onClick={() => setAdvSkills(prev => prev.filter(s => s !== skill))} 
                                />
                              </span>
                            ))}
                          </div>
                        )}
                        <input
                          type="text"
                          value={advSkillInput}
                          onChange={e => setAdvSkillInput(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter' && advSkillInput.trim()) {
                              e.preventDefault();
                              if (!advSkills.includes(advSkillInput.trim())) setAdvSkills([...advSkills, advSkillInput.trim()]);
                              setAdvSkillInput("");
                            }
                          }}
                          placeholder="e.g. Figma, SQL (Press Enter)"
                          className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 ${
                            darkMode ? "bg-slate-900 border-slate-800 text-white focus:border-slate-700" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-300"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Experience is intentionally last because it overrides the other filters. */}
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Experience level</label>
                        <span className="text-[9px] font-semibold text-amber-600 dark:text-amber-400">Salary-band search</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(Object.keys(EXPERIENCE_SALARY_BANDS) as Array<keyof typeof EXPERIENCE_SALARY_BANDS>).map(level => (
                          <button
                            key={level}
                            onClick={() => setAdvExp(level)}
                            className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${
                              advExp === level
                                ? `${activeAccent.primary} text-white border-transparent`
                                : darkMode ? "border-slate-800 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>

                      {activeExperienceBand && (
                        <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[10px] leading-relaxed text-amber-900 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-200">
                          <Info className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                          <p>
                            <strong>{advExp} overrides every other filter.</strong> Results will only show roles with starting salaries in the {activeExperienceBand.max === Number.POSITIVE_INFINITY ? "R466,000+" : `R${activeExperienceBand.min.toLocaleString()} - R${activeExperienceBand.max.toLocaleString()}`} compensation band.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`p-4 border-t shrink-0 ${
                    darkMode ? "bg-slate-950 border-slate-850" : "bg-white border-slate-100"
                  }`}>
                    <button
                      onClick={() => {
                        setIsAdvSearchOpen(false);
                        setIsAdvSearchApplied(true);
                      }}
                      className={`w-full py-3 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-2 ${activeAccent.primary}`}
                    >
                      Search jobs
                    </button>
                    {isAdvSearchApplied && (
                      <button
                        onClick={() => {
                          setIsAdvSearchApplied(false);
                          setAdvKeyword("");
                          setAdvLocation("");
                          setAdvExp(null);
                          setAdvTypes([]);
                          setAdvSalaryMin(1);
                          setAdvDate("Any time");
                          setAdvSkills([]);
                        }}
                        className="w-full mt-2 py-2 text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        Clear advanced filters
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 4. APP BOTTOM NAVIGATION BAR (FLUSH WITH BEZEL) */}
            <div className={`absolute bottom-0 left-0 right-0 ${isMobileView ? "h-20" : "h-16"} border-t flex items-center justify-around select-none z-30 transition-all ${
              darkMode 
                ? "bg-slate-950 border-slate-900 text-slate-400" 
                : "bg-white border-slate-200/60 text-slate-500"
            }`}
            style={{ borderTopLeftRadius: isMobileView ? "0px" : "12px", borderTopRightRadius: isMobileView ? "0px" : "12px" }}>
              
              {/* Home Item */}
              <button 
                onClick={() => {
                  setActiveTab("home");
                  setSelectedJob(null);
                  setIsApplying(false);
                }}
                className={`flex flex-col items-center justify-center gap-1 ${isMobileView ? "w-16 h-16" : "w-12 h-12"} transition-all`}
              >
                <Briefcase className={`${isMobileView ? "h-5 w-5" : "h-4.5 w-4.5"} transition-colors ${
                  activeTab === "home" 
                    ? `${activeAccent.text} stroke-[2.5px]` 
                    : "text-slate-400 dark:text-slate-500"
                }`} />
                <span className={`${isMobileView ? "text-[11px]" : "text-[10px]"} tracking-tight transition-all font-medium ${
                  activeTab === "home" 
                    ? `${activeAccent.text} font-bold` 
                    : "text-slate-400 dark:text-slate-500"
                }`}>
                  Home
                </span>
              </button>

              {/* Explore Item */}
              <button 
                onClick={() => {
                  setActiveTab("explore");
                  setSelectedJob(null);
                  setIsApplying(false);
                }}
                className={`flex flex-col items-center justify-center gap-1 ${isMobileView ? "w-16 h-16" : "w-12 h-12"} transition-all`}
              >
                <Search className={`${isMobileView ? "h-5 w-5" : "h-4.5 w-4.5"} transition-colors ${
                  activeTab === "explore" 
                    ? `${activeAccent.text} stroke-[2.5px]` 
                    : "text-slate-400 dark:text-slate-500"
                }`} />
                <span className={`${isMobileView ? "text-[11px]" : "text-[10px]"} tracking-tight transition-all font-medium ${
                  activeTab === "explore" 
                    ? `${activeAccent.text} font-bold` 
                    : "text-slate-400 dark:text-slate-500"
                }`}>
                  Explore
                </span>
              </button>

              {/* Saved Item */}
              <button 
                onClick={() => {
                  setActiveTab("saved");
                  setSelectedJob(null);
                  setIsApplying(false);
                }}
                className={`flex flex-col items-center justify-center gap-1 ${isMobileView ? "w-16 h-16" : "w-12 h-12"} transition-all relative`}
              >
                <Bookmark className={`${isMobileView ? "h-5 w-5" : "h-4.5 w-4.5"} transition-colors ${
                  activeTab === "saved" 
                    ? `${activeAccent.text} stroke-[2.5px]` 
                    : "text-slate-400 dark:text-slate-500"
                }`} />
                {savedJobs.length > 0 && (
                  <span className={`absolute top-1.5 right-2 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white ${activeAccent.primary}`}>
                    {savedJobs.length}
                  </span>
                )}
                <span className={`${isMobileView ? "text-[11px]" : "text-[10px]"} tracking-tight transition-all font-medium ${
                  activeTab === "saved" 
                    ? `${activeAccent.text} font-bold` 
                    : "text-slate-400 dark:text-slate-500"
                }`}>
                  Saved
                </span>
              </button>

              {/* Alerts Item (replaces old Applied tab) */}
              <button 
                onClick={() => {
                  setActiveTab("alerts");
                  setSelectedJob(null);
                  setIsApplying(false);
                  setSelectedNotificationId(null);
                }}
                className={`flex flex-col items-center justify-center gap-1 ${isMobileView ? "w-16 h-16" : "w-12 h-12"} transition-all relative`}
              >
                <BellRing className={`${isMobileView ? "h-5 w-5" : "h-4.5 w-4.5"} transition-colors ${
                  activeTab === "alerts" 
                    ? `${activeAccent.text} stroke-[2.5px]` 
                    : "text-slate-400 dark:text-slate-500"
                }`} />
                {notifications.some(n => !n.read) && (
                  <span className={`absolute top-0.5 right-1 min-w-[14px] h-[14px] px-1 rounded-full flex items-center justify-center text-[8px] font-bold text-white border border-white ${activeAccent.primary}`}>
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
                <span className={`${isMobileView ? "text-[11px]" : "text-[10px]"} tracking-tight transition-all font-medium ${
                  activeTab === "alerts" 
                    ? `${activeAccent.text} font-bold` 
                    : "text-slate-400 dark:text-slate-500"
                }`}>
                  Alerts
                </span>
              </button>

              {/* Profile Item */}
              <button 
                onClick={() => {
                  setActiveTab("profile");
                  setSelectedJob(null);
                  setIsApplying(false);
                }}
                className={`flex flex-col items-center justify-center gap-1 ${isMobileView ? "w-16 h-16" : "w-12 h-12"} transition-all`}
              >
                <User className={`${isMobileView ? "h-5 w-5" : "h-4.5 w-4.5"} transition-colors ${
                  activeTab === "profile" 
                    ? `${activeAccent.text} stroke-[2.5px]` 
                    : "text-slate-400 dark:text-slate-500"
                }`} />
                <span className={`${isMobileView ? "text-[11px]" : "text-[10px]"} tracking-tight transition-all font-medium ${
                  activeTab === "profile" 
                    ? `${activeAccent.text} font-bold` 
                    : "text-slate-400 dark:text-slate-500"
                }`}>
                  Profile
                </span>
              </button>

            </div>

            {/* Apple Home Indicator Bar (Swipe Bar) */}
            {!isMobileView && (
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-black rounded-full z-40 opacity-70" />
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
