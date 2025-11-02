# Project: Stoppclock

## Project Overview

This is a web-based, projector-friendly timer and clock application named "Stoppclock". It is designed for use in classrooms, exams, and seminars. The application is a Progressive Web App (PWA), which means it can be installed on devices and used offline.

The project is built using modern web technologies:

*   **Frontend Framework:** React 18 with TypeScript
*   **Build Tool:** Vite
*   **UI:** The UI is component-based, with a focus on high contrast and large displays for projector optimization. It uses `lucide-react` for icons.
*   **Routing:** A custom hash-based routing solution is implemented in `src/main.tsx`.
*   **Testing:** End-to-end testing is set up with Playwright.

The application provides a variety of timer tools, including:

*   Analog and Digital Countdowns
*   Stopwatch
*   World Clock
*   Alarm Clock
*   Metronome
*   Chess Clock
*   Pomodoro Timer
*   Cooking Timer

## Building and Running

The project uses `npm` for package management.

*   **Install Dependencies:**
    ```bash
    npm install
    ```

*   **Run Development Server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

*   **Build for Production:**
    ```bash
    npm run build
    ```
    The production files will be placed in the `dist/` directory.

*   **Run End-to-End Tests:**
    ```bash
    npm run test:e2e
    ```
    This command runs the Playwright tests.

## Development Conventions

*   **Code Style:** The project uses TypeScript for type safety. The code is organized into components, pages, and hooks.
*   **State Management:** The application uses React hooks for state management. `localStorage` is used for local state persistence.
*   **Testing:** End-to-end tests are located in the `tests/e2e` directory and are written using Playwright. The tests are run against a production preview of the application.
*   **PWA:** The application is a Progressive Web App. The service worker is located at `public/sw.js` and the web app manifest is at `public/manifest.webmanifest`.
