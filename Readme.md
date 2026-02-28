# RozgarSetu — Job Portal Website

A modern, responsive Job Portal built with plain HTML, CSS and JavaScript. The app loads job listings from a local `jobs.json` file and demonstrates filtering, sorting, pagination and a saved-jobs feature persisted in the browser.

## Table of contents

- [Features](#features)
- [Technologies](#technologies)
- [Project structure](#project-structure)
- [Run locally](#run-locally)
- [How it works](#how-it-works)
- [Customization guide](#customization-guide)
- [Future improvements](#future-improvements)
- [Learning outcomes](#learning-outcomes)
- [Author](#author)
- [License](#license)

## Features

- Responsive, mobile-first UI
- Dynamic job listings loaded from `jobs.json`
- Search (title/company/skills/description)
- Filters: Location, Experience, Category, Salary range
- Sorting: Newest, Salary ↑/↓, Title A–Z
- Pagination (6 jobs per page)
- Save/unsave jobs persisted in `localStorage`
- Job detail modal with Apply placeholder and toast notifications

## Technologies

- HTML5
- CSS3
- JavaScript (Vanilla)
- JSON (sample data)

## Project structure

```
Job Portal/
├── index.html      # Main single-page app
├── style.css       # Styles and responsive rules
├── script.js       # App logic (fetching, filtering, UI)
└── jobs.json       # Sample job dataset
```

## Run locally

This is a static project. You can open `index.html` directly, but to allow `fetch()` to load `jobs.json` reliably, use a local web server.

Recommended options:

- Using Python 3 (from project folder):

```bash
python -m http.server 8000
# open http://localhost:8000
```

- Using VS Code Live Server extension: open the folder and click **Go Live** or right-click `index.html` → *Open with Live Server*.

## How it works

1. `script.js` fetches `jobs.json` on load.
2. Jobs are stored in `allJobs` and filtered into `filteredJobs`.
3. `applyFiltersAndSort()` applies search, filter and sort criteria and calls `displayJobs()`.
4. `displayJobs()` paginates and renders job cards into the DOM.
5. `toggleSave(id)` adds/removes jobs from the saved list and persists to `localStorage` (key: `rozgarSetu_saved`).

## Customization guide

- Add or edit sample jobs: modify `jobs.json` (include `salaryMin` and `salaryMax` for salary filtering).
- Change styling: edit `style.css`.
- Extend behavior or UI: edit `script.js`.

Useful functions to extend:

- `applyFiltersAndSort()` — central filtering + sorting pipeline
- `toggleSave(id)` — save/remove job and update UI/localStorage
- `openModal(id)` — render job details in modal

## Future improvements

- Add server-side backend and persistent database
- Implement user accounts and saved-jobs per user
- Add advanced filters and facets
- Add unit tests and automated linting
- Improve accessibility (focus management for modal)

## Learning outcomes

- DOM manipulation and dynamic rendering
- Working with JSON data
- Building responsive UIs with CSS
- Implementing client-side state (localStorage)

## Author

Your Name — Y Nilakantha

GitHub: https://github.com/nilakantha1029-cloud

## License

This project is provided for educational purposes and may be reused freely. (Add an explicit license file such as `LICENSE` if you want a formal license.)
