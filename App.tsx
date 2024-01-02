import 'react-native-gesture-handler';
import * as Font from 'expo-font';
import Fonts from '@app/constants/Fonts';
import { useColorScheme } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { View } from '@app/components/themed/View';
import { useCallback, useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer, ThemeProvider } from '@react-navigation/native';
import { AppLayout } from '@app/Layout';
import { StatusBar } from 'expo-status-bar';
import { useSecureStore } from '@app/hooks/useSecureStore';
import strings from '@app/constants/strings';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


SplashScreen.preventAutoHideAsync();

export default function App() {

  const colorScheme = useColorScheme();

  const [appConfig, setAppConfig] = useState<{ appIsReady: boolean, isAppFirstLaunch: boolean }>({ appIsReady: false, isAppFirstLaunch: false });

  const { getAsync, createDirectory } = useSecureStore();

  useEffect(() => {
    const prepareAppLaunch = async () => {
      try {
        await Font.loadAsync(Fonts);
        await createDirectory();
      } catch (e) {
        console.log(e);
      } finally {
        const value = await getAsync(strings.storageKey.APP_FIRST_LAUNCH);
        setAppConfig({
          isAppFirstLaunch: !Boolean(value),
          appIsReady: true
        })
      }
    }
    prepareAppLaunch();
  }, [])

  const onLayoutRootView = useCallback(async () => {
    if (appConfig.appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appConfig]);

  if (!appConfig.appIsReady) {
    return null;
  }


  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View className='flex-1' onLayout={onLayoutRootView}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <AppLayout isAppFirstLaunch={appConfig.isAppFirstLaunch} />
        </NavigationContainer>
        </GestureHandlerRootView>
      </View>
    </ThemeProvider>
  );
}
