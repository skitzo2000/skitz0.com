# Requirements: Hybrid Command Bar

**Status: APPROVED**
**Priority: P0**
**GitHub Issue: #2**
**Date: 2026-03-05**
**Depends On: Terminal Theme Engine (#1) — COMPLETED**

---

## 1. Problem Statement

The site is a passive read-only portfolio with no interactivity reflecting the developer's terminal-first identity. It needs a command bar that transforms the experience into a living terminal — where visitors can switch themes, navigate sections, and discover 60+ easter egg commands with rotating geeky humor.

## 2. Functional Requirements

### 2.1 Command Bar UI

- **FR-1**: Command bar is hidden by default, overlaid at the bottom of the viewport
- **FR-2**: Opens with `/` key or `Ctrl+K` (macOS: `Cmd+K`), closes with `Escape`
- **FR-3**: Input field with blinking cursor, monospace font (JetBrains Mono)
- **FR-4**: Prompt prefix: `visitor@skitz0.com:~$` (styled with `--fg-muted` for path, `--accent` for `$`)
- **FR-5**: Scrollable output history — commands and responses stack up, newest at bottom, auto-scroll
- **FR-6**: Maximum output buffer: 100 lines; older lines trimmed automatically
- **FR-7**: `clear` command resets the output buffer
- **FR-8**: Command history via up/down arrow keys (last 50 commands, persisted in sessionStorage)
- **FR-9**: Tab completion for command names (not arguments)
- **FR-10**: On mobile, a floating terminal icon (bottom-right) opens the command bar
- **FR-11**: First-visit hint: brief toast "Press / to open terminal" shown once (localStorage flag)
- **FR-12**: Focus trap when command bar is open (Tab cycles within the bar)
- **FR-13**: Rich output formatting: support for ASCII art, simple tables, and CSS-colored spans via output classes

### 2.2 Core Commands

| Command | Behavior |
|---------|----------|
| `theme <name>` | Calls `window.__theme.set(name)`. Lists available themes if no arg or invalid arg. |
| `theme` (no arg) | Lists available themes with current marked |
| `goto <section>` | Smooth-scrolls to section: `top`, `about`, `social`, `skills`, `projects` |
| `filter <keyword>` | Highlights matching skills and project cards; dims non-matches. `filter clear` resets. |
| `help` | Shows available commands grouped by category |
| `whoami` | Always returns the terminal bio (see Section 5) |
| `clear` | Clears the output buffer |
| `history` | Shows command history |

### 2.3 Easter Egg System

- **FR-14**: 60+ recognized commands (full list in Section 6)
- **FR-15**: Response bank stored in a JSON data file (`content/commands.json`)
- **FR-16**: Each easter egg command has 5-10 response variants
- **FR-17**: On page load, a random subset (1 per command) is selected as "active"
- **FR-18**: Every 3 minutes, the active subset rotates (new random selection)
- **FR-19**: Rotation is silent — no visual indicator, visitors just get fresh content on repeat commands
- **FR-20**: Unrecognized commands return: `command not found: <input>. Type 'help' for available commands.`

### 2.4 Humor Sources

Response content must span all of these:
- Star Wars, Back to the Future, MST3K, Monty Python, Spaceballs
- Hitchhiker's Guide, Portal/GLaDOS, Office Space, IT Crowd, Silicon Valley
- XKCD references, classic computing jokes (BSOD, segfaults, Y2K)
- General programming memes and one-liners

### 2.5 Filter Command

- **FR-21**: `filter <keyword>` searches skill items and project titles/descriptions/tags (case-insensitive)
- **FR-22**: Matching elements get a highlight class; non-matching get a dim class (reduced opacity)
- **FR-23**: `filter clear` or `filter reset` removes all filter styling
- **FR-24**: Filter state persists until cleared or a new filter is applied
- **FR-25**: Output shows count: "Found N matches across skills and projects"

### 2.6 Goto Command

- **FR-26**: `goto <section>` smooth-scrolls to the target section
- **FR-27**: Valid targets: `top`, `about`, `social`, `skills`, `projects`
- **FR-28**: Closes the command bar after scrolling
- **FR-29**: `goto` with no arg or invalid arg lists valid targets

## 3. Non-Functional Requirements

- **NFR-1**: Zero external JS dependencies — pure vanilla JS (the site currently has only Astro as a dependency)
- **NFR-2**: Command bar renders within 1 frame after toggle (< 16ms)
- **NFR-3**: Total JS bundle for command bar + easter egg data: < 50KB gzipped
- **NFR-4**: All command handling: < 50ms response time
- **NFR-5**: Theme-aware: all command bar colors use semantic CSS variables from the theme engine
- **NFR-6**: Accessible: ARIA roles (`role="dialog"`, `aria-label`), focus trap, screen reader announcements for output
- **NFR-7**: `prefers-reduced-motion`: disable command bar open/close animations
- **NFR-8**: Works without JS for base site (command bar simply doesn't appear — progressive enhancement)
- **NFR-9**: The word "blog" must NEVER appear anywhere — UI, source code, comments, easter egg responses

## 4. Architecture Constraints

- **AC-1**: Command bar is a single Astro component (`CommandBar.astro`) with a client-side `<script>` tag
- **AC-2**: Easter egg data lives in `content/commands.json` — imported at build time by Astro
- **AC-3**: Command registry pattern: each command is a handler function in a registry object
- **AC-4**: The command bar DOM is injected into `Layout.astro` (before `</body>`)
- **AC-5**: Integration with existing `window.__theme` API (no reimplementation)
- **AC-6**: Filter command adds/removes CSS classes on existing section elements — does not modify DOM structure
- **AC-7**: Mobile floating button is CSS-only visibility toggle (hidden on desktop via media query)

## 5. whoami Output

The `whoami` command always returns this (no rotation):

```
+---------------------------------------------------+
|  skitz0 -- Senior Linux Cloud Engineer            |
|  Core member & instructor @ HackersGuildPGH       |
|                                                   |
|  We like to take things apart                     |
|  and see how they work.                           |
|                                                   |
|  Hobbies include: breaking prod at 4am,           |
|  3D printing things nobody asked for,             |
|  and mass: "It works on my machine"               |
|                                                   |
|  PGP: Don't ask. I lost the key.                  |
+---------------------------------------------------+
```

(Tone: humorous hacker energy. Can be refined during implementation.)

## 6. Easter Egg Command List (60+)

### 6.1 Shell Basics
`ls`, `cat`, `man`, `pwd`, `cd`, `echo`, `touch`, `rm`, `cp`, `mv`, `mkdir`, `chmod`, `chown`, `find`, `grep`

### 6.2 System
`top`, `ps`, `kill`, `uptime`, `free`, `df`, `date`, `cal`, `hostname`, `uname`

### 6.3 Network
`ping`, `ssh`, `curl`, `wget`, `nslookup`, `traceroute`, `ifconfig`, `netstat`, `dig`

### 6.4 Git
`git blame`, `git push`, `git commit`, `git pull`, `git stash`, `git rebase`, `git merge`, `git log`

### 6.5 Editors
`nano`, `vim`, `emacs`, `code`

### 6.6 Package Managers
`apt install`, `brew install`, `npm install`, `pip install`, `cargo install`

### 6.7 DevOps
`docker run`, `kubectl`, `terraform apply`, `ansible-playbook`, `make`, `systemctl`

### 6.8 Languages
`python`, `node`, `go run`, `rustc`, `gcc`, `java`

### 6.9 Classics
`sudo rm -rf /`, `sudo`, `exit`, `logout`, `shutdown`, `reboot`, `fortune`, `cowsay`, `sl`, `alias`

### 6.10 Fun
`matrix`, `hack`, `42`, `hello world`, `xkcd`, `lol`, `pls`, `fml`, `yolo`, `bruh`

**Total: 75 unique commands** (60+ requirement exceeded)

## 7. Data Schema

### 7.1 commands.json Structure

```json
{
  "commands": {
    "ls": {
      "responses": [
        "drwxr-xr-x  secrets/  definitely-not-malware/  cat-pics/",
        "Permission denied. Just kidding: node_modules/ (1.2TB)",
        "total 42\n-rw-r--r-- 1 skitz0 hackers 1337 plans-for-world-domination.txt"
      ]
    },
    "sudo rm -rf /": {
      "responses": [
        "I'm sorry Dave, I'm afraid I can't do that.",
        "Nice try. This isn't a real terminal... or is it?",
        "Deleting the internet... 3... 2... 1... Just kidding.",
        "ERROR: Cannot delete. The files are IN the computer.",
        "rm: it is dangerous to operate recursively on '/'\nrm: use --no-preserve-root to override this failsafe\n\n...please don't."
      ]
    }
  },
  "meta": {
    "version": 1,
    "humor_sources": ["star-wars", "portal", "monty-python", "hitchhikers", "office-space", "it-crowd", "silicon-valley", "xkcd", "computing", "programming"]
  }
}
```

### 7.2 Command Matching

- Exact match first (e.g., `sudo rm -rf /`)
- Prefix match for multi-word commands (e.g., `git push origin main` matches `git push`)
- Single-word match as fallback (e.g., `docker run hello-world` matches `docker run`)
- Case-insensitive matching

## 8. Component API

### 8.1 CommandBar.astro Props

None — the component is self-contained, added to Layout.astro.

### 8.2 Public JS API

```
window.__terminal = {
  open()             -- Open the command bar
  close()            -- Close the command bar
  toggle()           -- Toggle open/close
  run(cmd: string)   -- Run a command programmatically
  isOpen()           -- Check if open
}
```

This API allows the future knowledge graph (#3) and project showcase (#4) to integrate.

### 8.3 Custom Events

- `terminal:open` — fired when command bar opens
- `terminal:close` — fired when command bar closes
- `terminal:command` — fired after command runs, detail: `{ command, output }`

## 9. Acceptance Criteria

1. Command bar toggles with `/`, `Ctrl+K`/`Cmd+K`, and `Escape`
2. Scrollable output history with auto-scroll
3. Command history with up/down arrows (sessionStorage)
4. Tab completion for command names
5. `theme`, `goto`, `filter`, `help`, `whoami`, `clear`, `history` commands work
6. 60+ easter egg commands with multiple response variants per command
7. Response rotation on page load and every 3 minutes
8. Mobile floating terminal icon trigger
9. First-visit hint toast
10. Focus trap and ARIA attributes when open
11. All colors use theme CSS variables
12. No hardcoded colors in the component
13. Zero external JS dependencies
14. Bundle size < 50KB gzipped (including commands.json data)
15. The word "blog" appears nowhere in any file
16. `prefers-reduced-motion` respected
17. `npx astro build` succeeds

## 10. Scope Boundaries

### In Scope
- Command bar component + styling
- Core commands (theme, goto, filter, help, whoami, clear, history)
- Easter egg command bank (60+ commands, 5-10 responses each)
- commands.json data file
- Keyboard shortcuts and mobile trigger
- First-visit hint
- `window.__terminal` API
- Custom events

### Out of Scope
- Knowledge graph integration (issue #3 — will consume `filter` command)
- Project showcase integration (issue #4 — will consume `goto projects`)
- Sound effects
- Command aliasing/customization
- Persistent command history across sessions (sessionStorage only)
- Server-side processing
