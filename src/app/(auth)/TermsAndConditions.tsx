import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../core/styles/index';
import { rfs, ms } from '../../core/styles/scaling';
import { router } from 'expo-router';

export default function TermsAndConditionsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={rfs(28)} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms and Conditions</Text>
        <View style={{ width: rfs(28) }}></View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>        
        <Text style={styles.sectionTitle}>Nora+ Terms of Service</Text>

        <Text style={styles.text}>
          Welcome to Nora+. These Terms and Conditions govern your use of our website, mobile app, and AI-based services. By accessing or using our services, you agree to comply with these terms and any future revisions. If you do not agree, please discontinue use of our platform.
        </Text>

        <Text style={styles.sectionTitle}>User Obligations</Text>

        <Text style={styles.subTitle}>1. Provide Accurate Information</Text>
        <Text style={styles.text}>
          When creating an account, you must provide accurate and complete information, including your name, email, and any other required details. Providing false or misleading information may result in account suspension or termination.
        </Text>

        <Text style={styles.subTitle}>2. Maintain Account Security</Text>
        <Text style={styles.text}>
          You are responsible for maintaining the confidentiality of your account credentials. Do not share your password with anyone. Nora+ is not responsible for losses due to unauthorized access. Immediate action may be taken to secure your account.
        </Text>

        <Text style={styles.subTitle}>3. Comply with Applicable Laws</Text>
        <Text style={styles.text}>
          Use our services in accordance with local, national, and international laws. Any illegal activity may result in immediate termination of your account and could be reported to authorities.
        </Text>

        <Text style={styles.subTitle}>4. Use the Services as Intended</Text>
        <Text style={styles.text}>
          Nora+ is designed for personal use and AI-assisted purposes like support, motivation, productivity, and mental wellness. Do not misuse the platform or attempt security breaches, reverse engineering, or any activity that interferes with system operations.
        </Text>

        <Text style={styles.sectionTitle}>Acceptable Use Policy</Text>

        <Text style={styles.subTitle}>To maintain a positive and supportive environment, all users must adhere to the following:</Text>

        <Text style={styles.bullet}>• Respectful Communication: Interact respectfully with others. Do not harass, insult, or use abusive or inflammatory language.</Text>
        <Text style={styles.bullet}>• No Misrepresentation: Do not impersonate any person or entity, and always represent yourself truthfully.</Text>
        <Text style={styles.bullet}>• Privacy Protection: Do not collect or store personal data of other users without consent. Respect privacy boundaries.</Text>
        <Text style={styles.bullet}>• Policy Compliance: Follow all Nora+ policies, including Privacy Policy and community guidelines.</Text>

        <Text style={styles.sectionTitle}>Intellectual Property Rights</Text>

        <Text style={styles.text}>
          • Ownership of Content: All content, including AI-generated guidance, text, graphics, and logos, is owned by Nora+ or its partners. Unauthorized use is prohibited.
        </Text>
        <Text style={styles.text}>
          • User-Generated Content: By submitting content, you grant Nora+ a worldwide, non-exclusive, royalty-free license to use, modify, reproduce, and distribute it in connection with our services.
        </Text>
        <Text style={styles.text}>
          • Infringement Claims: Report any rights violations to Nora+. We reserve the right to disable your account if you infringe intellectual property rights.
        </Text>
        <Text style={styles.text}>
          • Trademarks: Nora+ trademarks cannot be used without prior written consent.
        </Text>

        <Text style={styles.sectionTitle}>Governing Law and Dispute Resolution</Text>

        <Text style={styles.text}>
          • Governing Law: These Terms are governed by the laws of your country/region.
        </Text>
        <Text style={styles.text}>
          • Legal Action: Legal actions will be brought exclusively before courts of your jurisdiction.
        </Text>
        <Text style={styles.text}>
          • Dispute Resolution: Users agree to attempt informal resolution before pursuing formal dispute action.
        </Text>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(spacing.lg),
    paddingVertical: ms(spacing.md),
    gap: ms(spacing.md),
  },
  headerTitle: {
    fontSize: rfs(typography.heading1.fontSize),
    fontFamily: typography.heading2.fontFamily,
    color: colors.textPrimary,
  },
  scrollContainer: {
    paddingHorizontal: ms(spacing.lg),
    paddingTop: ms(spacing.lg),
    paddingBottom: 80,
  },
  sectionTitle: {
    fontSize: rfs(typography.heading2.fontSize),
    fontFamily: typography.heading3.fontFamily,
    color: colors.textPrimary,
    marginTop: ms(spacing.lg),
    marginBottom: ms(spacing.sm),
  },
  subTitle: {
    fontSize: rfs(typography.heading2.fontSize),
    fontFamily: typography.bodyMedium.fontFamily,
    color: colors.textPrimary,
    marginTop: ms(spacing.md),
    marginBottom: ms(spacing.xs),
    textAlign: 'justify'
  },
  text: {
    fontSize: rfs(typography.bodySmall.fontSize),
    fontFamily: typography.bodySmall.fontFamily,
    color: colors.textGrey1,
    lineHeight: 20,
    marginBottom: ms(spacing.sm),
    alignItems: 'center',
    textAlign: 'justify'
  },
  bullet: {
    fontSize: rfs(typography.bodySmall.fontSize),
    fontFamily: typography.bodySmall.fontFamily,
    color: colors.textGrey1,
    lineHeight: 20,
    marginBottom: ms(spacing.sm),
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'justify'
  },
});
