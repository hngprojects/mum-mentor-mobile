import { colors, spacing, typography } from '@/core/styles';
import { ms, rbr, rfs, vs } from '@/core/styles/scaling';
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
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

interface OnboardingSlide {
  id: number;
  title: string;
  text: string;
  backgroundImage: any;
  image: any;
  buttonText: string;
}

const slides = [
  {
    title: 'Welcome to Mum Mentor AI',
    text: 'Parent with confidence, backed by AI-powered support.',
    backgroundImage: require('@/assets/images/onboarding/slide1.png'),
    image: require('@/assets/images/onboarding/slide1.png'),
    buttonText: 'Continue',
  },
  {
    title: 'Track Your Baby’s Growth',
    text: 'Stay ahead with weekly insights tailored to your child.',
    backgroundImage: require('@/assets/images/onboarding/slide2.png'),
    image: require('@/assets/images/onboarding/slide2.png'),
    buttonText: 'Next',
  },
  {
    title: 'Join Our Community',
    text: 'Connect with mums and share your parenting journey.',
    backgroundImage: require('@/assets/images/onboarding/slide3.png'),
    image: require('@/assets/images/onboarding/slide3.png'),
    buttonText: 'Get Started',
  },
];


interface OnboardingProps {
  onComplete?: () => void;
}

interface SlideContentProps {
  slide: OnboardingSlide;
  isLastSlide: boolean;
  onNext: () => void;
  onSkip: () => void;
  onLogin: () => void;
}

const SlideContent: React.FC<SlideContentProps> = ({
  slide,
  isLastSlide,
  onNext,
  onSkip,
  onLogin,
}) => {
  return (
    <ImageBackground
      source={slide.backgroundImage}
      style={styles.slideContainer}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.overlay} />

      <View style={styles.topContent}>
        <Text style={styles.logoText}>Mum Mentor AI</Text>
      </View>

      <View style={styles.imageWrapper}>
        <Image source={slide.image} style={styles.heroImage} resizeMode="contain" />
      </View>

      <View style={styles.bottomSheet}>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.description}>{slide.text}</Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={isLastSlide ? onLogin : onNext}
          activeOpacity={0.9}
        >
          <Text style={styles.primaryButtonText}>{slide.buttonText}</Text>
        </TouchableOpacity>

        {!isLastSlide && (
          <TouchableOpacity style={styles.secondaryButton} onPress={onSkip}>
            <Text style={styles.secondaryButtonText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>
    </ImageBackground>
  );
};

const OnboardingScreen: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      translateX.value = withSpring(0);
    } else {
      handleLogin();
    }
  };

  const handleSkip = () => {
    setCurrentIndex(SLIDES.length - 1);
    translateX.value = withSpring(0);
  };

  const handleLogin = () => {
    onComplete?.();
    router.replace('/(auth)/sign-in');
  };

  const panGesture = Gesture.Pan()
    .onChange((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (event.translationX < -50 && currentIndex < SLIDES.length - 1) {
        runOnJS(setCurrentIndex)(currentIndex + 1);
      } else if (event.translationX > 50 && currentIndex > 0) {
        runOnJS(setCurrentIndex)(currentIndex - 1);
      }
      translateX.value = withSpring(0);
    });

  const animatedSlideStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const currentSlide = SLIDES[currentIndex];

  return (
    <View style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.slideWrapper, animatedSlideStyle]}>
          <SlideContent
            slide={currentSlide}
            isLastSlide={currentIndex === SLIDES.length - 1}
            onNext={handleNext}
            onSkip={handleSkip}
            onLogin={handleLogin}
          />
        </Animated.View>
      </GestureDetector>

      <View style={styles.pagination}>
        {SLIDES.map((slide, index) => (
          <View
            key={slide.id}
            style={[
              styles.dot,
              index === currentIndex && styles.dotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },

  slideWrapper: {
    flex: 1,
  },

  slideContainer: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: vs(60),
    paddingBottom: vs(24),
    justifyContent: 'space-between',
  },

  backgroundImage: {
    resizeMode: 'cover',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },

  topContent: {
    alignItems: 'center',
  },

  logoText: {
    ...typography.labelLarge,
    color: colors.textWhite,
  },

  imageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: vs(16),
  },

  heroImage: {
    width: '100%',
    height: '100%',
  },

  bottomSheet: {
    backgroundColor: colors.backgroundMain,
    borderRadius: rbr(24),
    paddingHorizontal: spacing.lg,
    paddingVertical: vs(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },

  title: {
    ...typography.heading2,
    color: colors.textPrimary,
    marginBottom: vs(8),
  },

  description: {
    ...typography.bodySmall,
    color: colors.textGrey1,
    marginBottom: vs(24),
  },

  primaryButton: {
    width: '100%',
    paddingVertical: vs(12),
    borderRadius: rbr(999),
    backgroundColor: colors.primary,
    alignItems: 'center',
    marginBottom: vs(8),
  },

  primaryButtonText: {
    ...typography.buttonText,
    color: colors.textWhite,
  },

  secondaryButton: {
    width: '100%',
    paddingVertical: vs(8),
    alignItems: 'center',
  },

  secondaryButtonText: {
    ...typography.labelMedium,
    color: colors.primary,
  },

  pagination: {
    position: 'absolute',
    bottom: vs(16),
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
  },

  dot: {
    width: ms(8),
    height: ms(8),
    borderRadius: rbr(4),
    backgroundColor: colors.secondaryLight,
  },

  dotActive: {
    width: ms(16),
    backgroundColor: colors.primary,
  },
});
