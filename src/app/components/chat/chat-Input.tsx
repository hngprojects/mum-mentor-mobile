import React from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image
} from 'react-native';
import { colors } from '@/src/core/styles';
import { s, vs, rfs, rbr } from '@/src/core/styles/scaling';

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  placeholder?: string;
  isAiSpeaking?: boolean;
}

export const ChatInput = ({ 
  value, 
  onChangeText, 
  onSend,
  placeholder = 'Ask anything...',
  isAiSpeaking = false
}: ChatInputProps) => {
  const hasText = value.trim().length > 0;
  
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textGrey2}
          multiline={false}
          maxLength={500}
          editable={!isAiSpeaking}
        />
        
        <TouchableOpacity 
          style={[
            styles.sendButton, 
            { 
              backgroundColor: isAiSpeaking 
                ? colors.primary 
                : (hasText ? colors.primary : colors.outlineVariant) 
            }
          ]}
          onPress={onSend}
          disabled={!hasText && !isAiSpeaking}
          activeOpacity={0.7}
        >
          {isAiSpeaking ? (
            <View style={styles.stopIcon} />
          ) : (
            <Image
              source={require('../../assets/images/ai-chat/send-message-icon.png')}
              style={styles.sendIcon}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.textWhite,
    paddingHorizontal: s(16),
    paddingTop: vs(8),
    paddingBottom: vs(24),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.textWhite,
    borderRadius: rbr(12),
    paddingLeft: s(16),
    paddingRight: s(8),
    paddingVertical: vs(8),
    borderWidth: 1,
    borderColor: '#D5D5D5',
    minHeight: vs(48),
  },
  input: {
    flex: 1,
    fontSize: rfs(15),
    color: colors.textPrimary,
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginRight: s(8),
  },
  sendButton: {
    width: s(36),
    height: s(36),
    borderRadius: rbr(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    width: s(18),
    height: s(18),
    tintColor: colors.textWhite,
  },
  stopIcon: {
    width: s(12),
    height: s(12),
    backgroundColor: colors.textWhite,
    borderRadius: rbr(2),
  },
});