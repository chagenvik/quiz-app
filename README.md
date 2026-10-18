# Quiz App / Quiz-app

EN: A Vite + React + TypeScript quiz app for GitHub Pages, with reusable quiz modules and an Atlas starter module.

NO: En Vite + React + TypeScript-basert quiz-app for GitHub Pages, med gjenbrukbare quizmoduler og en Atlas-startmodul.

## Commands / Kommandoer

- `npm run dev` – local development / lokal utvikling
- `npm run lint` – lint checks
- `npm run test` – unit tests
- `npm run build` – production build
- `npm run test:e2e` – builds and runs Playwright smoke tests

## Add a module / Legg til en modul

1. Add module UI/code under `src/modules/<module-name>/`.
2. Register the module in `src/modules/registry.ts` with route, icon, and translation keys.
3. Add matching strings in `src/i18n/en.json` and `src/i18n/nb.json`.

## GitHub Pages / GitHub Pages

Enable Pages in **Settings → Pages** and set **Source** to **GitHub Actions**. After that, pushes to `main` run the deploy workflow and publish `dist` to Pages.
