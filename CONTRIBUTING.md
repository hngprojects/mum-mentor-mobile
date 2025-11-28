# Contributing to Mum Mentor AI

Welcome! We're excited to have you contribute to this project. This guide will help you understand our development workflow, coding standards, and best practices.

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [State Management & API](#state-management--api)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Code Review Guidelines](#code-review-guidelines)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- React Native CLI
- Xcode (for iOS development)
- Android Studio (for Android development)

### Installation

```bash
# Clone the repository
git clone https://github.com/hngprojects/mum-mentor-mobile

# Install dependencies
yarn install

# iOS setup
cd ios && pod install && cd ..

# Run the app
yarn ios    # For iOS
yarn android # For Android
```

## Project Structure

We follow a **Vertical Slice Architecture** where each feature is self-contained within its own folder:

```
src/
    ├── app/                     <-- NEW: This is the routing root for Expo Router
    │   ├── (auth)/              <-- Authentication Group (No header)
    │   │   ├── sign-in.tsx
    │   │   └── sign-up.tsx
    │   │
    │   ├── (tabs)/              <-- Main App Group (Bottom tabs)
    │   │   ├── _layout.tsx
    │   │   ├── home.tsx         # Home Dashboard Screen
    │   │   ├── milestone.tsx    # Milestone Tracker Screen
    │   │   └── chat.tsx         # AI Chat Screen
    │   │
    │   └── _layout.tsx          # Root Layout for the entire application
    │
    └── core/                    <-- NEW: Contains shared, non-visual logic
        ├── api/                 # Axios setup
        ├── assets/              # Fonts, Images, Lottie
        ├── theme/               # Constants.ts, ThemeContext.tsx (Your work)
        ├── hooks/               # Global hooks (useTheme, useAuth)
        ├── stores/              # Zustand/Redux stores
        └── types/
```

### Key Principles

- **Feature Independence**: Each feature should be as self-contained as possible
- **Shared Resources**: Only place code in `app/` when it's genuinely reusable across multiple features
- **Colocation**: Keep related files close together within their feature folder

## Development Workflow

### Branch Naming Convention

All branches must follow this format:

```
<your-name>/<type>/<feature-description>
```

**Examples:**

- `chidindu/feat/onboarding`
- `ukeme/fix/login-validation`
- `amaka/refactor/payment-flow`
- `tunde/chore/update-dependencies`

**Branch Types:**

- `feat` - New features
- `fix` - Bug fixes
- `refactor` - Code refactoring
- `chore` - Maintenance tasks (dependencies, configuration)
- `docs` - Documentation updates
- `test` - Adding or updating tests

### Workflow Steps

1. **Always branch from `staging`:**

   ```bash
   git checkout staging
   git pull origin staging
   git checkout -b yourname/feat/new-feature
   ```

2. **Make your changes and commit regularly:**

   ```bash
   git add .
   git commit -m "feat: add user profile screen"
   ```

3. **Keep your branch updated:**

   ```bash
   git fetch origin staging
   git rebase origin/staging
   ```

4. **Push your branch:**

   ```bash
   git push origin yourname/feat/new-feature
   ```

5. **Create a Pull Request to `staging`**

## Coding Standards

### File Naming Conventions

#### Components (PascalCase)

```
Button.tsx
BottomSheet.tsx
UserProfileCard.tsx
PaymentMethodList.tsx
```

#### Domain Logic (camelCase)

```
authService.ts
validateEmail.ts
formatCurrency.ts
userRepository.ts
```

#### Hooks (camelCase with 'use' prefix)

```
useAuth.ts
useDebounce.ts
useKeyboard.ts
```

#### Types (PascalCase)

```
User.types.ts
ApiResponse.types.ts
```

### TypeScript Guidelines

- **Always use TypeScript** - No implicit `any` types
- **Define interfaces for props:**

  ```typescript
  interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: "primary" | "secondary";
    disabled?: boolean;
  }

  export const Button = ({
    title,
    onPress,
    variant = "primary",
    disabled = false,
  }: ButtonProps) => {
    // Component implementation
  };
  ```

- **Use type inference when obvious:**

  ```typescript
  // Good
  const count = 0;
  const users = ["John", "Jane"];

  // Explicit when needed
  const callback: (id: string) => void = (id) => console.log;
  ```

### Component Structure

```typescript
// Imports
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@/app/components';

// Types
interface UserCardProps {
  userId: string;
  onPress: () => void;
}

// Component
export const UserCard = ({ userId, onPress }: UserCardProps) => {
  // Hooks
  const [isLoading, setIsLoading] = useState(false);

  // Effects
  useEffect(() => {
    // Effect logic
  }, []);

  // Handlers
  const handlePress = () => {
    onPress();
  };

  // Render
  return (
    <View style={styles.container}>
      <Text>User: {userId}</Text>
      <Button title="View Profile" onPress={handlePress} />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
});
```

### Code Style

- **Use functional components** with hooks
- **Destructure props** in function parameters
- **Use early returns** for cleaner code
- **Avoid nested ternaries** - use if/else or separate variables
- **Keep components small** - extract logic into custom hooks when needed
- **Use meaningful variable names** - `isLoading` not `flag`, `userData` not `data`

## State Management & API

### Zustand for State Management

Create stores within each feature's `stores/` folder:

```typescript
// features/authentication/stores/authStore.ts
import { create } from "zustand";
import { User } from "../types/User.types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
```

**Best Practices:**

- Keep stores focused and feature-specific
- Use selectors to prevent unnecessary re-renders
- Avoid storing derived state

### API Calls with Axios and TanStack Query

```typescript
// features/authentication/api/authApi.ts
import axios from "axios";
import { API_BASE_URL } from "@/app/config";

export const authApi = {
  login: async (email: string, password: string) => {
    const { data } = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password,
    });
    return data;
  },
};
```

```typescript
// features/authentication/hooks/useLogin.ts
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import { useAuthStore } from "../stores/authStore";

export const useLogin = () => {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: (data) => {
      login(data.user);
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};
```

**API Best Practices:**

- Use TanStack Query for all server state
- Implement proper error handling
- Use query keys consistently
- Leverage optimistic updates when appropriate

## Testing

### Test Structure

```typescript
// Button.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button', () => {
  it('renders with title', () => {
    const { getByText } = render(<Button title="Click Me" onPress={() => {}} />);
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="Click Me" onPress={onPress} />);

    fireEvent.press(getByText('Click Me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
```

### Testing Guidelines

- Write tests for complex business logic
- Test user interactions
- Mock API calls and external dependencies
- Aim for meaningful coverage, not 100%

## Pull Request Process

### Before Creating a PR

- [ ] Run linter: `yarn lint`
- [ ] Run tests: `yarn test`
- [ ] Test on both iOS and Android
- [ ] Remove console.logs and debugging code
- [ ] Update relevant documentation

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Refactoring
- [ ] Documentation update

## Testing

- [ ] Tested on iOS
- [ ] Tested on Android
- [ ] Added/updated tests

## Screenshots/Video

(if applicable)

## Related Issues

Closes #[issue number]
```

### PR Best Practices

- **Keep PRs focused** - One feature/fix per PR
- **Write clear descriptions** - Explain what and why
- **Add screenshots/videos** for UI changes
- **Link related issues**
- **Request specific reviewers** when needed

## Code Review Guidelines

### As a Reviewer

- **Be constructive** - Suggest improvements, don't just criticize
- **Ask questions** - Seek to understand the approach
- **Approve quickly** - Don't block PRs unnecessarily
- **Test locally** for complex changes

### As an Author

- **Respond to feedback** promptly
- **Explain your decisions** when asked
- **Be open to suggestions**
- **Thank reviewers** for their time

### Review Checklist

- [ ] Code follows project conventions
- [ ] No unnecessary complexity
- [ ] Proper error handling
- [ ] TypeScript types are correct
- [ ] No console.logs or commented code
- [ ] UI matches design specs

## Common Issues & Solutions

### Metro Bundler Issues

```bash
yarn start -- --reset-cache
```

### iOS Build Issues

```bash
cd ios && pod install && cd ..
yarn ios
```

### Android Build Issues

```bash
cd android && ./gradlew clean && cd ..
yarn android
```

## Additional Resources

- [React Native Documentation](https://reactnative.dev/)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Questions?

If you have questions or need help, reach out to the team on [Slack/Discord/etc.].

---

Thank you for contributing! 🚀
