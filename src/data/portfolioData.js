/* ==========================================================================
   PORTFOLIO DATA
   --------------------------------------------------------------------------
   This is the only file you need to edit to personalise the site.

   • Everything below is SAMPLE content - replace it with your own.
   • Optional fields (resume, project links, profile photo, location...) hide
     their UI automatically when left empty (''), so nothing ever renders as a
     dead button or broken link.
   • Search for "TODO" to find the values you must change before publishing.
   • The <title> and <meta> tags live in /index.html - update them there too.
   ========================================================================== */

// TODO: your real email address. Used for the contact card and the mailto fallback.
const EMAIL = 'agaidalmin36@gmail.com'

/* ---------- Identity & hero ---------- */
export const profile = {
  name: 'Min Agaid', // TODO
  greeting: "Hello, I'm",
  roles: ['Information Technology Student', 'Aspiring IT Professional'],
  // Optional status pill above the greeting, e.g. 'Open to internship opportunities'. Hidden while empty.
  availability: '',
  intro:
    'I enjoy turning ideas into reliable, well-designed software and keeping systems running smoothly. I am looking for an internship where I can learn from experienced teams, contribute to real projects, and grow into a well-rounded IT professional.',

  // Put your photo in /public (e.g. /public/profile.jpg) and set '/profile.jpg'.
  // While empty, a monogram placeholder is shown instead.
  image: '/profile.jpg',

  // Put your CV in /public (e.g. /public/resume.pdf) and set '/resume.pdf'.
  // While empty, the "Download CV" buttons are hidden.
  resume: '',

  // Small floating chips next to the profile picture. Icons: see components/ui/icons.js
  badges: [
    { label: 'Web Development', icon: 'code' },
    { label: 'Databases', icon: 'database' },
    { label: 'Networking', icon: 'network' },
  ],
}

/* ---------- Navigation (ids must match each section's id) ---------- */
export const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]

/* ---------- Social links ----------
   Supported ids: github, linkedin, email. */
export const socials = [
  { id: 'github', label: 'GitHub', url: 'https://github.com/almin-agaid' },
  { id: 'email', label: 'Email', url: `mailto:${EMAIL}` },
]

/* ---------- About ---------- */
export const about = {
  bio: [
    'I am an Information Technology student with a strong interest in building practical software and understanding how the systems behind it fit together. I learn best by building, so most of what I know comes from hands-on projects, labs, and plenty of debugging.',
    'Outside of coursework I enjoy exploring new tools, improving my web development skills, and documenting what I learn so that it is easy to revisit and share with others.',
  ],
  facts: [
    { label: 'Studying', value: 'BS in Information Technology' },
    { label: 'Focus', value: 'Web development & databases' },
    { label: 'Looking for', value: 'Internship opportunities' },
  ],
  interests: [
    { icon: 'code', label: 'Web & software development' },
    { icon: 'database', label: 'Database design' },
    { icon: 'network', label: 'Networking & infrastructure' },
    { icon: 'shield', label: 'Cybersecurity fundamentals' },
    { icon: 'lightbulb', label: 'Learning emerging technologies' },
  ],
  goals: {
    summary:
      'I want to start my career in a collaborative engineering or IT team, where I can contribute from day one while learning from experienced professionals.',
    items: [
      'Complete an internship in web development or IT support',
      'Deepen my skills in full-stack development and cloud basics',
      'Earn industry-recognised certifications',
      'Grow into a dependable software or systems professional',
    ],
  },
}

/* ---------- Skills ----------
   No percentages on purpose - list only what you can genuinely speak to.
   Add, remove or rename categories freely.
   Each skill is either a plain string (shown as a text chip) or { name, icon } (shown as a
   logo tile when that icon exists in components/ui/techIcons.js, otherwise as a text chip). */
