# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- Terminal theme engine with 5 Ghostty-sourced themes (Duotone Dark, Flexoki Light, Homebrew, Dracula, Nord)
- CSS custom property schema with raw palette (`--palette-0` through `--palette-15`) and semantic aliases
- Theme persistence via localStorage with `prefers-color-scheme` fallback
- FOUC prevention via inline head script
- `window.__theme` API (`set`, `get`, `list`) for command bar integration
- Theme-aware grain overlay (adjusts opacity/inversion for light vs dark)
- Smooth theme transitions (80ms) with `prefers-reduced-motion` support
- Hybrid command bar overlay with `/` and `Ctrl+K`/`Cmd+K` keyboard shortcuts
- Core terminal commands: `theme`, `goto`, `filter`, `help`, `whoami`, `clear`, `history`
- 83 easter egg commands with 6+ rotating humorous response variants each
- `window.__terminal` API (`open`, `close`, `toggle`, `run`, `isOpen`) for programmatic access
- Custom events: `terminal:open`, `terminal:close`, `terminal:command`
- Mobile floating terminal trigger button (visible below 768px)
- First-visit hint toast ("Press / to open terminal")
- Tab completion for command names
- Command history via up/down arrows (sessionStorage, last 50 commands)
- Content filter with highlight/dim on skills and project cards
- Section ID attributes for `goto` navigation (`about`, `social`, `skills`, `projects`)
- Scrollable output history with 100-line buffer and auto-scroll
- Rich output formatting (ASCII art, pre-formatted text)
- Focus trap and ARIA attributes when command bar is open

### Changed
- Migrated all component colors from hardcoded values to semantic CSS variables
- Selection styles now use theme-specific selection colors
