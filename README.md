# Mum Mentor Mobile

Expo-based React Native app for the Mum Mentor AI platform, built with [Expo Router](https://docs.expo.dev/router/introduction/).

## Tech Stack

- **Framework**: [Expo](https://expo.dev/) with Expo Router (file-based routing)
- **Language**: TypeScript
- **Fonts**: HankenGrotesk (Regular, Medium, SemiBold, Bold, ExtraBold)

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- npm (bundled with Node) or [Yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/client) for device testing
- Android Studio / Xcode only if you need emulators or native builds

## Install & Start

Install dependencies:

```sh
npm install
```

Start the Expo dev server (opens Metro + Dev Tools automatically):

```sh
npm start
```

## Run Targets

- **Android**

  ```sh
  npm run android
  ```

- **iOS** (on macOS; install pods first)

  ```sh
  bundle install
  bundle exec pod install
  npm run ios
  ```

- **Web**

  ```sh
  npm run web
  ```

- **Expo Go** – after `npm start`, scan the QR code in the terminal or Dev Tools.

## Project Structure

- `src/app/` – Expo Router routes (kebab-case files)
- `src/app/assets/` – fonts, images, and other assets
- `src/core/styles/` – design tokens, typography, scaling utilities

## Scripts Reference

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run android` | Run on Android emulator/device |
| `npm run ios` | Run on iOS simulator/device (macOS only) |
| `npm run web` | Run in web browser |
| `npm run lint` | Run ESLint with Expo preset |
| `npm start -- --clear` | Start with cleared Metro cache |

## Contributing

We follow a **feature branch workflow**:

1. Always branch from `staging`:
   ```sh
   git checkout staging
   git pull origin staging
   git checkout -b yourname/<type>/<feature-name>
   ```
   
2. Types: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`

3. Make your changes and commit with descriptive messages

4. Push and create a PR targeting `staging` (not `main`)

5. See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines

## Useful Docs

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)
- [React Native Docs](https://reactnative.dev/)
