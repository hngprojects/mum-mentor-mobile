import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../core/styles/index';
import { ms, rfs } from '../core/styles/scaling';
import JournalEntryCard from './components/JournalEntryCard';
import JournalEntryModal from './components/JournalEntryModal';
import { UploadedPhoto } from './components/PhotoUploader';
import PrimaryButton from './components/PrimaryButton';

const journalIcon = require('../assets/images/journalicon.png');
const arrowIcon = require('../assets/images/arrow.png');

const STORAGE_KEY = 'journal_entries';

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
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const hasEntries = entries.length > 0;

  const categories = ['All', 'Sleep', 'Memories', 'Body Recovery', 'Challenges', 'Milestone', 'Self-Care'];

  // Load entries from AsyncStorage on mount
  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const storedEntries = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedEntries) {
        setEntries(JSON.parse(storedEntries));
      }
    } catch (error) {
      console.error('Error loading entries:', error);
    }
  };

  const handleSaveEntry = async (entry: JournalEntry) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      setTimeout(async () => {
        const updatedEntries = [entry, ...entries];
        setEntries(updatedEntries);
        
        // Save to AsyncStorage
        try {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
        } catch (storageError) {
          console.error('Error saving to AsyncStorage:', storageError);
        }
        
        setIsCreateModalVisible(false);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error saving entry:', error);
      setIsLoading(false);
    }
  };

  const filteredEntries = selectedCategory === 'All' 
    ? entries 
    : entries.filter(entry => entry.categories.includes(selectedCategory));

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
            <>
              {/* Categories Label */}
              <Text style={styles.categoriesLabel}>Categories</Text>

              {/* Category Filter Tabs */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesScroll}
                contentContainerStyle={styles.categoriesContent}
              >
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setSelectedCategory(cat)}
                    style={styles.categoryTab}
                  >
                    <Text
                      style={[
                        styles.categoryTabText,
                        selectedCategory === cat && styles.categoryTabTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                    {selectedCategory === cat && (
                      <View style={styles.categoryTabUnderline} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Journal Entries List */}
              <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                {filteredEntries.length > 0 ? (
                  filteredEntries.map((entry) => (
                    <JournalEntryCard
                      key={entry.id}
                      title={entry.title}
                      category={entry.categories[0] || 'Memories'}
                      mood={entry.mood}
                      thoughts={entry.thoughts}
                      date={entry.date}
                      photo={entry.photos[0]}
                    />
                  ))
                ) : (
                  <View style={styles.noEntriesContainer}>
                    <Text style={styles.noEntriesText}>
                      No entries in this category
                    </Text>
                  </View>
                )}
              </ScrollView>
            </>
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
    flexDirection: 'column',
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
    paddingBottom: ms(10),
    paddingHorizontal: ms(spacing.lg),
    paddingTop: ms(spacing.md),
  },
  categoriesLabel: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: '600',
    paddingHorizontal: ms(spacing.lg),
    marginTop: ms(spacing.md),
    marginBottom: ms(spacing.sm),
  } as TextStyle,
  categoriesScroll: {
    paddingVertical: ms(spacing.md),
  } as ViewStyle,
  categoriesContent: {
    paddingHorizontal: ms(spacing.md),
    gap: ms(spacing.sm),
  } as ViewStyle,
  categoryTab: {
    alignItems: 'center',
    paddingBottom: ms(spacing.sm),
    width: ms(105),
  } as ViewStyle,
  categoryTabText: {
    ...typography.bodyMedium,
    color: colors.textGrey1,
    marginBottom: ms(spacing.xs),
    flexshrink:1,
  } as TextStyle,
  categoryTabTextActive: {
    color: colors.textPrimary,
    fontWeight: '600',
  } as TextStyle,
  categoryTabUnderline: {
    height: ms(2),
    width: ms(50),
    backgroundColor: colors.primary,
  } as ViewStyle,
  noEntriesContainer: {
    paddingVertical: ms(spacing.xl),
    alignItems: 'center',
  } as ViewStyle,
  noEntriesText: {
    ...typography.bodyMedium,
    color: colors.textGrey1,
  } as TextStyle,
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
