// Shared mock data for the LMS prototype. Numbers are kept internally consistent
// so every role's dashboard tells the same story from a different angle.

export type Role = "admin" | "manager" | "instructor" | "student";

export type UserStatus = "active" | "suspended" | "invited";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  courses: number;
  lastActive: string;
  created: string;
  avatarTone: string;
}

export type CourseStatus = "published" | "draft" | "archived";
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface Lesson {
  id: string;
  order: number;
  title: string;
  duration: string;
  status: "published" | "draft";
  type: "video" | "reading";
  summary: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  instructor: string;
  instructorId: string;
  status: CourseStatus;
  students: number;
  completion: number;
  quizAvg: number;
  rating: number;
  updated: string;
  duration: string;
  thumbId: string;
  lessons: Lesson[];
}

export type BlogStatus = "published" | "draft";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  status: BlogStatus;
  category: string;
  tags: string[];
  published: string;
  updated: string;
  views: number;
  readingTime: string;
  coverId: string;
  body: string[];
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correct: number;
}

export interface Quiz {
  id: string;
  title: string;
  courseId: string;
  courseTitle: string;
  status: "published" | "draft";
  questions: QuizQuestion[];
}

export const platformStats = {
  totalUsers: 2481,
  students: 2104,
  instructors: 142,
  contentManagers: 28,
  admins: 7,
  totalCourses: 86,
  publishedCourses: 71,
  totalEnrollments: 12840,
  activeLearners: 1893,
  totalBlogPosts: 64,
};

export const roleMeta: Record<
  Role | "public",
  { label: string; accent: string; softBg: string }
> = {
  admin: { label: "Administrator", accent: "var(--color-admin)", softBg: "#eef2ff" },
  manager: { label: "Content Manager", accent: "var(--color-manager)", softBg: "#f5f3ff" },
  instructor: { label: "Instructor", accent: "var(--color-instructor)", softBg: "#ecfdf5" },
  student: { label: "Student", accent: "var(--color-student)", softBg: "#eff6ff" },
  public: { label: "Guest", accent: "var(--color-primary)", softBg: "#eef2ff" },
};

const tones = ["#4f46e5", "#0d9488", "#d97706", "#db2777", "#2563eb", "#7c3aed", "#059669"];
const tone = (i: number) => tones[i % tones.length];

export const users: User[] = [
  { id: "u1", name: "Aisha Rahman", email: "aisha.rahman@lumen.edu", role: "instructor", status: "active", courses: 4, lastActive: "Today", created: "Mar 2024", avatarTone: tone(0) },
  { id: "u2", name: "Tanvir Ahmed", email: "tanvir.ahmed@lumen.edu", role: "student", status: "active", courses: 6, lastActive: "2h ago", created: "Jan 2025", avatarTone: tone(1) },
  { id: "u3", name: "Sarah Karim", email: "sarah.karim@lumen.edu", role: "manager", status: "active", courses: 12, lastActive: "Yesterday", created: "Nov 2023", avatarTone: tone(2) },
  { id: "u4", name: "Mahmud Hasan", email: "mahmud.hasan@lumen.edu", role: "instructor", status: "active", courses: 3, lastActive: "Today", created: "Jun 2024", avatarTone: tone(3) },
  { id: "u5", name: "Nadia Islam", email: "nadia.islam@lumen.edu", role: "student", status: "suspended", courses: 2, lastActive: "12d ago", created: "Feb 2025", avatarTone: tone(4) },
  { id: "u6", name: "Omar Faruk", email: "omar.faruk@lumen.edu", role: "admin", status: "active", courses: 0, lastActive: "Today", created: "Aug 2023", avatarTone: tone(5) },
  { id: "u7", name: "Rifat Chowdhury", email: "rifat.c@lumen.edu", role: "student", status: "active", courses: 3, lastActive: "5h ago", created: "Mar 2025", avatarTone: tone(6) },
  { id: "u8", name: "Layla Noor", email: "layla.noor@lumen.edu", role: "manager", status: "invited", courses: 0, lastActive: "Never", created: "Aug 2026", avatarTone: tone(0) },
  { id: "u9", name: "Imran Kabir", email: "imran.kabir@lumen.edu", role: "instructor", status: "active", courses: 2, lastActive: "3h ago", created: "Sep 2024", avatarTone: tone(1) },
  { id: "u10", name: "Fatima Zohra", email: "fatima.zohra@lumen.edu", role: "student", status: "active", courses: 5, lastActive: "1h ago", created: "Dec 2024", avatarTone: tone(2) },
];