export const skillCategories = [
  {
    id: 'languages',
    title: 'Programming Languages',
    description: 'Languages I use to build and automate.',
    icon: 'code',
    skills: [
      { name: 'JavaScript', icon: 'javascript' },
      { name: 'Kotlin', icon: 'kotlin' },
      { name: 'Java', icon: 'java' },
      { name: 'PHP', icon: 'php' },
    ],
  },
  {
    id: 'web',
    title: 'Web Development',
    description: 'Building responsive, accessible interfaces.',
    icon: 'globe',
    skills: [
      { name: 'HTML5', icon: 'html5' },
      { name: 'CSS3', icon: 'css3' },
      { name: 'React.js', icon: 'react' },
      { name: 'Tailwind CSS', icon: 'tailwind' },
      { name: 'Laravel', icon: 'laravel' },
    ],
  },
  {
    id: 'databases',
    title: 'Database Management',
    description: 'Designing and querying structured data.',
    icon: 'database',
    skills: [
      { name: 'MySQL', icon: 'mysql' },
      { name: 'SQLite', icon: 'sqlite' },
    ],
  },
  {
    id: 'tools',
    title: 'Development Tools',
    description: 'My day-to-day tooling.',
    icon: 'wrench',
    // { name, icon } entries show as logo tiles (logos live in components/ui/techIcons.js).
    skills: [
      { name: 'Git', icon: 'git' },
      { name: 'GitHub', icon: 'github' },
      { name: 'VS Code', icon: 'vscode' },
      { name: 'Figma', icon: 'figma' },
    ],
  },
  {
    id: 'other',
    title: 'Other Technical Skills',
    description: 'Fundamentals that support everything else.',
    icon: 'cpu',
    skills: ['Networking Basics', 'Cisco Packet Tracer'],
  },
]

/* ---------- Projects ----------
   Add a new object to this array to add a project - the grid, modal and
   animations pick it up automatically.

   images  : screenshots. Put the files in /public/projects/ and list them as
             { src: '/projects/name.jpg', caption: 'Login', alt: 'what the screenshot shows' }.
             The first one is the card cover; with 2 or more, the details window gets a
             screenshot switcher. Use [] for a generated preview instead.
   badge   : optional small label beside the title, e.g. 'Capstone project' (hidden when empty)
   tech    : technology tags (the tag row is hidden while the list is empty)
   icon    : only used by the generated preview, see components/ui/icons.js
   github  : repository URL or '' (button hidden)
   live    : deployed URL or ''   (button hidden)
   year    : e.g. '2025', or '' (hidden) */
