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
| Typing terminal card (top of About) | `terminal` |
| Skills (no percentages by design; text chips or logo tiles) | `skillCategories` |
| Projects | `projects` |
| Schooling | `education` |
| Contact text, location, form endpoint | `contact` |

Also update the `<title>` and `<meta>` tags in [`index.html`](index.html) (they are static HTML, so they do not read from the data file).

Optional fields hide their UI while empty, so you never get a dead button:

- **Profile photo**: drop `profile.jpg` in `/public`, set `profile.image: '/profile.jpg'`.
- **CV / resume**: drop `resume.pdf` in `/public`, set `profile.resume: '/resume.pdf'`. The View CV buttons (navbar and mobile menu) appear automatically and open the PDF in a preview window on the page.
- **Project links**: `github` and `live` per project. Empty means the button is hidden.
- **Project screenshots**: put images in `/public/projects/` and list them in the project's `images` array, e.g. `{ src: '/projects/name.jpg', caption: 'Login', alt: 'What the screenshot shows' }`. The first image is the card cover; with two or more, the details window gets a screenshot switcher. With none (`images: []`), a generated preview is shown. Screenshots are shown whole, never cropped, so any shape works (desktop window, wide page, phone).
- **Tech tags**: `tech` per project. The tag row is hidden while the list is empty.
- **Project badge**: `badge: 'Capstone project'` shows a small label beside the project title (and above it in the details window). Empty or missing hides it.
- **Animated card border**: add the class `glow-border` to any card (it needs a `border-radius`). On hover an orange arc runs around its edge.
- **Page background**: a black field with a sparse grid of dim orange dots (`BackgroundDecor`, styled by `.bg-decor` in `ui.css`). The dots use the same pitch as the opening poster's dots (`--cell` in `index.css`); their colour is `--dot`. Only the page behind everything is black (`--page`); cards, the navbar and the alternate sections keep their own solid backgrounds, so the dots show only on the open page. The About, Projects and Contact panels get warm corner light and a fine grain, and with a mouse the dots light up around the cursor, on the page and on those panels (`src/components/ui/background.css`, `src/hooks/useLivingBackground.js`). `look.background` in `portfolioData.js` switches it: `'living'` (the default), `'calm'` (light and grain, nothing follows the mouse) or `'plain'` (the old flat panels).
- **HELLO! tab**: the small vertical word on the right edge (`src/components/HelloTab.jsx`). It slides in once you scroll down past the opening clock, and it is hidden on screens narrower than 1280px, where it would sit on top of the text. Change or hide it with `contact.helloTab`; it links to the Contact section.
- **Side tab**: the "MA. / Portfolio" tab on the left edge (`src/components/SideTab.jsx`) stays on screen through every section. The initials come from `profile.name`. On windows narrower than 1320px it would sit on top of the content, so there it stays with the opening poster only; phones never show it.
- **Interactive opening clock** (`src/lib/clockPlay.js`, used by `Intro.jsx`): with a mouse, the big numbers, the dot grid and the dial drift on three parallax planes, the dot under the pointer swells, and you can grab a hand and turn it (the numbers roll with it) before the clock springs back to the real time. Touch screens ignore it, so swiping on the poster still scrolls the page. The parallax depth, the spring and how close you must be to a hand are constants at the top of the file.
- **Stack playground**: a box under the skills where your logos fall in and can be dragged, thrown and poked (`src/components/ui/StackPlayground.jsx`; the physics is `src/lib/toybox.js`, using Matter.js, which is only downloaded when the box scrolls into view). It uses every skill that has a logo, so it follows `skillCategories`. Tune the feel (gravity, bounce, spring) at the top of `toybox.js` and the size in `StackPlayground.css`; delete the `<StackPlayground />` line in `Skills.jsx` to remove it.
- **Cursor glow**: `src/components/ui/CursorGlow.jsx`, mounted in `App.jsx`. Delete that line to remove it, or tune `--cursor-glow` (colour and strength) and `--cursor-glow-size` in `index.css`. Touch screens never show it.

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