function mkLessons(names: [string, string][], base = 0): Lesson[] {
  return names.map(([title, summary], i) => ({
    id: `l${base}-${i + 1}`,
    order: i + 1,
    title,
    summary,
    duration: `${8 + ((i * 7) % 22)} min`,
    status: i < names.length - 1 ? "published" : "draft",
    type: i % 3 === 0 ? "reading" : "video",
  }));
}

export const courses: Course[] = [
  {
    id: "c1", title: "Machine Learning Fundamentals", slug: "machine-learning-fundamentals",
    description: "Build a rigorous mental model of supervised learning, from linear models through model evaluation, with hands-on notebooks at every step.",
    category: "Data Science", difficulty: "Intermediate", instructor: "Aisha Rahman", instructorId: "u1",
    status: "published", students: 156, completion: 72, quizAvg: 84, rating: 4.8, updated: "2 days ago", duration: "6h 20m", thumbId: "1518770660439-4636190af475",
    lessons: mkLessons([
      ["Introduction to Machine Learning", "What ML is, when to use it, and the supervised learning framing."],
      ["Data Preparation", "Cleaning, splitting, and feature scaling for reliable models."],
      ["Regression", "Fitting and interpreting linear and polynomial regression."],
      ["Classification", "Logistic regression, decision boundaries, and metrics."],
      ["Model Evaluation", "Cross-validation, bias-variance, and avoiding overfitting."],
      ["Regularization & Tuning", "Ridge, Lasso, and hyperparameter search."],
      ["Ensemble Methods", "Bagging, boosting, and random forests in practice."],
      ["Capstone: End-to-End Model", "Ship a full pipeline on a real dataset."],
    ], 1),
  },
  {
    id: "c2", title: "Deep Learning with PyTorch", slug: "deep-learning-pytorch",
    description: "Train modern neural networks from tensors to transformers, with an emphasis on debugging and reproducible experiments.",
    category: "Data Science", difficulty: "Advanced", instructor: "Aisha Rahman", instructorId: "u1",
    status: "published", students: 98, completion: 61, quizAvg: 79, rating: 4.7, updated: "5 days ago", duration: "8h 05m", thumbId: "1620712943543-bcc4688e7485",
    lessons: mkLessons([
      ["Tensors & Autograd", "The computational graph and automatic differentiation."],
      ["Building Neural Nets", "Modules, layers, and the training loop."],
      ["Convolutional Networks", "Vision architectures and feature maps."],
      ["Sequence Models", "RNNs, attention, and the transformer block."],
      ["Training at Scale", "Mixed precision, checkpointing, and schedulers."],
      ["Deploying Models", "Exporting and serving trained networks."],
    ], 2),
  },
  {
    id: "c3", title: "Python for Data Science", slug: "python-for-data-science",
    description: "A practical foundation in Python, NumPy, and pandas for analysis, visualization, and reproducible data workflows.",
    category: "Programming", difficulty: "Beginner", instructor: "Mahmud Hasan", instructorId: "u4",
    status: "published", students: 243, completion: 81, quizAvg: 88, rating: 4.9, updated: "1 day ago", duration: "5h 10m", thumbId: "1526379095098-d400fd0bf935",
    lessons: mkLessons([
      ["Python Essentials", "Syntax, data types, and control flow refresher."],
      ["Working with NumPy", "Vectorized arrays and broadcasting."],
      ["Data Wrangling with pandas", "Loading, cleaning, and reshaping data."],
      ["Visualization", "Communicating findings with clean charts."],
      ["Reproducible Notebooks", "Structure and share your analysis."],
    ], 3),
  },
  {
    id: "c4", title: "Computer Vision Essentials", slug: "computer-vision-essentials",
    description: "From image basics to object detection, learn the techniques powering modern visual systems.",
    category: "Data Science", difficulty: "Intermediate", instructor: "Imran Kabir", instructorId: "u9",
    status: "published", students: 74, completion: 55, quizAvg: 76, rating: 4.6, updated: "1 week ago", duration: "6h 45m", thumbId: "1550751827-4bd374c3f58b",
    lessons: mkLessons([
      ["Images as Arrays", "Pixels, channels, and color spaces."],
      ["Filtering & Edges", "Convolutions and classic feature detectors."],
      ["Classification", "Training a vision classifier."],
      ["Object Detection", "Bounding boxes and detection heads."],
    ], 4),
  },
  {
    id: "c5", title: "Introduction to Cybersecurity", slug: "introduction-to-cybersecurity",
    description: "Understand threats, defenses, and secure design principles that underpin trustworthy systems.",
    category: "Security", difficulty: "Beginner", instructor: "Mahmud Hasan", instructorId: "u4",
    status: "draft", students: 0, completion: 0, quizAvg: 0, rating: 0, updated: "3 days ago", duration: "4h 30m", thumbId: "1550751827-4bd374c3f58b",
    lessons: mkLessons([
      ["The Threat Landscape", "Attackers, motives, and common attacks."],
      ["Authentication & Access", "Identity, passwords, and access control."],
      ["Network Security", "Firewalls, TLS, and safe communication."],
      ["Secure Design", "Building systems that fail safely."],
    ], 5),
  },
  {
    id: "c6", title: "Data Visualization with D3", slug: "data-visualization-d3",
    description: "Craft bespoke, interactive visualizations that make complex data legible and compelling.",
    category: "Programming", difficulty: "Intermediate", instructor: "Imran Kabir", instructorId: "u9",
    status: "published", students: 61, completion: 64, quizAvg: 81, rating: 4.5, updated: "4 days ago", duration: "5h 55m", thumbId: "1551288049-bebda4e38f71",
    lessons: mkLessons([
      ["Selections & Data Join", "Binding data to the DOM."],
      ["Scales & Axes", "Mapping data to visual space."],
      ["Interaction", "Transitions, tooltips, and zoom."],
      ["Layouts", "Hierarchies, networks, and maps."],
    ], 6),
  },
];

