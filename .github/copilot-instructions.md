# Copilot Instructions for AI Agents

## Project Overview
- This is an Expo React Native project (see `README.md`).
- The codebase targets both Android and iOS, with native code in `android/` and `ios/`.
- Main app code is in the `app/` directory. Example/demo code is in `app-example/`.
- Widgets are implemented in `widget/` (e.g., `BusETAWidget.tsx`, `HelloWidget.tsx`).

## Key Workflows
- **Install dependencies:** `npm install`
- **Run on Android:** `npx expo run:android`
- **Run on iOS:** `npx expo run:ios` (requires macOS)
- **Reset project:** See `app-example/scripts/reset-project.js`

## Architectural Patterns
- **Navigation:** App navigation is organized using `_layout.tsx` files in `app/` and `app-example/`.
- **Routes:** Route definitions are in `my_routes.tsx` and subfolders under `app/` and `app-example/(tabs)/`.
- **UI Components:** Shared UI components are in `app-example/components/` and `app-example/components/ui/`.
- **Hooks:** Custom hooks are in `app-example/hooks/`.
- **Theming:** Theming logic is in `app-example/constants/theme.ts` and related hooks.
- **Utilities:** Utility functions (e.g., fetch, time formatting) are in `app/utils/`.

## Project Conventions
- Use TypeScript for all new code.
- Organize screens and navigation using folders and `_layout.tsx` files.
- Place shared logic in `utils/`, `hooks/`, or `components/` as appropriate.
- Widget-related logic should go in `widget/`.
- Use `app-example/` for experimental or demo features.

## Integration Points
- **Native code:** Android and iOS native code is in `android/` and `ios/`.
- **Expo:** Project is managed with Expo; see `app.json` and `eas.json` for configuration.
- **Build tools:** Android uses Gradle (`android/build.gradle`), iOS uses CocoaPods (`ios/Podfile`).

## Examples
- See `app-example/components/parallax-scroll-view.tsx` for advanced UI patterns.
- See `widget/BusETAWidget.tsx` for widget implementation.
- See `app/utils/fetch.ts` for API call patterns.

## Additional Notes
- Follow the folder structure and naming conventions as seen in `app/` and `app-example/`.
- For new navigation routes, update the relevant `_layout.tsx` and `my_routes.tsx`.
- For theming, use the hooks and constants provided in `app-example/hooks/` and `app-example/constants/`.
