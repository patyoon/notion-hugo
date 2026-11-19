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

# context-mode — MANDATORY routing rules

You have context-mode MCP tools available. These rules are NOT optional — they protect your context window from flooding. A single unrouted command can dump 56 KB into context and waste the entire session.

## BLOCKED commands — do NOT attempt these

### curl / wget — BLOCKED
Any Bash command containing `curl` or `wget` is intercepted and replaced with an error message. Do NOT retry.
Instead use:
- `ctx_fetch_and_index(url, source)` to fetch and index web pages
- `ctx_execute(language: "javascript", code: "const r = await fetch(...)")` to run HTTP calls in sandbox

### Inline HTTP — BLOCKED
Any Bash command containing `fetch('http`, `requests.get(`, `requests.post(`, `http.get(`, or `http.request(` is intercepted and replaced with an error message. Do NOT retry with Bash.
Instead use:
- `ctx_execute(language, code)` to run HTTP calls in sandbox — only stdout enters context

### WebFetch — BLOCKED
WebFetch calls are denied entirely. The URL is extracted and you are told to use `ctx_fetch_and_index` instead.
Instead use:
- `ctx_fetch_and_index(url, source)` then `ctx_search(queries)` to query the indexed content

## REDIRECTED tools — use sandbox equivalents

### Bash (>20 lines output)
Bash is ONLY for: `git`, `mkdir`, `rm`, `mv`, `cd`, `ls`, `npm install`, `pip install`, and other short-output commands.
For everything else, use:
- `ctx_batch_execute(commands, queries)` — run multiple commands + search in ONE call
- `ctx_execute(language: "shell", code: "...")` — run in sandbox, only stdout enters context

### Read (for analysis)
If you are reading a file to **Edit** it → Read is correct (Edit needs content in context).
If you are reading to **analyze, explore, or summarize** → use `ctx_execute_file(path, language, code)` instead. Only your printed summary enters context. The raw file content stays in the sandbox.

### Grep (large results)
Grep results can flood context. Use `ctx_execute(language: "shell", code: "grep ...")` to run searches in sandbox. Only your printed summary enters context.

## Tool selection hierarchy

1. **GATHER**: `ctx_batch_execute(commands, queries)` — Primary tool. Runs all commands, auto-indexes output, returns search results. ONE call replaces 30+ individual calls.
2. **FOLLOW-UP**: `ctx_search(queries: ["q1", "q2", ...])` — Query indexed content. Pass ALL questions as array in ONE call.
3. **PROCESSING**: `ctx_execute(language, code)` | `ctx_execute_file(path, language, code)` — Sandbox execution. Only stdout enters context.
4. **WEB**: `ctx_fetch_and_index(url, source)` then `ctx_search(queries)` — Fetch, chunk, index, query. Raw HTML never enters context.
5. **INDEX**: `ctx_index(content, source)` — Store content in FTS5 knowledge base for later search.

## Subagent routing

When spawning subagents (Agent/Task tool), the routing block is automatically injected into their prompt. Bash-type subagents are upgraded to general-purpose so they have access to MCP tools. You do NOT need to manually instruct subagents about context-mode.

## Output constraints

- Keep responses under 500 words.
- Write artifacts (code, configs, PRDs) to FILES — never return them as inline text. Return only: file path + 1-line description.
- When indexing content, use descriptive source labels so others can `ctx_search(source: "label")` later.

## ctx commands

| Command | Action |
|---------|--------|
| `ctx stats` | Call the `ctx_stats` MCP tool and display the full output verbatim |
| `ctx doctor` | Call the `ctx_doctor` MCP tool, run the returned shell command, display as checklist |
| `ctx upgrade` | Call the `ctx_upgrade` MCP tool, run the returned shell command, display as checklist |