export const enrollmentTrend = [
  { month: "Jan", value: 620 }, { month: "Feb", value: 740 }, { month: "Mar", value: 910 },
  { month: "Apr", value: 1020 }, { month: "May", value: 1180 }, { month: "Jun", value: 1340 },
  { month: "Jul", value: 1510 }, { month: "Aug", value: 1720 },
];

export const userDistribution = [
  { label: "Students", value: platformStats.students, color: "#2563eb" },
  { label: "Instructors", value: platformStats.instructors, color: "#0d9488" },
  { label: "Content Managers", value: platformStats.contentManagers, color: "#7c3aed" },
  { label: "Admins", value: platformStats.admins, color: "#4f46e5" },
];

export const platformActivity = [
  { id: "a1", kind: "user", text: "Layla Noor was invited as a Content Manager", who: "System", time: "8 min ago" },
  { id: "a2", kind: "course", text: "Aisha Rahman published “Model Evaluation” in ML Fundamentals", who: "Aisha Rahman", time: "42 min ago" },
  { id: "a3", kind: "blog", text: "Sarah Karim published a blog post: The State of ML Education", who: "Sarah Karim", time: "1h ago" },
  { id: "a4", kind: "enroll", text: "38 students enrolled in Python for Data Science", who: "System", time: "2h ago" },
  { id: "a5", kind: "quiz", text: "Tanvir Ahmed completed Module 3 Assessment (82%)", who: "Tanvir Ahmed", time: "3h ago" },
  { id: "a6", kind: "user", text: "Nadia Islam was suspended for policy review", who: "Omar Faruk", time: "5h ago" },
];

