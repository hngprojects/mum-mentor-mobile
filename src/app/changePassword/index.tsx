import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { colors, typography } from '@/src/core/styles'
import { ms, rbr, vs } from '@/src/core/styles/scaling'
import { router } from 'expo-router'
import CustomInput from '../components/CustomInput'

const arrowRight = require("../../assets/images/arrow-right.png");

const Password = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Password</Text>
      </View>
      <TouchableOpacity style={styles.buttonContainer} onPress={() => router.push('/changePassword/ChangePassword')}>
        <View style={styles.buttonContent}>
          <Text style={styles.buttonLabel}>Change Password</Text>
          <Image source={arrowRight} style={styles.arrowIcon} />
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default Password

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(20),
    paddingTop: vs(50),
    paddingBottom: vs(16),
    backgroundColor: colors.backgroundMain,
  },
  backButton: {
    width: ms(40),
    height: ms(40),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    ...typography.heading2,
    color: colors.textPrimary,
    flex: 1,
  },
  buttonText:{
    borderWidth: 1,
    borderColor: colors.backgroundMuted,
    padding: ms(16),
    borderRadius: rbr(12),
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: ms(16),
  },
  buttonContainer: {
    marginHorizontal: 20,
    borderRadius: rbr(12),
    borderWidth: 2,
    borderColor: colors.backgroundSubtle,
    marginTop: 12,
  },
   buttonLabel: {
    ...typography.labelLarge,
    color: colors.textPrimary,
  },
  arrowIcon:{
    width: ms(24),
    height: ms(24),
    resizeMode: "contain",
  }
})