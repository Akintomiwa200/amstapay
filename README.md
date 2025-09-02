# 📱 Amstapay Mobile App

[![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![EAS Build](https://img.shields.io/badge/EAS_Build-4630EB?style=for-the-badge&logo=expo&logoColor=white)](https://docs.expo.dev/build/introduction/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://choosealicense.com/licenses/mit/)

> A modern, cross-platform mobile payment application built with **Expo + React Native**. Amstapay provides a seamless and secure mobile experience for financial transactions across Android, iOS, and Web platforms.

## ✨ Features

- 🔐 **Secure Authentication** - Multi-factor authentication with biometric support
- 💳 **Payment Processing** - Send, receive, and manage payments effortlessly
- 📊 **Transaction History** - Detailed transaction tracking and analytics
- 🌐 **Cross-Platform** - Runs natively on Android, iOS, and Web
- 🎨 **Modern UI/UX** - Intuitive design with smooth animations
- 🔔 **Push Notifications** - Real-time transaction alerts
- 📱 **Offline Support** - Core functionality works offline
- 🌙 **Dark Mode** - Built-in theme switching

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Expo CLI** - Install globally: `npm install -g @expo/cli`
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/amstapay.git
cd amstapay
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Configure your environment variables:

```env
EXPO_PUBLIC_API_URL=https://api.amstapay.com
EXPO_PUBLIC_ENVIRONMENT=development
EXPO_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
```

### 4. Start the Development Server

```bash
npx expo start
```

This will open the Expo development tools. You can then:

- 📱 **Scan QR code** with Expo Go app on your phone
- 🤖 **Press 'a'** to open on Android emulator
- 🍎 **Press 'i'** to open on iOS simulator
- 🌐 **Press 'w'** to open in web browser

## 📂 Project Structure

This project uses **Expo Router** for file-based navigation and follows modern React Native best practices:

```
amstapay/
│
├── app/                    # Main application screens (Expo Router)
│   ├── (auth)/            # Authentication screens
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── forgot-password.tsx
│   ├── (tabs)/            # Tab-based screens
│   │   ├── index.tsx      # Home/Dashboard
│   │   ├── transactions.tsx
│   │   ├── cards.tsx
│   │   └── profile.tsx
│   ├── _layout.tsx        # Root layout
│   └── +not-found.tsx     # 404 screen
│
├── assets/                 # Static assets
│   ├── images/            # App images and icons
│   ├── fonts/             # Custom fonts
│   └── lottie/            # Lottie animations
│
├── components/             # Reusable UI components
│   ├── ui/                # Basic UI components
│   ├── forms/             # Form components
│   ├── cards/             # Card components
│   └── modals/            # Modal components
│
├── contexts/               # React contexts
│   ├── AuthContext.tsx    # Authentication state
│   ├── ThemeContext.tsx   # Theme management
│   └── AppContext.tsx     # Global app state
│
├── hooks/                  # Custom React hooks
│   ├── useAuth.ts         # Authentication hook
│   ├── useApi.ts          # API calls hook
│   └── useTheme.ts        # Theme hook
│
├── services/               # External services
│   ├── api/               # API service layer
│   ├── auth/              # Authentication services
│   ├── storage/           # Local storage utilities
│   └── notifications/     # Push notification setup
│
├── utils/                  # Utility functions
│   ├── constants.ts       # App constants
│   ├── helpers.ts         # Helper functions
│   └── validators.ts      # Form validation
│
├── types/                  # TypeScript type definitions
│   ├── api.ts             # API response types
│   ├── auth.ts            # Auth-related types
│   └── navigation.ts      # Navigation types
│
├── app.json               # Expo configuration
├── eas.json               # EAS Build configuration
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## 🛠 Development Workflow

### Running the App

```bash
# Start development server
npm start

# Start with specific platform
npm run android
npm run ios
npm run web
```

### Code Quality

```bash
# Run TypeScript checks
npm run type-check

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Reset Project (Fresh Start)

If you want to start with a clean slate:

```bash
npm run reset-project
```

This moves the starter code to `app-example/` and creates a fresh `app/` directory.

## 📲 Download & Installation

### Development Builds

You can download the latest development builds:

<<<<<<< HEAD
- 📱 **Android APK**: [Download Amstapay (Android)](https://github.com/your-username/amstapay/releases/latest)
=======
- 📱 **Android APK**: [Download Amstapay (Android)] (https://expo.dev/artifacts/eas/6nBYbkHfubQdTFihqEXuPU.apk)
>>>>>>> 8fbe546ad7c51c49b95217ce87c27fb4c46dba91
- 🍎 **iOS TestFlight**: [Join Beta Testing](https://testflight.apple.com/join/your-testflight-link)

⚠️ **Note**: These are development builds for testing purposes. Production builds are available through official app stores.

### App Stores

- 📱 [Google Play Store](https://play.google.com/store/apps/details?id=com.amstapay.mobile) (Coming Soon)
- 🍎 [Apple App Store](https://apps.apple.com/app/amstapay/id123456789) (Coming Soon)

## 📦 Building for Production

Amstapay uses **Expo Application Services (EAS)** for production builds.

### Prerequisites

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Login to your Expo account:
   ```bash
   eas login
   ```

3. Configure your project:
   ```bash
   eas build:configure
   ```

### Build Commands

#### Android Production Build

```bash
# Production AAB for Google Play
eas build -p android --profile production

# Preview APK for testing
eas build -p android --profile preview
```

#### iOS Production Build

```bash
# Production build for App Store
eas build -p ios --profile production

# Preview build for TestFlight
eas build -p ios --profile preview
```

#### Local Builds

```bash
# Build locally (faster, but requires local setup)
eas build -p android --profile preview --local
eas build -p ios --profile preview --local
```

### Submit to App Stores

```bash
# Submit to Google Play
eas submit -p android

# Submit to App Store
eas submit -p ios
```

## 🔧 Configuration

### Environment Configuration

The app supports multiple environments:

- **Development** - Local development
- **Staging** - Pre-production testing
- **Production** - Live production app

### EAS Configuration (`eas.json`)

```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

### App Configuration (`app.json`)

Key configuration options:

- **Bundle Identifier**: `com.amstapay.mobile`
- **Version**: Automatically managed by EAS
- **Permissions**: Camera, Location, Biometric, etc.
- **Splash Screen**: Custom branding
- **Icons**: Adaptive icons for all platforms

## 🧪 Testing

### Testing Strategy

- **Unit Tests**: Component and utility testing with Jest
- **Integration Tests**: API and navigation flow testing
- **E2E Tests**: Full user journey testing with Detox
- **Manual Testing**: Device testing across multiple platforms

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests (requires build)
npm run test:e2e:android
npm run test:e2e:ios

# Performance testing
npm run test:performance
```

## 🚀 Deployment

### Continuous Integration

The project uses GitHub Actions for CI/CD:

- **Pull Requests**: Run tests and type checks
- **Main Branch**: Build and deploy to staging
- **Releases**: Build and submit to app stores

### Release Process

1. Create a release branch: `git checkout -b release/v1.0.0`
2. Update version numbers and changelog
3. Create pull request to main
4. After merge, tag release: `git tag v1.0.0`
5. Push tag to trigger production build

## 🔐 Security

- **API Security**: All API calls use HTTPS with token authentication
- **Data Encryption**: Sensitive data encrypted at rest and in transit
- **Biometric Auth**: Support for fingerprint and face recognition
- **Certificate Pinning**: Prevent man-in-the-middle attacks
- **Code Obfuscation**: Production builds are obfuscated

## 🌟 Performance

- **Bundle Size**: Optimized with Metro bundler
- **Image Optimization**: Automatic image compression
- **Lazy Loading**: Screens and components loaded on demand
- **Caching**: Smart caching for API responses and images
- **Memory Management**: Optimized for low-memory devices

## 📖 Documentation & Learning

### Expo & React Native

- 📚 [Expo Documentation](https://docs.expo.dev/) - Complete Expo guide
- 🧭 [Expo Router](https://expo.github.io/router/) - File-based navigation
- ⚛️ [React Native Docs](https://reactnative.dev/docs/getting-started) - Core concepts
- 🎨 [React Native Elements](https://reactnativeelements.com/) - UI components

### Development Resources

- 🛠 [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- 📱 [Expo Dev Tools](https://docs.expo.dev/workflow/development-mode/)
- 🔧 [Metro Bundler](https://facebook.github.io/metro/) - Build system
- 🧪 [Jest Testing Framework](https://jestjs.io/) - Testing utilities

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit with conventional commits: `git commit -m "feat: add amazing feature"`
5. Push to your branch: `git push origin feature/amazing-feature`
6. Create a Pull Request

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration with React Native rules
- **Prettier**: Automatic code formatting
- **Conventional Commits**: Standardized commit messages
- **Husky**: Pre-commit hooks for code quality

## 👥 Community & Support

### Get Help

- 💬 [Discord Community](https://discord.gg/amstapay) - Chat with developers
- 📧 [Email Support](mailto:support@amstapay.com) - Direct support
- 🐛 [Issue Tracker](https://github.com/your-username/amstapay/issues) - Bug reports
- 📖 [Wiki](https://github.com/your-username/amstapay/wiki) - Extended documentation

### Social Media

- 🐦 [Twitter](https://twitter.com/amstapay) - Updates and announcements
- 💼 [LinkedIn](https://linkedin.com/company/amstapay) - Professional updates
- 📱 [Instagram](https://instagram.com/amstapay) - Behind the scenes

## 📊 Project Status

- ✅ **Core Features**: Complete
- 🚧 **Advanced Features**: In development
- 📱 **Platform Support**: Android ✅, iOS ✅, Web ✅
- 🌍 **Internationalization**: English ✅, Others 🚧
- 🔐 **Security Audit**: Completed Q4 2024

## 📜 Changelog

See [CHANGELOG.md](CHANGELOG.md) for detailed release notes.

### Recent Updates

- **v1.2.0** (2024-08-30) - Added biometric authentication and dark mode
- **v1.1.0** (2024-08-15) - Performance improvements and bug fixes
- **v1.0.0** (2024-08-01) - Initial public release

## 🛡 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Amstapay

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 🙏 Acknowledgments

- **Expo Team** - For the amazing development platform
- **React Native Community** - For continuous improvements
- **Open Source Contributors** - For their valuable contributions
- **Beta Testers** - For helping us improve the app

---

<div align="center">

**Built with ❤️ by the Amstapay Team**

[Website](https://amstapay.com) • [Documentation](https://docs.amstapay.com) • [Support](mailto:support@amstapay.com)

<<<<<<< HEAD
</div>
=======
</div>
>>>>>>> 8fbe546ad7c51c49b95217ce87c27fb4c46dba91
