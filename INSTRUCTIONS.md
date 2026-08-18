# Jayaprakash K — Website: Editing Guide

Three files run the whole site: `index.html` (content), `style.css` (design), `script.js`
(behaviour). You only need to touch `index.html` for day-to-day updates — everything is
commented with `<!-- EDIT: ... -->` markers so you can find each spot with Ctrl+F / Cmd+F.

## 1. Profile Photo
- Add your photo to `assets/profile-photo.jpg`
- In `index.html`, search for `hero__photo` — the `<img>` tag already points to that path.
- If no photo is present, a clean "JK" monogram shows automatically instead of a broken image.

## 2. Resume
- Add your resume PDF to `assets/resume/Jayaprakash-K-Resume.pdf`
- Search `id="resume"` in `index.html` — both the "View Resume" and "Download Resume"
  buttons, and the entry in the Downloads list, point to this same file.

## 3. Certificates
- Add certificate images to `assets/certificates/` (e.g. `certificate-1.jpg`, `certificate-2.jpg`).
- Search `cert-grid` in `index.html`. Each certificate is one `<div class="cert-card">` block —
  copy/paste the block to add more, and update the `src`, title and issuer text.
- A dashed "Future certificate slot" card is included at the end — duplicate it for each new one.

## 4. Projects
- Search `project-grid` in `index.html`. Each project is one `<article class="project-card">`.
  Edit the tag (MBA Project / BBA Project), title, description and skill chips.
- Duplicate the "Future" card whenever you complete a new project.

## 5. Contact Details
- Search `id="contact"`. Update:
  - `mailto:youremail@example.com` → your real email
  - `tel:+910000000000` → your real phone number
- The contact form currently only shows a confirmation message. To actually receive
  messages, open `script.js`, find section **9. CONTACT FORM**, and connect it to a
  service such as Formspree, EmailJS, or your own backend endpoint.

## 6. LinkedIn
- Your LinkedIn URL (`https://www.linkedin.com/in/hellojayaprakashk`) is already wired into:
  the hero section, the Contact section, the Social row, and the Footer.
  Search `hellojayaprakashk` in `index.html` if you ever need to change it — it's the same
  link everywhere so you only need to replace all occurrences once.

## 7. Future Experience (jobs, volunteering, achievements, education)
- **Journey / Education timeline**: search `class="timeline"` — copy a `<li class="timeline__item reveal">`
  block to add a new milestone (new job, promotion, further study).
- **Volunteer Experience**: search `volunteer-grid` — copy a `.volunteer-card` block.
- **Achievements**: search `achievement-strip` — copy an `.achievement-item` block.
- **Gallery**: search `gallery-grid` — copy a `.gallery-item` block and point it at a new photo
  in `assets/gallery/`.
- **Blog**: search `id="blog"` — replace the placeholder paragraph once you're ready to publish
  articles, or extend it into a list of post cards using the same card patterns used elsewhere.

## 8. Colours, Fonts & Layout (optional, in `style.css`)
- All colours are defined once at the top of `style.css` under `:root` (search `--navy-900`,
  `--gold`, etc.) — change a value there and it updates the whole site.
- Fonts are loaded from Google Fonts in `index.html`'s `<head>` and referenced as
  `--font-display`, `--font-body`, `--font-mono` in `style.css`.

## 9. Dark Mode, Search, Back-to-Top, Visitor Counter
- These already work out of the box (no editing needed). The visitor counter is a local,
  per-browser demo counter — see **section 11** in `script.js` if you want a real shared
  counter (requires a small backend or a free counter API).

## 10. Deploying
This is a static site (plain HTML/CSS/JS) — you can host it for free on GitHub Pages,
Netlify, Vercel, or Cloudflare Pages. Just upload the whole folder (`index.html`, `style.css`,
`script.js`, and the `assets` folder).

---
Keep this file for reference — none of it is shown on the live site.
