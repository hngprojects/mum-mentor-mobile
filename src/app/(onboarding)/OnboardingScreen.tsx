import { colors, spacing, typography } from '@/src/core/styles';
import { ms, rbr, rfs, vs } from '@/src/core/styles/scaling';
import React, { useState } from 'react';
import { router } from 'expo-router';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Interface for each onboarding slide
 * Contains all necessary data to render a single slide
 */
interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  image: any; // Image source from require()
}

/**
 * Props for the OnboardingSlideItem component
 */
interface OnboardingSlideItemProps {
  slide: OnboardingSlide;
  currentIndex: number;
  totalSlides: number;
  onSelectSlide: (index: number) => void;
  onNext: () => void;
  onSkip: () => void;
  onLogin: () => void;
  onSignUp: () => void;
}

/**
 * Onboarding slides data array
 * Contains the content for all 3 onboarding screens
 */
const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Your Motherhood Companion',
    subtitle: 'Personalized support for every stage of motherhood.',
    image: require('../../assets/images/onboarding/slide1.png'),
  },
  {
    id: '2',
    title: 'Your 24/7 AI Mentor',
    subtitle:
      'Ask questions, get clarity, and receive trusted answers anytime you need support.',
    image: require('../../assets/images/onboarding/slide2.png'),
  },
  {
    id: '3',
    title: 'Track Milestones With Ease',
    subtitle: 'Track milestones, save memories, stay confident.',
    image: require('../../assets/images/onboarding/slide3.png'),
  },
];


/**
 * Individual slide component
 * Displays background image, pagination dots, logo, title, subtitle, and action buttons
 */
const OnboardingSlideItem: React.FC<OnboardingSlideItemProps> = ({ 
  slide, 
  currentIndex, 
  totalSlides,
  onSelectSlide,
  onNext,
  onSkip,
  onLogin,
  onSignUp 
}) => {
  // Determine if we're on the last slide
  const isLastSlide = currentIndex === totalSlides - 1;

  return (
    <ImageBackground
      source={slide.image}
      style={styles.slideContainer}
      resizeMode="cover"
    >
      {/* Content container positioned at bottom */}
      <View style={styles.contentContainer}>
        {/* Pagination dots - positioned above logo */}
        <View style={styles.paginationContainer}>
          {Array.from({ length: totalSlides }).map((_, index) => (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={`Go to slide ${index + 1}`}
              onPress={() => onSelectSlide(index)}
              key={index}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.dot,
                  index === currentIndex
                    ? styles.dotActive
                    : styles.dotInactive,
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* NORA Logo */}
        <Image
          source={require('../../assets/images/logo-horizontal.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Title */}
        <Text style={styles.title}>{slide.title}</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>{slide.subtitle}</Text>
      </View>

      {/* Bottom controls container (buttons) */}
      <View style={styles.controlsContainer}>
        {/* Primary action button (Next or Log in) */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={isLastSlide ? onLogin : onNext}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={isLastSlide ? 'Log in to your account' : 'Go to next slide'}
        >
          <Text style={styles.primaryButtonText}>
            {isLastSlide ? 'Log in' : 'Next'}
          </Text>
        </TouchableOpacity>

        {/* Secondary action button (Skip or Sign Up) */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={isLastSlide ? onSignUp : onSkip}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={isLastSlide ? 'Sign up for a new account' : 'Skip to last slide'}
        >
          <Text style={styles.secondaryButtonText}>
            {isLastSlide ? 'Sign Up' : 'Skip'}
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};



export default function OnboardingSlides() {

  // Track current active slide index (0, 1, or 2)
  const [currentIndex, setCurrentIndex] = useState(0);

  // Animated values for swipe gestures
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  /**
   * Mark onboarding as complete and save to AsyncStorage
   */
  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('@OnboardingComplete', 'true');
    } catch (error) {
      console.error('Failed to save onboarding status:', error);
    }
  };

  /**
   * Handle "Next" button press
   * Advances to the next slide
   */
  const handleNext = () => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      // Animate transition
      opacity.value = withTiming(0, { duration: 200 }, () => {
        runOnJS(setCurrentIndex)(currentIndex + 1);
        opacity.value = withTiming(1, { duration: 200 });
      });
    }
  };

  /**
   * Handle going to previous slide
   */
  const handlePrevious = () => {
    if (currentIndex > 0) {
      // Animate transition
      opacity.value = withTiming(0, { duration: 200 }, () => {
        runOnJS(setCurrentIndex)(currentIndex - 1);
        opacity.value = withTiming(1, { duration: 200 });
      });
    }
  };

  /**
   * Handle "Skip" button press
   * Jumps directly to the last slide (slide 3)
   */
  const handleSkip = () => {
    opacity.value = withTiming(0, { duration: 200 }, () => {
      runOnJS(setCurrentIndex)(ONBOARDING_SLIDES.length - 1);
      opacity.value = withTiming(1, { duration: 200 });
    });
  };

  /**
   * Handle "Log in" button press
   * Marks onboarding as complete before navigating
   */
  const handleLogin = async () => {
    await completeOnboarding();
    router.push('./(auth)/SignInScreen');
  };

  /**
   * Handle "Sign Up" button press
   * Marks onboarding as complete before navigating
   */
  const handleSignUp = async () => {
    await completeOnboarding();
    router.push('./(auth)/SignUpScreen');
  };

  /**
   * Pan gesture for swipe navigation
   */
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // Update translateX based on gesture movement
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      const swipeThreshold = 50; // Minimum swipe distance in pixels
      const velocity = event.velocityX;

      // Determine if swipe was strong enough
      if (Math.abs(event.translationX) > swipeThreshold || Math.abs(velocity) > 500) {
        if (event.translationX < 0 && currentIndex < ONBOARDING_SLIDES.length - 1) {
          // Swipe left -> Next slide
          translateX.value = withSpring(0);
          runOnJS(handleNext)();
        } else if (event.translationX > 0 && currentIndex > 0) {
          // Swipe right -> Previous slide
          translateX.value = withSpring(0);
          runOnJS(handlePrevious)();
        } else {
          // Reset position if swipe not valid
          translateX.value = withSpring(0);
        }
      } else {
        // Reset position if swipe too weak
        translateX.value = withSpring(0);
      }
    });

  // --- RENDER ---

  // Get the current slide to display
  const currentSlide = ONBOARDING_SLIDES[currentIndex];

  // Animated style for slide transitions
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, animatedStyle]}>
        {/* Render only the current slide */}
        <OnboardingSlideItem
          slide={currentSlide}
          currentIndex={currentIndex}
          totalSlides={ONBOARDING_SLIDES.length}
          onSelectSlide={setCurrentIndex}
          onNext={handleNext}
          onSkip={handleSkip}
          onLogin={handleLogin}
          onSignUp={handleSignUp}
        />
      </Animated.View>
    </GestureDetector>
  );
}

