// Landing page content data
// All copy is user-facing — no internal page names, no tech details.

export const TRUST_ITEMS = [
  { icon: '⚡', label: 'AI Powered' },
  { icon: '🎯', label: 'ATS Friendly' },
  { icon: '🔒', label: 'Secure Analysis' },
  { icon: '🚀', label: 'Fast Results' },
  { icon: '📄', label: 'PDF & DOCX Support' },
];

export const HOW_IT_HELPS = [
  {
    id: 'upload',
    heading: 'Upload Your Resume',
    explanation:
      'Drop your PDF or DOCX resume into the platform. The system validates the file, extracts the text accurately, and prepares it for analysis — all within seconds.',
    highlights: ['PDF & DOCX', 'Instant extraction', 'Secure handling'],
  },
  {
    id: 'analyze',
    heading: 'Analyze Against a Job Description',
    explanation:
      'Paste any job description and let the AI compare it to your resume. It evaluates keyword relevance, skill alignment, and formatting quality to produce a precise ATS match score.',
    highlights: ['Keyword matching', 'Skill alignment', 'ATS scoring'],
  },
  {
    id: 'understand',
    heading: 'Understand Your ATS Score',
    explanation:
      'Receive a clear 0–100% score that shows exactly how well your resume fits the target role. See which skills matched, which are missing, and where to focus your improvements.',
    highlights: ['Match percentage', 'Skill gaps', 'Section scores'],
  },
  {
    id: 'improve',
    heading: 'Improve Before Applying',
    explanation:
      'Get AI-generated, copy-ready suggestions that tell you exactly what to change. Apply the recommendations, re-analyse, and watch your score improve before you hit submit.',
    highlights: ['AI suggestions', 'Copy-ready text', 'Iterative improvement'],
  },
];

export const CAPABILITY_CARDS = [
  {
    icon: '🤖',
    title: 'AI Resume Analysis',
    description:
      'Get an instant ATS compatibility score with matched skills, missing keywords, and section-by-section breakdown.',
  },
  {
    icon: '📈',
    title: 'Interactive Reports',
    description:
      'Visual score gauges, side-by-side skill comparisons, and prioritised recommendations in an easy-to-read format.',
  },
  {
    icon: '🗂️',
    title: 'Progress Tracking',
    description:
      'Every analysis is saved automatically. Compare scores across resume versions and track improvement over time.',
  },
  {
    icon: '🔐',
    title: 'Secure Workspace',
    description:
      'Your resumes and reports are encrypted, private, and accessible only by you — no exceptions.',
  },
];

export const BENEFITS = [
  {
    icon: '⏱️',
    title: 'Save Time',
    description:
      'Stop guessing what to change. Get specific, AI-driven feedback in seconds instead of spending hours revising blindly.',
  },
  {
    icon: '🎯',
    title: 'Improve ATS Compatibility',
    description:
      'See exactly which keywords and skills are missing so your resume gets past automated filters and reaches a human reviewer.',
  },
  {
    icon: '✅',
    title: 'Apply With Confidence',
    description:
      'Know your resume is optimised for the role before you submit. Track your improvements and apply knowing you have done the work.',
  },
];

export const PROCESS_STEPS = [
  { number: 1, label: 'Upload Resume', description: 'Drop your PDF or DOCX file' },
  { number: 2, label: 'Paste Job Description', description: 'Add the role you are targeting' },
  { number: 3, label: 'Receive AI Analysis', description: 'Get your ATS score and insights' },
  { number: 4, label: 'Improve & Apply', description: 'Apply suggestions and re-analyse' },
];
