# Release Flow

Use the release helper from the project root:

```powershell
npm run release
```

What it does:

- bumps the patch version in `package.json` and `package-lock.json`
- rebuilds the app with `npm run dist`
- stages all tracked changes
- commits with `chore: bump version to <version>`
- pushes `main` to `origin`

To publish a specific version instead of auto-patching:

```powershell
pwsh .\scripts\release.ps1 -Version 2.4.7
```

Important:

- `src/App.tsx` reads the version from `package.json`, so there is no second manual version edit anymore.
- The repository remote is configured for SSH, so push should work without the old HTTPS/schannel path.
