import { ThemeProvider as NavThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useFonts, Fraunces_500Medium, Fraunces_600SemiBold } from '@expo-google-fonts/fraunces';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { IBMPlexMono_400Regular, IBMPlexMono_500Medium } from '@expo-google-fonts/ibm-plex-mono';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useTheme } from '@/components/Theme';
import { View, useColorScheme, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AttendanceProvider } from '@/context/AttendanceContext';
import { ProfileProvider } from '@/context/ProfileContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const [loaded] = useFonts({
    Fraunces_500Medium,
    Fraunces_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      
      // Load saved theme preference
      AsyncStorage.getItem('theme-preference').then((pref) => {
        if (pref === 'light' || pref === 'dark') {
          Appearance.setColorScheme(pref);
        }
      }).catch(() => {});
    }
  }, [loaded]);

  const theme = useTheme();
  const colorScheme = useColorScheme();

  if (!loaded) {
    return null;
  }

  return (
    <AttendanceProvider>
      <ProfileProvider>
        <NavThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <View style={{ flex: 1, backgroundColor: theme.background }}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen 
                name="subject-modal" 
                options={{ 
                  presentation: 'modal', 
                  title: 'Subject',
                  headerStyle: { backgroundColor: theme.background },
                  headerTintColor: theme.text,
                  headerShadowVisible: false,
                }} 
              />
            </Stack>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          </View>
        </NavThemeProvider>
      </ProfileProvider>
    </AttendanceProvider>
  );
}
