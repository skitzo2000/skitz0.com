# Discovery Transcript

## Round 1: Vision & Scope
- **CLI approach**: Hybrid — command bar with shell-like features for power users (history, tab complete)
- **Knowledge graph**: Full career map — skills, jobs, projects, certs, tools with relationships
- **Content expansion**: All of the above — career timeline + blog + certs/stats

## Round 2: Implementation Details
- **Command bar position**: Toggle with hotkey (`/` or `Ctrl+K`), hidden by default
- **Graph depth**: Start high-level, drill down — overview first, click to expand sub-graphs
- **Blog source**: GitHub — use repo READMEs as content source (auto-curated portfolio)

## Round 3: Technical Preferences
- **GitHub content**: Repo READMEs pulled as project writeups via GitHub API at build time
- **Themes**: 5 themes — Duotone Dark (default), Duotone Light, Homebrew, Dracula, Nord
- **Theme engine**: Must type commands to switch themes
- **Commands**: theme, goto, filter, help + easter egg Linux commands
- **Easter eggs**: Fake Linux CLI commands with comedic responses (Monty Python, Spaceballs humor)
  - e.g., `sudo rm -rf /` → "Nice try. The castle of Aaaargh has been deleted."
  - `ls` → lists absurd items
  - `cat` → ASCII art cat
  - `man` → quotes from Spaceballs
