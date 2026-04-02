# Contributing to Stremio Enhanced

Thank you for your interest in contributing to **Stremio Enhanced**! We welcome contributions from everyone. Please take a moment to review these guidelines to help us maintain a healthy and productive community.

## Development Prerequisites

Before building from source, make sure you have:

- **Node.js 23.x** and npm
- **Git**
- **MPV** — required for the embedded player (see below)

### MPV Binary Setup

MPV is required for the embedded playback mode. The binary is **not** committed to the repository due to its size (~100 MB+). You must set it up before running or building the project.

**Quick setup (Windows):**

```powershell
.\scripts\setup-mpv.ps1
```

This downloads the latest MPV build from [shinchiro/mpv-winbuild-cmake](https://github.com/shinchiro/mpv-winbuild-cmake) and places it in `static/mpv/win32-x64/`. Pass `-Arch arm64` for ARM builds.

**Other platforms:**

| Platform | Steps |
|----------|-------|
| **macOS** | `brew install mpv` — the system path `/opt/homebrew/bin/mpv` or `/usr/local/bin/mpv` is detected automatically. |
| **Linux** | Install via your package manager (`apt install mpv`, `pacman -S mpv`, etc.) — `/usr/bin/mpv` is detected automatically. |

**How the binary is resolved at runtime** (see `src/utils/PlayerBinaryResolver.ts`):

1. Custom path set by the user in settings
2. Bundled binary in `static/mpv/<platform>-<arch>/` (for packaged builds)
3. Known system install paths (e.g. `C:\Program Files\mpv\mpv.exe`, `/usr/bin/mpv`)

The `static/mpv/` directory layout is documented in `static/mpv/README.md`. Only the binaries for your current platform are needed during development.

> **Note:** Embedded MPV requires a transparent window. The app enables this automatically when the playback mode is set to "Embedded MPV" in settings, but a restart is needed after changing the setting.

## How Can I Contribute?

### 1. Reporting Bugs

- Search for existing issues before opening a new one.
- If you find a relevant issue, add your comments or additional information.
- When reporting a bug, please include:
  - Environment (OS, Stremio Enhanced version)
  - Steps to reproduce the issue
  - Expected vs. actual behavior
  - Screenshots or logs, if possible

### 2. Suggesting Enhancements

- Check the [issues](https://github.com/REVENGE977/stremio-enhanced/issues) to avoid duplicates.
- Clearly describe your suggestion.
- Explain why it would be useful.

### 3. Pull Requests

- Fork the repository and create your branch from `main`.
- Write clear, concise commit messages.
- Ensure your code follows our style guidelines (see below).
- Test your changes before submitting.
- Reference related issues in your pull request description (e.g., “Fixes #123”).

## Code Style

- Use clear and descriptive variable names.
- Format your code consistently (Tab indentation with size of 4 is preferred).
- Add comments where necessary.

## Process

1. Open an issue to discuss your proposal.
2. Fork and clone the repo.
3. Create your feature branch (`git checkout -b feature/AmazingFeature`).
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature/AmazingFeature`).
6. Open a pull request.

## Code of Conduct

All contributors are expected to follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Questions?

If you have any questions, reach out on the GitHub Discussions tab or Discord (link in README.md).

Thank you for contributing!