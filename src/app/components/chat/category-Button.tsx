// src/app/components/chat/CategoryButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface CategoryButtonProps {
  title: string;
  icon: string;
  backgroundColor: string;
  onPress: () => void;
}

export const CategoryButton = ({ 
  title, 
  icon, 
  backgroundColor, 
  onPress 
}: CategoryButtonProps) => {
  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
    <Text style={styles.title}>{title}</Text>
      <Text style={styles.icon}>{icon}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
 button: {
  width: "48%",
  height: 48,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderRadius: 8,
  borderWidth: 0.5,
  borderColor: "#D5D5D5",
  marginBottom: 10,
},
  icon: {
    fontSize: 20,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    flex: 1,
  },
});