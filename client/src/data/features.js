// Capability data for the public Features page
// Each item describes a user-facing capability — no internal pages, routes, or tech details.

export const CAPABILITIES = [
  {
    id: 'ai-resume-analysis',
    icon: '🤖',
    title: 'AI Resume Analysis',
    subtitle: 'Instant ATS match scoring',
    description:
      'Upload your resume and paste a job description to receive an AI‑generated ATS match score. The analysis identifies which skills you already have, which are missing, and gives you a clear percentage that shows how well your resume fits the role.',
    why: 'Knowing your exact match score removes guesswork. Instead of wondering whether your resume is strong enough, you get a data‑driven answer and a clear path to improve.',
    benefits: [
      'ATS compatibility score (0–100%)',
      'Matched skills identified instantly',
      'Missing skills highlighted',
      'AI‑generated improvement suggestions',
      'Section‑by‑section score breakdown',
    ],
    highlights: ['Match %', 'Skill match', 'Gap detection', 'AI suggestions'],
  },
  {
    id: 'smart-resume-upload',
    icon: '📄',
    title: 'Smart Resume Upload',
    subtitle: 'Fast, secure PDF & DOCX support',
    description:
      'Upload your resume as a PDF or DOCX file. The system validates the file type and size, extracts the text content accurately, and prepares it for analysis — all within seconds.',
    why: 'Accurate text extraction prevents the manual copy‑paste errors that lead to missed keywords. A clean starting point means your analysis results are reliable from the first attempt.',
    benefits: [
      'PDF and DOCX formats supported',
      'Automatic file validation',
      'Fast, accurate text extraction',
      'Secure file handling',
    ],
    highlights: ['Instant extraction', 'Secure handling', 'Format validation'],
  },
  {
    id: 'interactive-resume-reports',
    icon: '📈',
    title: 'Interactive Resume Reports',
    subtitle: 'Visual, actionable feedback',
    description:
      'After analysis, you receive a visual report that presents your ATS score, compares your skills to the job requirements, highlights missing keywords, and provides copy‑ready AI recommendations.',
    why: 'A visual breakdown makes it simple to see where you stand and what to fix first. Instead of reading a wall of text, you get charts, skill chips, and prioritised suggestions.',
    benefits: [
      'Visual score gauge',
      'Side‑by‑side skill comparison',
      'Missing‑skill summary',
      'AI recommendations you can copy directly',
      'Easy‑to‑read report layout',
    ],
    highlights: ['Score gauge', 'Skill chart', 'Copy‑ready tips'],
  },
  {
    id: 'resume-progress-tracking',
    icon: '🗂️',
    title: 'Resume Progress Tracking',
    subtitle: 'Track your resume evolution',
    description:
      'Every analysis you run is saved automatically. You can revisit past results, compare scores across different resume versions, and track how your improvements affect your ATS match over time.',
    why: 'Seeing your progress motivates you to keep iterating. When you can compare before‑and‑after scores, every edit feels purposeful and measurable.',
    benefits: [
      'Automatic report saving',
      'Compare scores across versions',
      'Track improvement over time',
      'Delete outdated reports anytime',
    ],
    highlights: ['Saved reports', 'Version comparison', 'Progress trends'],
  },
  {
    id: 'personal-workspace',
    icon: '🔐',
    title: 'Personal Workspace',
    subtitle: 'Your secure profile and data',
    description:
      'Create a free account to unlock your personal workspace. Manage your profile, update your password, and keep all of your analyses stored privately in one place.',
    why: 'A dedicated workspace means your resumes and reports are always available when you need them — organised, private, and ready for your next application.',
    benefits: [
      'Free account creation',
      'Profile management',
      'Secure password updates',
      'All analyses in one place',
    ],
    highlights: ['Personal profile', 'Organised workspace'],
  },
  {
    id: 'security-privacy',
    icon: '🛡️',
    title: 'Security & Privacy',
    subtitle: 'Your data is protected at every step',
    description:
      'Your resumes, reports, and personal information are encrypted and stored securely. Only you can access your data — no staff, no third parties, no exceptions.',
    why: 'Your resume contains sensitive career information. Knowing it is encrypted and private lets you focus on improving your applications without worrying about data exposure.',
    benefits: [
      'Encrypted data storage',
      'Strict access control',
      'No third‑party data sharing',
      'Privacy‑first design',
    ],
    highlights: ['Encrypted', 'Private', 'No data sharing'],
  },
];