export const blogPosts: BlogPost[] = [
  {
    id: "b1", title: "The State of ML Education in 2026", slug: "state-of-ml-education-2026",
    excerpt: "How project-based curricula and evaluation-first teaching are reshaping how learners build durable machine-learning skills.",
    author: "Sarah Karim", status: "published", category: "Education", tags: ["Machine Learning", "Pedagogy"],
    published: "Aug 18, 2026", updated: "Aug 20, 2026", views: 4820, readingTime: "7 min read", coverId: "1516321318423-f06f85e504b3",
    body: [
      "For years, machine-learning education optimized for breadth: cram every algorithm into a semester and hope intuition follows. The results were predictable — learners could name a dozen models but froze the moment a dataset misbehaved.",
      "The shift underway is subtle but profound. Evaluation-first teaching asks a different opening question: not “which model?” but “how will we know it works?” Starting from validation reframes everything downstream.",
      "Project-based cohorts reinforce this. When a learner ships an end-to-end pipeline, the abstract suddenly has stakes. Overfitting is no longer a slide — it is the reason their model embarrassed them on Friday.",
      "The platforms that thrive will be the ones that make feedback loops tight, honest, and frequent. Everything else is decoration.",
    ],
  },
  {
    id: "b2", title: "Designing Assessments Students Actually Trust", slug: "assessments-students-trust",
    excerpt: "Good quizzes measure understanding, not memory. A practical framework for writing questions that reward reasoning.",
    author: "Sarah Karim", status: "published", category: "Assessment", tags: ["Quizzes", "Design"],
    published: "Aug 10, 2026", updated: "Aug 11, 2026", views: 3110, readingTime: "5 min read", coverId: "1434030216411-0b793f4b4173",
    body: [
      "A quiz is a promise. It tells learners: this is what mattered. Break that promise — with trick questions or trivia — and engagement quietly collapses.",
      "The strongest assessments isolate one concept per question and make the distractors meaningful. Every wrong answer should represent a real misconception worth surfacing.",
      "Immediate, explanatory feedback turns a score into a lesson. That is the whole game.",
    ],
  },
  {
    id: "b3", title: "From Notebook to Production: A Field Guide", slug: "notebook-to-production",
    excerpt: "The unglamorous engineering that separates a demo from a deployed model — and how to teach it early.",
    author: "Aisha Rahman", status: "published", category: "Engineering", tags: ["MLOps", "Deployment"],
    published: "Jul 29, 2026", updated: "Jul 30, 2026", views: 2540, readingTime: "8 min read", coverId: "1555949963-aa79dcee981c",
    body: [
      "Most models die in a notebook. Not because they are bad, but because the path to production is never taught alongside the modeling.",
      "Reproducibility is the first bridge: pin your data, seed your randomness, and version your experiments before you chase accuracy.",
      "Serving is the second. A model behind a stable interface, monitored and rollback-ready, is worth ten clever ones in a notebook nobody can run.",
    ],
  },
  {
    id: "b4", title: "Why Cohorts Beat Content Libraries", slug: "cohorts-beat-libraries",
    excerpt: "A draft exploring the completion gap between self-paced libraries and time-boxed cohorts.",
    author: "Layla Noor", status: "draft", category: "Education", tags: ["Cohorts", "Retention"],
    published: "—", updated: "Aug 24, 2026", views: 0, readingTime: "6 min read", coverId: "1523240795612-9a054b0db644",
    body: [
      "This draft examines completion data across two delivery models and argues that accountability, not content quality, is the dominant variable.",
    ],
  },
];

