# Portfolio Website

A responsive, animated personal portfolio built with **React 19 + Vite**, **Framer Motion** and **Lucide icons**.
Plain CSS with design tokens (no Tailwind), dark theme by default with a light-theme toggle.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build into /dist
npm run preview    # serve the production build locally
```

## Make it yours

**Everything personal lives in one file: [`src/data/portfolioData.js`](src/data/portfolioData.js).**
It is all sample content right now. Search the file for `TODO`, then update:

| What | Where in `portfolioData.js` |
| --- | --- |
| Name, title, intro, availability pill | `profile` |
| Email address | `EMAIL` constant at the top |
| GitHub / LinkedIn links | `socials` |
| Bio, interests, career goals | `about` |
| Skills (no percentages by design; text chips or logo tiles) | `skillCategories` |
| Projects | `projects` |
| Schooling | `education` |
| Contact text, location, form endpoint | `contact` |

Also update the `<title>` and `<meta>` tags in [`index.html`](index.html) (they are static HTML, so they do not read from the data file).

Optional fields hide their UI while empty, so you never get a dead button:

- **Profile photo**: drop `profile.jpg` in `/public`, set `profile.image: '/profile.jpg'`.
- **CV / resume**: drop `resume.pdf` in `/public`, set `profile.resume: '/resume.pdf'`. The Download CV buttons (navbar, hero) appear automatically.
- **Project links**: `github` and `live` per project. Empty means the button is hidden.
- **Project screenshots**: put images in `/public/projects/` and list them in the project's `images` array, e.g. `{ src: '/projects/name.jpg', caption: 'Login', alt: 'What the screenshot shows' }`. The first image is the card cover; with two or more, the details window gets a screenshot switcher. With none (`images: []`), a generated preview is shown. Screenshots are shown whole, never cropped, so any shape works (desktop window, wide page, phone).
- **Tech tags**: `tech` per project. The tag row is hidden while the list is empty.
- **Project badge**: `badge: 'Capstone project'` shows a small label beside the project title (and above it in the details window). Empty or missing hides it.

### Skill logos

A skill is either a plain string (a text chip) or `{ name, icon }`, which shows a logo tile with the name on hover:

```js
skills: [{ name: 'Git', icon: 'git' }, { name: 'GitHub', icon: 'github' }, 'Networking Basics']
```

Available logos: `git`, `github`, `vscode`, `figma`, `javascript`, `kotlin`, `java`, `php`, `html5`, `css3`, `react`, `tailwind`, `laravel`, `mysql`, `sqlite`. To add another, copy its SVG path from [simpleicons.org](https://simpleicons.org) into [`src/components/ui/techIcons.js`](src/components/ui/techIcons.js) (the file explains the fields and licence checks). If an `icon` name is not registered, the skill simply falls back to a text chip. Skills with no logo (e.g. Networking Basics) are best left as plain strings.

### Add a project

Copy one object in the `projects` array and edit it. The grid, hover effects, scroll reveal and the details modal all pick it up with no component changes.

### Contact form

The form validates input, but a static site cannot send email by itself, so it does not pretend to:

- **Default (`contact.formEndpoint: ''`)**: submitting opens the visitor's email app with the message pre-filled, and the page says plainly that nothing has been sent yet.
- **Real sending**: create a free form at [Formspree](https://formspree.io) (or any service that accepts a JSON `POST`) and paste its URL into `contact.formEndpoint`. The form then POSTs directly and shows loading, success and error states.

## Project structure

```
src/
├── components/
│   ├── Navbar.jsx · Hero.jsx · About.jsx · Skills.jsx
│   ├── Projects.jsx · Education.jsx · Contact.jsx · Footer.jsx   (+ one .css file each)
│   └── ui/            shared pieces: Button, SectionHeading, ProjectModal, Loader, ...
├── data/portfolioData.js
├── hooks/             useActiveSection · useScrolled · useTheme
├── lib/motion.js      shared animation presets
├── index.css          design tokens (colours, type, spacing) + base styles
└── App.jsx · main.jsx
```

Colours, fonts and spacing are CSS variables at the top of [`src/index.css`](src/index.css); the light theme is a second set of the same variables.

## Accessibility & performance notes

- Honours `prefers-reduced-motion` (movement is removed, content still fades in).
- Skip link, semantic landmarks, visible focus rings, `aria-current` on the active nav link, focus-trapped modal, live-region form feedback.
- Animations use transforms and opacity only; scroll reveals fire once.

## Credits

- Icons: [Lucide](https://lucide.dev) (ISC).
- Skill logos: path data from [Simple Icons](https://simpleicons.org) and [Devicon](https://devicon.dev) (MIT), shown as single-colour silhouettes. All logos are trademarks of their respective owners.
- Logo licences: Git ([Jason Long](https://git-scm.com/community/logos), CC BY 3.0), HTML5 ([W3C](https://www.w3.org/html/logo/), CC BY 3.0) and PHP ([Colin Viebrock](https://www.php.net/download-logos.php), CC BY-SA 4.0) are released under licences that ask for visible credit. The site shows no credit line, so add one (for example in the footer) if you want to follow them to the letter. The JavaScript logo is MIT (c) 2011 Christopher Williams, noted in `techIcons.js`. The Laravel logo comes from Laravel's art repository, which has no licence file, so it is used only to name the framework.

## Deploy

`npm run build` produces a static `/dist` folder that works on Netlify, Vercel, GitHub Pages, Cloudflare Pages, etc.
