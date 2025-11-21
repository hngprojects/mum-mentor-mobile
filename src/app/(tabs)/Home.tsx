import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

const Home = () => {
  return (
    <View>
      <SafeAreaView>
      <Text>Home</Text>
      <View >
        <Link href="/(tabs)/setup/childSetupScreen">Go to Child Setup Setup</Link>
        <Link href="/(tabs)/setup/Mum">Go to Mum Setup Setup</Link>
      </View>
      </SafeAreaView>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({

  
})