export const quizzes: Quiz[] = [
  {
    id: "q1", title: "Module 3 Assessment", courseId: "c1", courseTitle: "Machine Learning Fundamentals", status: "published",
    questions: [
      { id: "q1-1", prompt: "What is the primary purpose of cross-validation?", options: ["Increase dataset size", "Estimate generalization performance", "Remove all outliers", "Increase model parameters"], correct: 1 },
      { id: "q1-2", prompt: "Which metric is most appropriate for an imbalanced classification problem?", options: ["Accuracy", "F1 score", "Mean squared error", "R-squared"], correct: 1 },
      { id: "q1-3", prompt: "High variance in a model most often indicates:", options: ["Underfitting", "Overfitting", "Perfect fit", "Data leakage only"], correct: 1 },
      { id: "q1-4", prompt: "Regularization primarily helps by:", options: ["Adding more features", "Penalizing large coefficients", "Increasing learning rate", "Removing the test set"], correct: 1 },
      { id: "q1-5", prompt: "A good train/validation/test split ensures:", options: ["The test set tunes the model", "No information leaks into evaluation", "Larger models always win", "Metrics are optional"], correct: 1 },
    ],
  },
];

export interface StudentProgressRow {
  id: string;
  name: string;
  avatarTone: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  quizScore: number;
  lastActive: string;
  atRisk: boolean;
}

export const studentProgress: StudentProgressRow[] = [
  { id: "s1", name: "Aisha Rahman", avatarTone: tone(0), progress: 80, completedLessons: 8, totalLessons: 10, quizScore: 91, lastActive: "Today", atRisk: false },
  { id: "s2", name: "Tanvir Ahmed", avatarTone: tone(1), progress: 60, completedLessons: 6, totalLessons: 10, quizScore: 82, lastActive: "2h ago", atRisk: false },
  { id: "s3", name: "Fatima Zohra", avatarTone: tone(2), progress: 95, completedLessons: 10, totalLessons: 10, quizScore: 96, lastActive: "1h ago", atRisk: false },
  { id: "s4", name: "Rifat Chowdhury", avatarTone: tone(3), progress: 30, completedLessons: 3, totalLessons: 10, quizScore: 58, lastActive: "6d ago", atRisk: true },
  { id: "s5", name: "Nadia Islam", avatarTone: tone(4), progress: 20, completedLessons: 2, totalLessons: 10, quizScore: 44, lastActive: "12d ago", atRisk: true },
  { id: "s6", name: "Karim Uddin", avatarTone: tone(5), progress: 72, completedLessons: 7, totalLessons: 10, quizScore: 78, lastActive: "Yesterday", atRisk: false },
];

// Student-centric enrolled courses with personal progress
export const myLearning = [
  { courseId: "c1", progress: 60, lessonsCompleted: 5, lastLesson: "Model Evaluation" },
  { courseId: "c3", progress: 35, lessonsCompleted: 2, lastLesson: "Data Wrangling with pandas" },
  { courseId: "c2", progress: 82, lessonsCompleted: 5, lastLesson: "Training at Scale" },
];

export const recentQuizResults = [
  { quiz: "Module 3 Assessment", course: "ML Fundamentals", score: 82, date: "Aug 22, 2026" },
  { quiz: "PyTorch Basics Quiz", course: "Deep Learning", score: 90, date: "Aug 19, 2026" },
  { quiz: "pandas Checkpoint", course: "Python for Data Science", score: 74, date: "Aug 15, 2026" },
];

export const studentActivity = [
  { text: "Completed lesson “Regression” in ML Fundamentals", time: "2h ago" },
  { text: "Scored 82% on Module 3 Assessment", time: "3h ago" },
  { text: "Enrolled in Deep Learning with PyTorch", time: "Yesterday" },
  { text: "Completed lesson “Data Wrangling” in Python for Data Science", time: "2d ago" },
];

export const categories = ["All", "Data Science", "Programming", "Security", "Design"];

export function courseBySlug(slug: string) {
  return courses.find((c) => c.slug === slug);
}
export function postBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
export function unsplash(id: string, w = 800, h = 480) {
  return `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format`;
}
