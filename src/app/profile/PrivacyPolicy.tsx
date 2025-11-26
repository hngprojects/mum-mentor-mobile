// app/profile/PrivacyPolicyScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

// --- Style Imports ---
import { colors, fontFamilies, spacing, typography } from "../../core/styles";
import { ms } from "../../core/styles/scaling";

export default function PrivacyPolicyScreen() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleDownloadPDF = () => {
    Alert.alert(
      "Download PDF",
      "Privacy Policy PDF will be downloaded.",
      [{ text: "OK" }]
    );
    // Implement PDF download logic here
  };

  const handleContactSupport = async () => {
    const email = "support@nora.ai";
    const subject = "Privacy Policy Inquiry";
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      }
    } catch (error) {
      Alert.alert("Error", "Unable to open email client");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Feather name="arrow-left" size={ms(24)} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Privacy Policy</Text>
          <Text style={styles.subtitle}>
            We respect your privacy and keep your information safe.
          </Text>
          <Text style={styles.effectiveDate}>Effective: July 28, 2025</Text>
        </View>

        {/* Table of Contents */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Table Of Content</Text>
          <View style={styles.tocList}>
            <Text style={styles.tocItem}>• Introductions</Text>
            <Text style={styles.tocItem}>• Information We Collect</Text>
            <Text style={styles.tocItem}>• How We Use Your Information</Text>
            <Text style={styles.tocItem}>• Sharing Your Information</Text>
            <Text style={styles.tocItem}>• Your Choices and Rights</Text>
            <Text style={styles.tocItem}>• Security Measures</Text>
            <Text style={styles.tocItem}>• Security Measures</Text>
            <Text style={styles.tocItem}>• Changes to This Privacy Policy</Text>
            <Text style={styles.tocItem}>• Contact Us</Text>
            <Text style={styles.tocItem}>• Last Updated</Text>
          </View>
        </View>

        {/* Introduction */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Introduction</Text>
          <Text style={styles.bodyText}>
            This Privacy Policy explains how we collect, 
            use, share, and safeguard your information when 
            you use our mobile application. By using the Service, 
            you consent to the practices outlined in this policy. 
            If you do not agree, please discontinue use immediately.
          </Text>
        </View>

        {/* Information We Collect */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information We Collect</Text>
          <Text style={styles.bodyText}>
            We may collect personal information such as 
            your name, email address, contact details, and 
            any other information you provide while using 
            our platform. We also collect usage data, 
            including the pages or features you access, 
            the duration of your visit, and other technical 
            information such as your device type, browser type, 
            operating system, IP address, and other details 
            automatically collected through cookies or 
            tracking technologies.
          </Text>
        </View>

        {/* How We Use The Information We Collect */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            How We Use The Information We Collect
          </Text>

          <Text style={styles.subsectionTitle}>
            Providing and Personalizing the Service
          </Text>
          <Text style={styles.bodyText}>
            We use your information to deliver responses, 
            remember conversations, and offer a personalized 
            experience. For example, the app may recall previous 
            details such as your child's allergies to provide more 
            relevant suggestions (like egg-free breakfast ideas). 
            This information also helps generate tailored content 
            for reviews, activities, emotional support, meal plans, 
            and scheduling.
          </Text>

          <Text style={styles.subsectionTitle}>Improving the App</Text>
          <Text style={styles.bodyText}>
            We analyze usage patterns anonymously to understand 
            which features users enjoy most. This helps us improve 
            functionality, fix bugs, resolve crashes, and enhance 
            the overall user experience.
          </Text>

          <Text style={styles.subsectionTitle}>
            Safety and Content Moderation
          </Text>
          <Text style={styles.bodyText}>
            Your information will be used to detect and prevent 
            harmful, misleading, or abusive content. This allows 
            us to maintain a safe and supportive environment for all parents.
          </Text>

          <Text style={styles.subsectionTitle}>Research and Model Training</Text>
          <Text style={styles.bodyText}>
            We may use fully anonymized and aggregated conversation 
            data to train and improve future versions of Nora. 
            This process does not include personal identifiers, 
            raw conversations, or any information that could be 
            used to re-identify you or your family.
          </Text>
        </View>

        {/* Data Sharing and Disclosure */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Sharing and Disclosure</Text>

          <Text style={styles.subsectionTitle}>Service Providers</Text>
          <Text style={styles.bodyText}>
            We work with a small number of trusted 
            third-party vendors (e.g., cloud hosting, error monitoring) 
            who are bound by strict contractual and security measures 
            and only process data on our behalf.
          </Text>

          <Text style={styles.subsectionTitle}>Legal Requirements</Text>
          <Text style={styles.bodyText}>
            We will only disclose information if required by law, 
            court order, or to protect the rights, property, 
            or safety of Nora, our users, or the public.
          </Text>

          <Text style={styles.subsectionTitle}>Business Transfers</Text>
          <Text style={styles.bodyText}>
            In the unlikely event of a merger, acquisition, 
            or sale, your personal data would only be transferred 
            under equivalent or stronger privacy protections.
          </Text>
        </View>

        {/* Data Retention and Deletion */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Data Retention and Deletion
          </Text>

          <Text style={styles.subsectionTitle}>Conversation History</Text>
          <Text style={styles.bodyText}>
            Chats are retained only for as long as necessary to 
            support your experience. You may delete individual 
            conversations or your entire chat history at any time. 
            When you delete an individual conversation or your entire 
            history, that data is erased promptly.
          </Text>

          <Text style={styles.subsectionTitle}>Account Deletion</Text>
          <Text style={styles.bodyText}>
            You can request full account deletion through 
            Settings by selecting "Delete My Account" or by contacting s
            upport@nora.ai. All personal data is permanently erased within 
            30 days. Once deleted, we cannot recover it. Within that window, 
            however, aggregate/anonymized trace of your chats or profile 
            remains recoverable.
          </Text>
        </View>

        {/* Security of Your Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security of Your Information</Text>
          <Text style={styles.bodyText}>
            We employ industry-leading security measures to protect 
            your data. All communications are protected with end-to-end 
            encryption both in transit and at rest. We also conduct regular 
            penetration testing and vulnerability assessments to ensure the 
            platform remains secure. Access to internal systems is strictly 
            controlled, with only a very small number of authorized personnel 
            granted limited privileges to perform critical operations. 
            In addition, all information is stored in secure data centers 
            that meet ISO 27001, SOC 2 Type II, and equivalent certification 
            standards. Although no system can be completely impervious to 
            attacks, we uphold the highest technical rigor and continuously 
            work to strengthen our defenses.
          </Text>
        </View>

        {/* Children's Privacy (COPPA Compliance) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Children's Privacy (COPPA Compliance)
          </Text>
          <Text style={styles.bodyText}>
            Nora is designed exclusively for parents and guardians 
            of children under 13. We do not knowingly collect personal 
            information from children under 13. If we discover any 
            child-related data has been uploaded inadvertently, 
            it is immediately and permanently deleted.
          </Text>
        </View>

        {/* International Data Transfers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>International Data Transfers</Text>
          <Text style={styles.bodyText}>
            Nora is operated from Nigeria, and your information 
            is initially processed and stored on secure servers 
            in Nigeria. We use GDPR-compliant data centers located 
            in Africa, mainly in South Africa and Nigeria, which 
            meet rigorous international standards, including ISO 27001 and 
            SOC 2 Type II certifications.
          </Text>
          <Text style={styles.bodyText}>
            Any data may be transferred occasionally, for example, 
            to trusted subprocessors in the European Economic Area (EEA) 
            or the United States. When such transfers occur, they are 
            carried out in full compliance with the Nigerian Data 
            Protection Act (NDPA), GDPR, and other laws, supported 
            by appropriate legal safeguards. These include standard 
            contractual clauses approved by the European Commission, 
            Binding Corporate Rules where relevant, and additional 
            protective measures to ensure that protection is essentially 
            equivalent to the Nigerian and EU standards. We work across 
            jurisdictions and work only with partners of ours that 
            demonstrate and maintain strong and robust standards of 
            data protection.
          </Text>
          <Text style={styles.bodyText}>
            For users in the European Economic Area, the 
            transfer is backed by approved legal safeguards, 
            including the latest EU Standard Contractual Clauses or 
            a completed Transfer Risk Impact Assessment, to ensure 
            that your data receives a level of protection that meets 
            or exceeds local requirements. Finally, even though 
            primary processing occurs in Nigeria, for transparency, 
            fairness, purpose limitation, data minimization, accuracy, 
            storage limitation, integrity, confidentiality, and accountability.
          </Text>
        </View>

        {/* Your Privacy Rights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Privacy Rights</Text>
          <Text style={styles.bodyText}>
            Depending on your jurisdiction, you have certain 
            rights regarding your personal information. These may 
            include the right to access your data and receive a copy 
            of it, the right to correct any information that is inaccurate 
            or incomplete, the right to delete your data. You may also 
            have the right to object to or restrict how your data is 
            processed or processed in specific situations, the right to 
            receive your data in a structured, common format, and the 
            right to withdraw your consent to data processing.
          </Text>
        </View>

        {/* Changes to This Policy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Changes to This Policy</Text>
          <Text style={styles.bodyText}>
            We may update this policy from time to time. Any changes 
            will be posted here, with a new "Last Updated" date. 
            Significant changes will be communicated inside the 
            app and/or via email if you have provided one.
          </Text>
        </View>

        {/* Contact Us */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.bodyText}>
            If you have any questions, concerns, or requests regarding 
            your privacy or how your information is handled on Nora, 
            you can reach us at support@nora.ai. We are committed to 
            addressing all inquiries promptly and providing clear 
            guidance regarding our privacy practices. For immediate 
            assistance, please reach out via email at support@nora.ai, 
            and we will respond as soon as possible to ensure that you 
            remain informed, empowered, and confident in your use of Nora.
          </Text>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={handleContactSupport}
          >
            <Feather name="mail" size={ms(20)} color={colors.textWhite} />
            <Text style={styles.contactButtonText}>
              Contact us: support@nora.ai
            </Text>
          </TouchableOpacity>
        </View>

        {/* Download PDF Button */}
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={handleDownloadPDF}
        >
          <Text style={styles.downloadButtonText}>Download PDF</Text>
        </TouchableOpacity>

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: ms(spacing.lg),
    paddingVertical: ms(spacing.md),
    backgroundColor: colors.textWhite,
    gap: ms(spacing.md),
  },
  backButton: {
    padding: ms(spacing.xs),
  },
  headerTitle: {
    fontSize: typography.heading2.fontSize,
    fontFamily: fontFamilies.bold,
    color: colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: ms(spacing.lg),
    paddingTop: ms(spacing.xl),
    paddingBottom: ms(spacing.xxl),
  },
  titleSection: {
    alignItems: "center",
    marginBottom: ms(spacing.xl),
  },
  mainTitle: {
    fontSize: ms(28),
    fontFamily: fontFamilies.bold,
    color: colors.textPrimary,
    marginBottom: ms(spacing.sm),
    textAlign: "center",
  },
  subtitle: {
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: fontFamilies.regular,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: ms(spacing.xs),
  },
  effectiveDate: {
    fontSize: typography.bodySmall.fontSize,
    fontFamily: fontFamilies.regular,
    color: colors.textGrey1,
    textAlign: "center",
  },
  section: {
    marginBottom: ms(spacing.xl),
  },
  sectionTitle: {
    fontSize: typography.heading3.fontSize,
    fontFamily: fontFamilies.bold,
    color: colors.textPrimary,
    marginBottom: ms(spacing.md),
  },
  subsectionTitle: {
    fontSize: typography.bodyLarge.fontSize,
    fontFamily: fontFamilies.semiBold,
    color: colors.textPrimary,
    marginTop: ms(spacing.md),
    marginBottom: ms(spacing.sm),
  },
  bodyText: {
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: fontFamilies.regular,
    color: colors.textSecondary,
    lineHeight: typography.bodyMedium.fontSize * 1.6,
    marginBottom: ms(spacing.sm),
  },
  tocList: {
    gap: ms(spacing.xs),
  },
  tocItem: {
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: fontFamilies.regular,
    color: colors.textSecondary,
    lineHeight: typography.bodyMedium.fontSize * 1.5,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingVertical: ms(spacing.md),
    paddingHorizontal: ms(spacing.lg),
    borderRadius: ms(8),
    marginTop: ms(spacing.md),
    gap: ms(spacing.sm),
  },
  contactButtonText: {
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: fontFamilies.semiBold,
    color: colors.textWhite,
  },
  downloadButton: {
    backgroundColor: colors.error,
    paddingVertical: ms(16),
    paddingHorizontal: ms(spacing.lg),
    borderRadius: ms(8),
    alignItems: "center",
    marginTop: ms(spacing.lg),
  },
  downloadButtonText: {
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: fontFamilies.semiBold,
    color: colors.textWhite,
  },
  footer: {
    height: ms(spacing.xl),
  },
});