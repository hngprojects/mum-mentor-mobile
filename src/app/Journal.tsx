import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../core/styles/index';
import { ms, rfs } from '../core/styles/scaling';
import JournalEntryModal from './components/JournalEntryModal';
import { UploadedPhoto } from './components/PhotoUploader';
import PrimaryButton from './components/PrimaryButton';

const journalIcon = require('../assets/images/journalicon.png');
const arrowIcon = require('../assets/images/arrow.png');

interface JournalEntry {
  id: string;
  title: string;
  date: string;
  categories: string[];
  mood: string | null;
  photos: UploadedPhoto[];
  thoughts: string;
}

const JournalScreen = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const hasEntries = entries.length > 0;

  const handleSaveEntry = (entry: JournalEntry) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      setTimeout(() => {
        setEntries((prev) => [entry, ...prev]);
        setIsCreateModalVisible(false);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error saving entry:', error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.textWhite} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
            >
              <Image source={arrowIcon} style={styles.arrowImage} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Journal</Text>
          </View>

          {/* Content */}
          {hasEntries ? (
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Journal entries will be rendered here */}
            </ScrollView>
          ) : (
            <View style={styles.emptyContainer}>
              <Image source={journalIcon} style={styles.emptyIcon} />
              <Text style={styles.emptyTitle}>No journal entries yet</Text>
              <Text style={styles.emptySubtext}>
                Create your first entry to start tracking{'\n'}your thoughts, goals, or memories.
              </Text>
            </View>
          )}

          {/* Floating Add Button */}
          <View style={styles.fabContainer}>
            <PrimaryButton
              title="+"
              onPress={() => setIsCreateModalVisible(true)}
              style={styles.fabButton}
            />
          </View>

          {/* Journal Entry Modal */}
          <JournalEntryModal
            isVisible={isCreateModalVisible}
            onClose={() => setIsCreateModalVisible(false)}
            onSave={handleSaveEntry}
            isLoading={isLoading}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.textWhite,
  },
  container: {
    flex: 1,
    backgroundColor: colors.textWhite,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: ms(16),
    paddingTop: ms(64),
    gap: ms(8),
    backgroundColor: colors.textWhite,
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: ms(spacing.xs),
  },
  arrowImage: {
    width: ms(24),
    height: ms(24),
    resizeMode: 'contain',
  },
  headerTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
  },
  headerSpacer: {
    display: 'none',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ms(spacing.xl + spacing.sm),
  },
  emptyIcon: {
    width: ms(50),
    height: ms(50),
    resizeMode: 'contain',
    marginBottom: ms(spacing.lg),
  },
  emptyTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
    marginBottom: ms(spacing.sm),
    textAlign: 'center',
  },
  emptySubtext: {
    ...typography.bodySmall,
    color: colors.textGrey1,
    textAlign: 'center',
    lineHeight: rfs(20),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: ms(100),
  },
  fabContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? ms(40) : ms(30),
    right: ms(20),
    width: ms(56),
  },
  fabButton: {
    paddingVertical: ms(12),
  },
  floatingButton: {
    position: 'absolute',
    right: ms(20),
    bottom: Platform.OS === 'ios' ? ms(40) : ms(30),
    width: ms(56),
    height: ms(56),
    borderRadius: ms(8),
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  floatingButtonText: {
    fontSize: rfs(32),
    color: colors.textWhite,
    fontFamily: typography.bodyMedium.fontFamily,
    fontWeight: '300',
    marginTop: ms(-2),
  },
});

export default JournalScreen;
