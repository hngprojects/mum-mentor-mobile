// src/app/components/chat/TypingIndicator.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

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
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {isUserSpeaking ? 'Live chat' : 'live Chat (AI Speaking)'}
        </Text>
      </View>
      
      <View style={styles.indicatorContainer}>
        <View style={styles.iconContainer}>
          <View style={[styles.icon, isAiSpeaking && styles.aiIcon]}>
            <Text style={styles.iconEmoji}>
              {isAiSpeaking ? '👶' : '👤'}
            </Text>
          </View>
        </View>

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
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
  },
  headerText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  iconContainer: {
    marginRight: 4,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiIcon: {
    backgroundColor: '#FF4B6E',
  },
  iconEmoji: {
    fontSize: 16,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#999999',
  },
});