export const projects = [
  {
    id: 'pinca-faculty-system',
    title: 'Pinca University Faculty System', // TODO: this text is drafted from the screenshots - check it matches the project
    summary: 'A Windows desktop app for university faculty, built with C# and a MySQL database.',
    description:
      'A Windows Forms desktop application for the faculty of Pinca University, written in C# with MySQL as its database. Faculty sign in with a username and password that are checked against the database, and the solution also includes forms for a dashboard, adding students and attendance lists.',
    features: [
      'Faculty login that checks credentials against a MySQL database',
      'Show-password option and a forgot-password link on the login form',
      'Forms for a dashboard, adding students and attendance lists',
    ],
    tech: ['C#', 'MySQL'],
    icon: 'monitor',
    images: [
      {
        src: '/projects/pinca-faculty-login.jpg',
        caption: 'Faculty login',
        alt: 'Faculty login window of the Pinca University desktop app: the university logo on a green panel with username and password fields and a Log In button, beside a photo of students',
      },
    ],
    github: '',
    live: '',
    year: '', // TODO
  },
  {
    id: 'pinca-lms',
    title: 'Pinca University LMS', // TODO: this text is drafted from the screenshots - check it matches the project
    summary:
      'A learning management system for Pinca University of the Philippines, with student login, registration and a dashboard.',
    description:
      'A web-based learning management system for Pinca University of the Philippines. Students log in or register, then land on a dashboard with a sidebar for Classes, Schedule, Courses and Registered. It is built with HTML, CSS and JavaScript, with MySQL holding the data behind it.',
    features: [
      'Student login and registration pages',
      'Dashboard with a welcome banner and sidebar navigation',
      'Classes, Schedule, Courses and Registered sections',
    ],
    tech: ['HTML', 'CSS', 'JavaScript', 'MySQL'],
    icon: 'graduation',
    images: [
      {
        src: '/projects/pinca-lms-dashboard.jpg',
        caption: 'Dashboard',
        alt: 'LMS dashboard with a yellow header, a left sidebar listing Dashboard, Classes, Schedule, Courses and Registered, and a "Your Dream Starts Here" banner with a group of smiling students',
      },
      {
        src: '/projects/pinca-lms-login.jpg',
        caption: 'Student login',
        alt: 'Student login page: a yellow header with the university name and a Register button, and a login card with username and password fields over a red-tinted photo of a campus building',
      },
    ],
    github: '',
    live: '',
    year: '', // TODO
  },
  {
    id: 'ccldo-portal',
    title: 'CCLDO Portal', // TODO: this text is drafted from the screenshots - check it matches the project
    badge: 'Capstone project',
    summary:
      'Admin and member portals for the City Cooperative and Livelihood Development Office of Cabuyao, built full stack with the help of AI tools.',
    description:
      'A web system for the City Cooperative and Livelihood Development Office (CCLDO) of Cabuyao, Laguna, with two sides. Office staff use the admin portal to work with cooperatives, the MSME directory, programs and registrations, training modules, site content and user accounts. Members sign in to the member portal for announcements, a calendar, programs, training modules and their certificates. It was our capstone project, and I built it full stack with HTML, CSS, JavaScript and Laravel, with the help of AI tools.',
    features: [
      'Separate admin and member portals, each with its own sign-in page',
      'Admin tools for cooperatives, the MSME directory, programs and registrations',
      'Training modules with tracking and activity submissions',
      'Content management with an archive, user management and audit logs',
      'Member area with announcements, a calendar, programs and certificates',
    ],
    tech: ['HTML', 'CSS', 'JavaScript', 'Laravel'],
    icon: 'globe',
    images: [
      {
        src: '/projects/ccldo-admin-dashboard.jpg',
        caption: 'Admin dashboard',
        alt: 'CCLDO admin dashboard: a blue sidebar menu, a banner for the City Cooperative and Livelihood Development Office, a feed of recent posts, and calendar and weather cards',
      },
      {
        src: '/projects/ccldo-admin-login.jpg',
        caption: 'Admin login',
        alt: 'CCLDO admin sign-in screen: a frosted card with username and password fields and a red Login button, over a photo of a government building with the Philippine flag',
      },
      {
        src: '/projects/ccldo-member-dashboard.jpg',
        caption: 'Member dashboard',
        alt: 'CCLDO member dashboard: a welcome banner, a sidebar for Home, Calendar, Training Modules, Programs and My Certificate, and an announcements feed',
      },
      {
        src: '/projects/ccldo-member-login.jpg',
        caption: 'Member login',
        alt: 'CCLDO member login screen titled Welcome back, with username and password fields, a red Log In button and a Create an account link',
      },
    ],
    github: '',
    live: '',
    year: '', // TODO
  },
]

/* ---------- Education (newest first) ---------- */
export const education = [
  {
    id: 'university',
    institution: 'Pamantasan ng Cabuyao', // TODO
    program: 'Bachelor of Science in Information Technology', // TODO
    period: '2023 - Present', // TODO
    icon: 'graduation',
    highlights: [
      'Coursework: Data Structures, Database Systems, Computer Networks, Web Development, Systems Analysis',
      'Hands-on projects across web development, database design, and networking labs',
    ],
  },
  {
    id: 'secondary',
    institution: 'Trimex Colleges', // TODO
    program: 'Information and Communication Technology', // TODO
    period: '2021 - 2023', // TODO
    icon: 'book',
    highlights: ['Early exposure to programming, computer fundamentals, and digital tools'],
  },

   {
    id: 'secondary',
    institution: 'Pulo National High School', // TODO
    period: '2020 - 2021', // TODO
    icon: 'book',
  },
]

/* ---------- Contact ---------- */
export const contact = {
  heading: "Let's build something together",
  text: 'I am currently looking for internship opportunities and happy to chat about projects, collaborations, or questions. The fastest way to reach me is by email.',
  email: EMAIL,
  location: '', // e.g. 'Manila, Philippines' - hidden while empty

  // The form can only deliver messages through a real service. Paste the endpoint of
  // a form service such as Formspree (https://formspree.io) to enable direct sending,
  // e.g. 'https://formspree.io/f/xxxxxxx'.
  // While empty, the form opens the visitor's own email app with the message pre-filled
  // (and says so honestly) instead of pretending to send it.
  formEndpoint: '',
}

/* ---------- Footer ---------- */
export const footer = {
  tagline: 'Building thoughtful, reliable software one project at a time.',
}
