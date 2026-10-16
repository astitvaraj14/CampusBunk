import { Tabs } from 'expo-router';
import React from 'react';
import { View, StyleSheet, Platform, Pressable, useColorScheme } from 'react-native';
import { Layout, Shadows, useTheme } from '@/components/Theme';
import { Home, Briefcase, BarChart3, User } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const colorScheme = useColorScheme();

  return (
    <View style={[styles.tabBarContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
      <View style={[styles.tabBar, { backgroundColor: theme.surfaceBlur }]}>
        <BlurView intensity={80} tint={colorScheme === 'dark' ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          let IconComponent = Home;
          if (route.name === 'subjects') IconComponent = Briefcase;
          if (route.name === 'overview') IconComponent = BarChart3;
          if (route.name === 'profile') IconComponent = User;

          return (
            <Pressable
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabItem}
            >
              <View style={[
                styles.iconContainer,
                isFocused && { backgroundColor: theme.accent }
              ]}>
                <IconComponent 
                  size={24} 
                  color={isFocused ? '#FFFFFF' : theme.textSoft} 
                  strokeWidth={isFocused ? 2.5 : 2}
                />
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="subjects"
        options={{
          title: 'Subjects',
        }}
      />
      <Tabs.Screen
        name="overview"
        options={{
          title: 'Overview',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 20,
    left: 20,
    right: 20,
  },
  tabBar: {
    flexDirection: 'row',
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'space-around',
    ...Shadows.darkMd,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
