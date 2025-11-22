import { Tabs } from "expo-router";
import React from "react";
import { Image, StyleSheet } from "react-native";

import { colors, fontFamilies } from "../../core/styles/index";
import { vs } from "../../core/styles/scaling";

const TAB_ICONS = {
  Home: require("../../assets/images/home.png"),
  AiChat: require("../../assets/images/Ai-chat.png"),
  Milestone: require("../../assets/images/milestone.png"),
  Gallery: require("../../assets/images/galery.png"),
  Community: require("../../assets/images/community.png"),
} as const;

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textGrey2,
        tabBarLabelStyle: {
          fontFamily: fontFamilies.medium,
          fontSize: 12,
        },
        tabBarStyle: {
          borderTopColor: colors.outlineVariant,
          backgroundColor: colors.textWhite,
          height: vs(80),
        },
        tabBarIcon: ({ focused }) => {
          const icon = TAB_ICONS[route.name as keyof typeof TAB_ICONS];
          if (!icon) {
            return null;
          }

          return (
            <Image
              source={icon}
              style={[
                styles.tabIcon,
                focused ? styles.tabIconActive : styles.tabIconInactive,
              ]}
            />
          );
        },
      })}
    >
      <Tabs.Screen name="Home" options={{ title: "Home" }} />
      <Tabs.Screen name="AiChat" options={{ title: "AI Chat" }} />
      <Tabs.Screen name="Milestone" options={{ title: "Milestone" }} />
      <Tabs.Screen name="Gallery" options={{ title: "Gallery" }} />
      <Tabs.Screen name="Community" options={{ title: "Community" }} />
    </Tabs>
  );
};

export default TabLayout;

const styles = StyleSheet.create({
  tabIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  tabIconActive: {
    tintColor: colors.primary,
  },
  tabIconInactive: {
    tintColor: colors.textGrey2,
  },
});