// STYLES

const styles = StyleSheet.create({
  // Main container - fills entire screen
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },

  // Individual slide container - stretches to fill available space
  slideContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end', // Push content to bottom
  },

  // Content container at bottom of each slide
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: vs(180), // Space for controls at bottom
    alignItems: 'center',
  },

  // Pagination dots container - positioned above logo
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(12),
    marginBottom: vs(24),
  },

  // Individual pagination dot
  dot: {
    width: ms(16),
    height: ms(6),
    borderRadius: rbr(8),
  },

  // Active dot styling
  dotActive: {
    backgroundColor: colors.primary,
    width: ms(32), // Longer to indicate active
  },

  // Inactive dot styling
  dotInactive: {
    backgroundColor: colors.secondaryLight,
    width: ms(16),
  },

  // NORA logo styling
  logo: {
    width: ms(100),
    height: vs(40),
    marginBottom: vs(24),
  },

  // Slide title styling
  title: {
    ...typography.heading2,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: vs(12),
  },

  // Slide subtitle styling
  subtitle: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: rfs(24),
    paddingHorizontal: spacing.md,
    bottom: vs(8),
  },

  // Bottom controls container (buttons)
  controlsContainer: {
    position: 'absolute',
    bottom: vs(40),
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingBottom: vs(32),
    alignItems: 'center',
  },

  // Primary button (Next / Log in)
  primaryButton: {
    width: '100%',
    backgroundColor: colors.primary,
    paddingVertical: vs(14),
    borderRadius: rbr(8),
    alignItems: 'center',
    marginBottom: vs(10),
  },

  // Primary button text
  primaryButtonText: {
    ...typography.buttonText,
    color: colors.textWhite,
  },

  // Secondary button (Skip / Sign Up)
  secondaryButton: {
    width: '100%',
    paddingVertical: vs(8),
    alignItems: 'center',
  },

  // Secondary button text
  secondaryButtonText: {
    ...typography.labelMedium,
    color: colors.primary,
  },
});