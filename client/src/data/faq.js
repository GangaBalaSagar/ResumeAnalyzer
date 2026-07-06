// FAQ data for the public FAQ page
// Each category contains a title and a list of question/answer items.
// POPULAR_QUESTIONS is a curated subset shown above the accordion.

export const POPULAR_QUESTIONS = [
  {
    question: 'What is Resume Analyzer Pro?',
    answer:
      'Resume Analyzer Pro is an AI‑powered platform that evaluates your resume against a job description and gives you an ATS compatibility score, skill‑gap analysis, and actionable improvement suggestions.',
  },
  {
    question: 'How is the ATS Match Score calculated?',
    answer:
      'The score combines keyword relevance, skill matching, and formatting best practices into a 0–100% rating that shows how closely your resume aligns with the target job posting.',
  },
  {
    question: 'Which file formats are supported?',
    answer:
      'You can upload PDF or DOCX files. Both formats are parsed to extract clean text before analysis begins.',
  },
  {
    question: 'Is my resume stored securely?',
    answer:
      'Yes. Your uploaded resumes and reports are encrypted at rest and can only be accessed through your authenticated account.',
  },
];

export const FAQ_CATEGORIES = [
  {
    title: 'Resume Analysis',
    icon: '🤖',
    description: 'How our AI evaluates your resume and gives you actionable feedback.',
    items: [
      {
        question: 'What is Resume Analyzer Pro?',
        answer:
          'Resume Analyzer Pro is an online platform that uses AI to evaluate your resume against a specific job description. It gives you an ATS compatibility score and concrete suggestions to improve your chances.',
      },
      {
        question: 'How does Resume Analyzer Pro analyze my resume?',
        answer:
          'You upload your resume and paste a job description. The platform extracts the text, compares it to the job requirements, and scores each section based on relevance and keyword match.',
      },
      {
        question: 'How is the ATS Match Score calculated?',
        answer:
          'The score combines keyword density, skill matching, experience relevance, and formatting best practices into a 0–100% rating that shows how closely your resume aligns with the target posting.',
      },
      {
        question: 'What insights are included in the analysis report?',
        answer:
          'The report shows your overall match percentage, a skill‑gap summary, section‑by‑section scores, and concrete suggestions you can copy directly into your resume.',
      },
    ],
  },
  {
    title: 'Resume Upload',
    icon: '📄',
    description: 'Supported file types and limits for quick analysis.',
    items: [
      {
        question: 'Which file formats are supported?',
        answer:
          'You can upload PDF or DOCX files. Both formats are parsed to extract clean text before analysis.',
      },
      {
        question: 'Is there a file size limit?',
        answer:
          'Files up to 5 MB are accepted, which covers the vast majority of standard resumes.',
      },
      {
        question: 'Can I analyze multiple resumes?',
        answer:
          'Yes. You can upload and run a separate analysis for each resume you want to compare against a job description.',
      },
    ],
  },
  {
    title: 'Reports & Results',
    icon: '📈',
    description: 'What you receive after analysis and how to use it.',
    items: [
      {
        question: 'Where can I find my previous analyses?',
        answer:
          'All your saved reports are accessible from your personal workspace. You can revisit, compare, or delete any past analysis at any time.',
      },
      {
        question: 'Can I delete old reports?',
        answer:
          'Yes. You can permanently remove any report you no longer need, with a confirmation step to prevent accidental deletion.',
      },
    ],
  },
  {
    title: 'Account',
    icon: '👤',
    description: 'Managing your account and access.',
    items: [
      {
        question: 'Do I need an account?',
        answer:
          'A free account lets you save your analysis reports, track your progress over time, and access your personal workspace from any device.',
      },
      {
        question: 'How do I reset my password?',
        answer:
          "Use the \"Forgot password?\" link on the login page. You'll receive an email with a secure reset link to create a new password.",
      },
    ],
  },
  {
    title: 'Privacy & Security',
    icon: '🔐',
    description: 'How we keep your data safe and private.',
    items: [
      {
        question: 'Is my resume stored securely?',
        answer:
          'Your uploaded resumes are encrypted at rest and can only be accessed through your authenticated account. No one else can view your data.',
      },
      {
        question: 'Who can access my uploaded resumes?',
        answer:
          'Only you. No staff members or third‑party services have access to your resumes or reports.',
      },
      {
        question: 'Is my personal information shared?',
        answer:
          'We never sell or share your personal data. It is used solely to provide the analysis service.',
      },
    ],
  },
  {
    title: 'General Questions',
    icon: '❓',
    description: 'Common questions about using the platform.',
    items: [
      {
        question: 'Who is Resume Analyzer Pro designed for?',
        answer:
          "It's built for anyone looking for a job — students, recent graduates, career switchers, and seasoned professionals.",
      },
      {
        question: 'Can I use it for different job applications?',
        answer:
          'Yes. You can run a fresh analysis for each job description you target, allowing you to tailor your resume per application.',
      },
      {
        question: 'What makes Resume Analyzer Pro different from manually editing my resume?',
        answer:
          'It provides data‑driven, AI‑generated suggestions backed by ATS criteria. This saves you time and helps you address gaps you might miss on your own.',
      },
    ],
  },
];
