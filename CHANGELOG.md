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

### Changed
- Migrated all component colors from hardcoded values to semantic CSS variables
- Selection styles now use theme-specific selection colors
