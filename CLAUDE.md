# Architecture overview

- I made this website with [Hugo](https://gohugo.io/) based on [hugo-tranquilpeak-theme](https://github.com/kakawait/hugo-tranquilpeak-theme) with the sidebar from [hugo-creative-portfolio-theme](https://themes.gohugo.io/hugo-creative-portfolio-theme/)
- The site is deployed on [netlify](https://www.netlify.com/) with [Cloudinary](https://cloudinary.com/) as the image CDN. The static files including images live in git lfs. And it is connected with my notion with [notion-hugo](https://github.com/HEIGE-PCloud/Notion-Hugo) to use it as content management system (CMS).

# Code Style Guidelines
Syntax: Use ES Modules (`import`/`export`) rather than CommonJS. Use modern ES6+ features (arrow functions, etc.) where appropriate.
Formatting: 2 spaces for indentation. Use single quotes for strings. No trailing semicolons (we run Prettier) – except where necessary in TypeScript (enums, interfaces).
Naming: Use `camelCase` for variables/functions, `PascalCase` for React components and classes. Constants in `UPPER_SNAKE_CASE`.
Patterns: Prefer functional components with hooks over class components in React. Avoid using any deprecated APIs.
Function Size: Aim for functions ≤ 50 lines. If a function is doing too much, break it into smaller helper functions.
Single Responsibility: Each function/module should have one clear purpose. Don't lump unrelated logic together.
Naming: Use descriptive names. Avoid generic names like `tmp`, `data`, `handleStuff`. For example, prefer `calculateInvoiceTotal` over `doCalc`.
DRY Principle: Do not duplicate code. If similar logic exists in two places, refactor into a shared function (or clarify why both need their own implementation).
Comments: Explain non-obvious logic, but don't over-comment self-explanatory code. Remove any leftover debug or commented-out code.

# How to work with repo

### Prerequisites

Install the theme's [dependencies](https://github.com/kakawait/hugo-tranquilpeak-theme/blob/master/docs/developer.md#installation). Install grunt

```
cd themes/hugo-tranquilpeak-theme
npm install grunt-cli -g
npm install
```

### Editing css files

Edit scss file under src/css in tranquilpeak, recompile theme files, and restart the server.

### Recompiling theme files

Changing theme files requires re-compiling assets and files

``` bash
npm run prod
```

### After performing a change, always run the build command

```
hugo --gc --minify
```

to verify the change.

### Running server locally

``` bash
hugo server
```

#### Dev Troubleshooting

- Error: Node Sass does not yet support your current environment: OS X 64-bit with Unsupported runtime (83)

Need to run

```
npm audit fix
```

# Recent Setup Commands (2026-02-07)

## Git LFS Configuration

Set up Git LFS to track large binary files (images, videos, PDFs):

```bash
# Initialize Git LFS
git lfs install

# LFS tracking is configured in .gitattributes for:
# - Images: *.jpg, *.JPG, *.jpeg, *.JPEG, *.png, *.PNG, *.gif, *.webp, *.bmp, *.tiff, *.ico
# - Videos: *.mp4, *.mov, *.avi, *.webm
# - Audio: *.mp3, *.wav, *.ogg
```

**Note:** All existing images have been migrated to LFS. New images will automatically use LFS.

### Adding new images

New images placed in `static/uploads/` are automatically tracked by LFS via `.gitattributes`. Just add and commit normally:

```bash
git add static/uploads/my-image.jpg
git commit -m "Add new image"
```

To verify files are tracked by LFS:

```bash
git lfs ls-files
```

## Forms Migration to Netlify Forms

Migrated from getform/forminit/formcake to Netlify Forms (free, 100 submissions/month):

### Subscribe Form
- Updated: `static/js/subscribe.js`
- HTML form needs: `data-netlify="true"`, `data-netlify-honeypot="bot-field"`, hidden `form-name` input

### Contact Form
- Updated: `static/js/contact.js`
- Updated: `themes/tranquilpeak/layouts/shortcodes/contact.html`
- Removed reCAPTCHA dependency

Both forms now use:
```javascript
fetch("/", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams(formData).toString(),
})
```

View form submissions in Netlify Dashboard → Forms.

## Submodule Configuration

Changed submodule URL from SSH to HTTPS for Netlify compatibility:

```bash
# Update .gitmodules
# From: git@github.com:patyoon/hugo-theme.git
# To: https://github.com/patyoon/hugo-theme.git

# Sync submodule URL
git submodule sync
git submodule update --init --recursive
```

If submodule is missing or empty:
```bash
rm -rf themes/tranquilpeak
git submodule add https://github.com/patyoon/hugo-theme.git themes/tranquilpeak
```

## Git Conflict Resolution

When resolving merge conflicts to keep current (HEAD) version:

```bash
# Accept current version for all conflicts
git checkout --ours .

# For specific files
git checkout --ours <file>

# Stage and continue
git add .
git rebase --continue  # or git merge --continue
```

## Committing Theme Changes

Since the theme is a submodule:

```bash
# 1. Commit inside the submodule
cd themes/tranquilpeak
git add <changed-files>
git commit -m "Description of changes"
git push origin master

# 2. Update main repository to reference new commit
cd ../../
git add themes/tranquilpeak
git commit -m "Update tranquilpeak submodule: description"
git push
```
