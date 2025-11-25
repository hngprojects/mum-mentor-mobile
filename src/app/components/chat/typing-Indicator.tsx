import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { colors } from '@/src/core/styles';
import { s, vs, rbr } from '@/src/core/styles/scaling';

interface TypingIndicatorProps {
  isAiSpeaking?: boolean;
  isUserSpeaking?: boolean;
}

export const TypingIndicator = ({ 
  isAiSpeaking = false, 
  isUserSpeaking = false 
}: TypingIndicatorProps) => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isAiSpeaking || isUserSpeaking) {
      const animateDot = (dot: Animated.Value, delay: number) => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(dot, {
              toValue: -8,
              duration: 400,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(dot, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ])
        ).start();
      };

      animateDot(dot1, 0);
      animateDot(dot2, 150);
      animateDot(dot3, 300);
    }
  }, [isAiSpeaking, isUserSpeaking]);

  if (!isAiSpeaking && !isUserSpeaking) return null;

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {isAiSpeaking && (
          <Image 
            source={require("../../assets/images/ai-chat/small-icon.png")}
            style={styles.iconImage}
            resizeMode="contain"
          />
        )}
      </View>
      
      <View style={styles.bubbleContainer}>
        <View style={styles.dotsContainer}>
          <Animated.View 
            style={[
              styles.dot, 
              { transform: [{ translateY: dot1 }] }
            ]} 
          />
          <Animated.View 
            style={[
              styles.dot, 
              { transform: [{ translateY: dot2 }] }
            ]} 
          />
          <Animated.View 
            style={[
              styles.dot, 
              { transform: [{ translateY: dot3 }] }
            ]} 
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: s(16),
    paddingVertical: vs(8),
    alignItems: 'flex-end',
  },
  iconContainer: {
    width: s(32),
    height: s(32),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: s(8),
    marginBottom: vs(2),
  },
  iconImage: {
    width: s(32),
    height: s(32),
  },
  bubbleContainer: {
    backgroundColor: colors.textWhite,
    borderRadius: rbr(20),
    borderBottomLeftRadius: rbr(4),
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    paddingVertical: vs(16),
    paddingHorizontal: s(20),
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: s(6),
  },
  dot: {
    width: s(8),
    height: s(8),
    borderRadius: rbr(4),
    backgroundColor: colors.textPrimary,
  },
});